📘 Document Summary Assistant

A fully responsive web app that allows users to upload PDF/Image documents, extract text using OCR/PDF parsing, and generate AI-powered summaries using Google Gemini 2.5 Flash-Lite.
Recent documents and extracted summaries are stored using Supabase.

✨ Features
📄 Document Upload

Upload PDF or Image files
Drag-and-drop & file picker support


🔎 Text Extraction

PDF Parsing using pdfjs-dist
OCR (Optical Character Recognition) using tesseract.js

🤖 AI Summaries (Gemini)

Short Summary (2–3 sentences)
Medium Summary (1 paragraph)
Long Summary (2–3 paragraphs)
Extracts 5–7 key points

🗂️ Document History

Saves documents & summaries in Supabase
Fetch the most recent processed documents

🎨 UI / UX

Clean responsive UI
Loading indicators
Error handling


🛠️ Tech Stack
Frontend
React + Vite
Tailwind CSS
pdfjs-dist
tesseract.js
Gemini 2.5 Flash-Lite (direct frontend API calls)

Backend
❌ No backend required (Gemini called directly from browser)

Database
Supabase

Tables: documents, summaries

RLS enabled
Public read/insert policies
