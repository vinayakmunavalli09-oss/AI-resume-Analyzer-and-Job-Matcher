"""
Custom exceptions and FastAPI exception handlers.
"""
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom exception types
# ---------------------------------------------------------------------------

class ResumeParseError(Exception):
    """Raised when the uploaded resume cannot be parsed."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class FileTooLargeError(Exception):
    """Raised when the uploaded file exceeds the size limit."""
    def __init__(self, max_mb: int):
        self.message = f"File exceeds the maximum allowed size of {max_mb} MB."
        self.status_code = 413
        super().__init__(self.message)


class UnsupportedFileTypeError(Exception):
    """Raised when the uploaded file is not PDF or DOCX."""
    def __init__(self, content_type: str = ""):
        self.message = (
            f"Unsupported file type '{content_type}'. "
            "Only PDF and DOCX files are accepted."
        )
        self.status_code = 415
        super().__init__(self.message)


class NvidiaUnavailableError(Exception):
    """Raised when the NVIDIA NIM API is not reachable or not configured."""
    def __init__(self, detail: str = ""):
        self.message = "AI analysis service is currently unavailable."
        self.detail = detail
        self.status_code = 503
        super().__init__(self.message)


class AnalysisNotFoundError(Exception):
    """Raised when a requested analysis_id does not exist."""
    def __init__(self, analysis_id: str):
        self.message = f"Analysis '{analysis_id}' not found."
        self.status_code = 404
        super().__init__(self.message)


# ---------------------------------------------------------------------------
# Handler registration
# ---------------------------------------------------------------------------

def register_exception_handlers(app: FastAPI) -> None:
    """Attach all custom exception handlers to the FastAPI app."""

    @app.exception_handler(ResumeParseError)
    async def resume_parse_error_handler(request: Request, exc: ResumeParseError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(FileTooLargeError)
    async def file_too_large_handler(request: Request, exc: FileTooLargeError):
        return JSONResponse(
            status_code=413,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(UnsupportedFileTypeError)
    async def unsupported_file_type_handler(request: Request, exc: UnsupportedFileTypeError):
        return JSONResponse(
            status_code=415,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(NvidiaUnavailableError)
    async def nvidia_unavailable_handler(request: Request, exc: NvidiaUnavailableError):
        logger.error("NVIDIA NIM unavailable: %s", exc.detail)
        return JSONResponse(
            status_code=503,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(AnalysisNotFoundError)
    async def analysis_not_found_handler(request: Request, exc: AnalysisNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": str(exc.detail)},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        errors = [
            {"field": ".".join(str(l) for l in e["loc"]), "msg": e["msg"]}
            for e in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": "Validation error",
                "detail": errors,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        # Log the real error server-side but never expose stack traces to clients
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "An unexpected internal error occurred."},
        )
