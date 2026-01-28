//import type { TemplateField } from '../types';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const TEMPLATE_MAPPING = {
  'NBFC less than 500 crores': 'template1.docx',
  'NBFC 500 to 1000 crores': 'template2.docx',
  'NBFC more than 1000 crores': 'template3.docx',
};

export const DATE_FORMATS: Record<string, string> = {
  '27-01-2026 (DD-MM-YYYY)': 'DD-MM-YYYY',
  '27/01/2026 (DD/MM/YYYY)': 'DD/MM/YYYY',
  'January 27, 2026 (Full)': 'MMMM DD, YYYY',
  'Jan 27, 2026 (Short)': 'MMM DD, YYYY',
  '2026-01-27 (ISO)': 'YYYY-MM-DD',
  '01/27/2026 (MM/DD/YYYY)': 'MM/DD/YYYY',
  '01-27-2026 (MM-DD-YYYY)': 'MM-DD-YYYY',
};

export const DECIMAL_OPTIONS = [0, 1, 2, 3, 4, 5];
export const WORD_LIMIT = 50;

export const cleanOptionValue = (value: string): string => {
  return String(value).trim().replace(/^['"]|['"]$/g, '');
};

export const formatNumberValue = (value: string | number, decimalPlaces: number): string => {
  try {
    const num = Number(value);
    if (decimalPlaces === 0) {
      return new Intl.NumberFormat('en-US').format(Math.round(num));
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(num);
    }
  } catch {
    return String(value);
  }
};

export const formatDate = (date: Date, formatPattern: string): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const monthShort = date.toLocaleString('default', { month: 'short' });

  const formatMap: Record<string, string> = {
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MMMM DD, YYYY': `${monthName} ${day}, ${year}`,
    'MMM DD, YYYY': `${monthShort} ${day}, ${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'MM-DD-YYYY': `${month}-${day}-${year}`,
  };

  return formatMap[formatPattern] || formatPattern;
};

export const limitTextByWords = (text: string, wordLimit: number = WORD_LIMIT): [string, number] => {
  const words = String(text).split(/\s+/);
  const wordCount = words.length;
  if (wordCount > wordLimit) {
    return [words.slice(0, wordLimit).join(' '), wordLimit];
  }
  return [text, wordCount];
};

export const extractTagsFromTemplate = (templateText: string): Record<string, string> => {
  const tags: Record<string, string> = {};

  // Match triple curly braces {{{x}}} or {{{x/'opt1','opt2'}}}
  const triplePattern = /\{\{\{([^}]+)\}\}\}/g;
  let match;
  while ((match = triplePattern.exec(templateText)) !== null) {
    const content = match[1].trim();
    const tagName = content.split('/')[0].trim();
    tags[tagName] = 'date';
  }

  // Match double curly braces {{x}} or {{x/'opt1','opt2'}}
  const doublePattern = /\{\{([^}]+)\}\}/g;
  while ((match = doublePattern.exec(templateText)) !== null) {
    const content = match[1].trim();
    const tagName = content.split('/')[0].trim();
    if (!tags[tagName]) tags[tagName] = 'number';
  }

  // Match single curly braces {x} or {x/'opt1','opt2'}
  const singlePattern = /\{([^}]+)\}/g;
  while ((match = singlePattern.exec(templateText)) !== null) {
    const content = match[1].trim();
    const tagName = content.split('/')[0].trim();
    if (!tags[tagName]) tags[tagName] = 'text';
  }

  return tags;
};

export const replaceTagsInText = (text: string, replacements: Record<string, string>): string => {
  let result = text;

  for (const [tag, value] of Object.entries(replacements)) {
    // Replace triple curly braces
    result = result.replace(new RegExp(`\\{\\{\\{${tag}/[^}]*\\}\\}\\}`, 'g'), value);
    result = result.replace(new RegExp(`\\{\\{\\{${tag}\\}\\}\\}`, 'g'), value);

    // Replace double curly braces
    result = result.replace(new RegExp(`\\{\\{${tag}/[^}]*\\}\\}`, 'g'), value);
    result = result.replace(new RegExp(`\\{\\{${tag}\\}\\}`, 'g'), value);

    // Replace single curly braces
    result = result.replace(new RegExp(`\\{${tag}/[^}]*\\}`, 'g'), value);
    result = result.replace(new RegExp(`\\{${tag}\\}`, 'g'), value);
  }

  return result;
};

// Generate a simple Word document with replaced tags
export const generateDocumentFromTemplate = async (
  templateText: string,
  replacements: Record<string, string>
): Promise<Blob> => {
  const replacedText = replaceTagsInText(templateText, replacements);
  const paragraphs = replacedText.split('\n').map(
    (text) =>
      new Paragraph({
        children: [
          new TextRun({
            text: text || ' ',
          }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};
