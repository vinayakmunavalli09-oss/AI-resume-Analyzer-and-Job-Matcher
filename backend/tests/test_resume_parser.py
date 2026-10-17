"""
Tests for resume parser and file upload validation.
"""
import io
import unittest
from fastapi import UploadFile
import docx

from app.services.resume_parser import parse_resume
from app.core.exceptions import (
    ResumeParseError,
    FileTooLargeError,
    UnsupportedFileTypeError,
)

SAMPLE_PDF = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 85 >> stream
BT
/F1 12 Tf
72 712 Td
(Rahul Sharma rahul@example.com +919876543210 Python FastAPI SQL B.Tech Graduate) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000378 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
454
%%EOF"""


def make_docx_bytes(content: str) -> bytes:
    doc = docx.Document()
    for para in content.split("\n"):
        if para.strip():
            doc.add_paragraph(para.strip())
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


class TestResumeParser(unittest.IsolatedAsyncioTestCase):
    async def test_parse_valid_pdf(self):
        upload = UploadFile(
            file=io.BytesIO(SAMPLE_PDF),
            filename="resume.pdf",
            headers={"content-type": "application/pdf"},
        )
        result = await parse_resume(upload)
        self.assertIn("Rahul Sharma", result.extracted_text)
        self.assertIn("Python", result.extracted_text)
        self.assertGreater(result.word_count, 0)

    async def test_parse_valid_docx(self):
        content = (
            "Ananya Sen\n"
            "Email: ananya@example.com\n"
            "Education: Bachelor of Technology in Computer Science\n"
            "Skills: Python, React, SQL, Git, FastAPI\n"
            "Projects: AI Career Guidance Platform using FastAPI and Next.js"
        )
        docx_bytes = make_docx_bytes(content)
        upload = UploadFile(
            file=io.BytesIO(docx_bytes),
            filename="ananya_resume.docx",
            headers={
                "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            },
        )
        result = await parse_resume(upload)
        self.assertIn("Ananya Sen", result.extracted_text)
        self.assertIn("FastAPI", result.extracted_text)
        self.assertGreater(result.word_count, 15)

    async def test_reject_empty_file(self):
        upload = UploadFile(
            file=io.BytesIO(b""),
            filename="empty.pdf",
            headers={"content-type": "application/pdf"},
        )
        with self.assertRaises(ResumeParseError) as ctx:
            await parse_resume(upload)
        self.assertIn("empty", str(ctx.exception.message).lower())

    async def test_reject_unsupported_extension(self):
        upload = UploadFile(
            file=io.BytesIO(b"malicious script content"),
            filename="script.exe",
            headers={"content-type": "application/x-msdownload"},
        )
        with self.assertRaises(UnsupportedFileTypeError):
            await parse_resume(upload)

    async def test_reject_oversized_file(self):
        # 6 MB of dummy data
        big_data = b"%PDF" + (b"0" * (6 * 1024 * 1024))
        upload = UploadFile(
            file=io.BytesIO(big_data),
            filename="huge.pdf",
            headers={"content-type": "application/pdf"},
        )
        with self.assertRaises(FileTooLargeError):
            await parse_resume(upload)


if __name__ == "__main__":
    unittest.main()
