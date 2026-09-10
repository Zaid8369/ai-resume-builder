import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function extractTextFromFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Please upload a resume under 5MB.');
  }

  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') return extractFromPdf(file);
  if (ext === 'docx') return extractFromDocx(file);
  if (ext === 'txt') return file.text();

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
}

async function extractFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }
  if (!text.trim()) {
    throw new Error('Could not read any text from this PDF. It may be a scanned image.');
  }
  return text.trim();
}

async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  if (!result.value.trim()) {
    throw new Error('Could not read any text from this document.');
  }
  return result.value.trim();
}