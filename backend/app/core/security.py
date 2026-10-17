"""
Security helpers: rate limiting setup, file validation constants.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared limiter instance — mounted in main.py
limiter = Limiter(key_func=get_remote_address)

# Allowed MIME types for resume uploads
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# Allowed file extensions (secondary check after MIME)
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
