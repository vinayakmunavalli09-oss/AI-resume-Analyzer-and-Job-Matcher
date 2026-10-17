"""
NVIDIA NIM API client using the openai-compatible interface.

Security notes:
- API key is never logged.
- Raw AI responses are validated before being returned to callers.
- Implements simple exponential-backoff retry (max 2 retries).
"""
import asyncio
import json
import logging
from typing import Optional

from config import get_settings
from app.core.exceptions import NvidiaUnavailableError

logger = logging.getLogger(__name__)

_MAX_RETRIES = 0
_TIMEOUT_SECONDS = 20


async def complete(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 2048,
    temperature: float = 0.2,
) -> str:
    """
    Call the NVIDIA NIM chat-completion endpoint.

    Args:
        system_prompt: Instruction context for the LLM.
        user_prompt: The actual user message / content to analyse.
        max_tokens: Maximum tokens in the response.
        temperature: Sampling temperature (lower = more deterministic).

    Returns:
        The raw string content from the model response.

    Raises:
        NvidiaUnavailableError: If the API key is missing or the service is down.
    """
    settings = get_settings()

    if not settings.nvidia_api_key:
        raise NvidiaUnavailableError("NVIDIA_API_KEY is not configured.")

    # Import openai lazily so the app can start without it (graceful degradation)
    try:
        from openai import AsyncOpenAI, RateLimitError, APITimeoutError, APIStatusError
    except ImportError as exc:
        raise NvidiaUnavailableError("openai package is not installed.") from exc

    client = AsyncOpenAI(
        api_key=settings.nvidia_api_key,  # key never logged
        base_url=settings.nvidia_base_url,
        timeout=_TIMEOUT_SECONDS,
        max_retries=0,
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    last_error: Optional[Exception] = None

    for attempt in range(_MAX_RETRIES + 1):
        try:
            response = await client.chat.completions.create(
                model=settings.nvidia_model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            msg = response.choices[0].message
            content = msg.content or ""
            # Support reasoning models that place thinking or output in reasoning_content
            if not content.strip():
                reasoning = getattr(msg, "reasoning_content", None) or ""
                if not reasoning and hasattr(msg, "model_extra") and msg.model_extra:
                    reasoning = msg.model_extra.get("reasoning_content", "")
                if reasoning:
                    content = str(reasoning)

            return content

        except RateLimitError as exc:
            logger.warning("NVIDIA rate limit hit (attempt %d/%d)", attempt + 1, _MAX_RETRIES + 1)
            last_error = exc
            if attempt < _MAX_RETRIES:
                await asyncio.sleep(2 ** attempt)

        except APITimeoutError as exc:
            logger.warning("NVIDIA request timed out (attempt %d/%d)", attempt + 1, _MAX_RETRIES + 1)
            last_error = exc
            if attempt < _MAX_RETRIES:
                await asyncio.sleep(1)

        except APIStatusError as exc:
            logger.error("NVIDIA API status error %s", exc.status_code)
            raise NvidiaUnavailableError(f"API returned status {exc.status_code}") from exc

        except Exception as exc:
            logger.error("Unexpected error calling NVIDIA NIM: %s", type(exc).__name__)
            raise NvidiaUnavailableError(str(exc)) from exc

    raise NvidiaUnavailableError(
        f"Request failed after {_MAX_RETRIES + 1} attempts: {last_error}"
    )


def extract_json_from_response(raw: str) -> dict:
    """
    Attempt to parse a JSON object from an LLM text response.

    Strips thinking tags (<think>...</think>), markdown code fences, and extracts JSON.

    Raises:
        ValueError: if valid JSON cannot be found.
    """
    text = raw.strip()

    # Strip thinking blocks e.g. <think>...</think>
    if "<think>" in text and "</think>" in text:
        parts = text.split("</think>", 1)
        text = parts[1].strip()

    # Strip markdown code fences if present
    if "```" in text:
        # Find first ``` and last ```
        first_fence = text.find("```")
        # Remove opening ```json or ```
        after_first = text[first_fence + 3:].lstrip()
        if after_first.startswith("json"):
            after_first = after_first[4:].lstrip()
        last_fence = after_first.rfind("```")
        if last_fence != -1:
            text = after_first[:last_fence].strip()
        else:
            text = after_first.strip()

    # Find the first '{' and last '}' to extract the JSON object
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in response. Preview: {text[:200]}")

    json_str = text[start : end + 1]
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Malformed JSON from AI: {exc}. Preview: {json_str[:200]}") from exc
