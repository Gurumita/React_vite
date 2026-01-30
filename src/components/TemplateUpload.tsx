import { useState, useEffect } from 'react';
import styles from './TemplateUpload.module.css';

interface TemplateUploadProps {
  onUploadSuccess?: (templates: any[]) => void;
  user?: any;
}

interface ExtractedTag {
  name: string;
  type: 'text' | 'number' | 'date' | 'text_dropdown' | 'number_dropdown' | 'date_dropdown';
  options?: string[];
}

interface AvailableTemplate {
  name: string;
  path: string;
  fileName: string;
}

// Word limit for text fields
const WORD_LIMIT = 50;

// Date format options
const DATE_FORMATS: Record<string, string> = {
  "January 27, 2026 (Full)": "MMMM DD, YYYY",
  "Jan 27, 2026 (Short)": "MMM DD, YYYY",
  "27-01-2026 (DD-MM-YYYY)": "DD-MM-YYYY",
  "27/01/2026 (DD/MM/YYYY)": "DD/MM/YYYY",
  "2026-01-27 (ISO)": "YYYY-MM-DD",
  "01/27/2026 (MM/DD/YYYY)": "MM/DD/YYYY",
  "01-27-2026 (MM-DD-YYYY)": "MM-DD-YYYY",
};

// Decimal options
const DECIMAL_OPTIONS = [0, 1, 2, 3, 4, 5];

export default function TemplateUpload(_: TemplateUploadProps) {

  //const [templates, setTemplates] = useState<any[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<AvailableTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(-1);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [generating, setGenerating] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
 
  // Configuration state - removed global date format
  const [dateFormats, setDateFormats] = useState<Record<string, string>>({}); // Individual date formats per field
  const [selectedDecimalPlaces, setSelectedDecimalPlaces] = useState<number>(0);

  // Load available templates from public folder on component mount
  useEffect(() => {
    const loadAvailableTemplates = async () => {
      try {
        const templateMapping = [
          { name: "NBFC less than 500 crores", fileName: "template1.docx" },
          { name: "NBFC 500 to 1000 crores", fileName: "template2.docx" },
          { name: "NBFC more than 1000 crores", fileName: "template3.docx" }
        ];
        
        const templates: AvailableTemplate[] = templateMapping.map(t => ({
          name: t.name,
          path: `/templates/${t.fileName}`,
          fileName: t.fileName
        }));
        
        setAvailableTemplates(templates);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    
    loadAvailableTemplates();
  }, []);

  // Extract tags from text using regex patterns (matching Streamlit logic EXACTLY)
  const extractTagsFromText = (text: string): ExtractedTag[] => {
    const tags: Map<string, ExtractedTag> = new Map();
    
    console.log('=== TAG EXTRACTION DEBUG ===');
    console.log('Input text length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));

    // IMPORTANT: Match triple first, then double, then single to avoid overlaps
    
    // Triple curly braces - Date field {{{x}}} or {{{x/'opt1','opt2'}}}
    const triplePattern = /\{\{\{([^}]+)\}\}\}/g;
    let match;
    const tripleMatches: string[] = [];
    
    while ((match = triplePattern.exec(text)) !== null) {
      tripleMatches.push(match[0]);
      const tagContent = match[1].trim();
      
      if (tagContent.includes('/')) {
        const slashIndex = tagContent.indexOf('/');
        const tagName = tagContent.substring(0, slashIndex).trim();
        const optionsStr = tagContent.substring(slashIndex + 1).trim();
        const options = optionsStr.split(',').map(opt => opt.trim().replace(/^['"]|['"]$/g, ''));
        
        if (!tags.has(tagName)) {
          tags.set(tagName, {
            name: tagName,
            type: 'date_dropdown',
            options
          });
          console.log('Found date_dropdown:', tagName, 'with options:', options);
        }
      } else {
        const tagName = tagContent;
        if (!tags.has(tagName)) {
          tags.set(tagName, {
            name: tagName,
            type: 'date'
          });
          console.log('Found date:', tagName);
        }
      }
    }
    
    console.log('Triple bracket matches:', tripleMatches);
    
    // Remove triple bracket patterns from text
    let remainingText = text;
    for (const tripleMatch of tripleMatches) {
      remainingText = remainingText.replace(tripleMatch, '');
    }

    // Double curly braces - Number field {{x}} or {{x/'opt1','opt2'}}
    const doublePattern = /\{\{([^}]+)\}\}/g;
    const doubleMatches: string[] = [];
    
    while ((match = doublePattern.exec(remainingText)) !== null) {
      doubleMatches.push(match[0]);
      const tagContent = match[1].trim();
      
      const tagBaseName = tagContent.split('/')[0].trim();
      if (!tags.has(tagBaseName)) {
        if (tagContent.includes('/')) {
          const slashIndex = tagContent.indexOf('/');
          const tagName = tagContent.substring(0, slashIndex).trim();
          const optionsStr = tagContent.substring(slashIndex + 1).trim();
          const options = optionsStr.split(',').map(opt => opt.trim().replace(/^['"]|['"]$/g, ''));
          
          tags.set(tagName, {
            name: tagName,
            type: 'number_dropdown',
            options
          });
          console.log('Found number_dropdown:', tagName, 'with options:', options);
        } else {
          tags.set(tagContent, {
            name: tagContent,
            type: 'number'
          });
          console.log('Found number:', tagContent);
        }
      }
    }
    
    console.log('Double bracket matches:', doubleMatches);
    
    // Remove double bracket patterns from remaining text
    for (const doubleMatch of doubleMatches) {
      remainingText = remainingText.replace(doubleMatch, '');
    }

    // Single curly braces - Text field {x} or {x/'opt1','opt2'}
    const singlePattern = /\{([^}]+)\}/g;
    const singleMatches: string[] = [];
    
    while ((match = singlePattern.exec(remainingText)) !== null) {
      singleMatches.push(match[0]);
      const tagContent = match[1].trim();
      
      const tagBaseName = tagContent.split('/')[0].trim();
      if (!tags.has(tagBaseName)) {
        if (tagContent.includes('/')) {
          const slashIndex = tagContent.indexOf('/');
          const tagName = tagContent.substring(0, slashIndex).trim();
          const optionsStr = tagContent.substring(slashIndex + 1).trim();
          const options = optionsStr.split(',').map(opt => opt.trim().replace(/^['"]|['"]$/g, ''));
          
          tags.set(tagName, {
            name: tagName,
            type: 'text_dropdown',
            options
          });
          console.log('Found text_dropdown:', tagName, 'with options:', options);
        } else {
          tags.set(tagContent, {
            name: tagContent,
            type: 'text'
          });
          console.log('Found text:', tagContent);
        }
      }
    }
    
    console.log('Single bracket matches:', singleMatches);
    console.log('Total tags found:', tags.size);
    console.log('=== END DEBUG ===');

    return Array.from(tags.values());
  };

  // Extract text content from DOCX file - IMPROVED VERSION
  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const JSZip = (await import('jszip')).default;
      
      const zip = new JSZip();
      await zip.loadAsync(arrayBuffer);
      
      const docXml = await zip.file('word/document.xml')?.async('string');
      
      if (!docXml) {
        console.error('Could not find word/document.xml');
        return '';
      }
      
      console.log('=== DOCX EXTRACTION DEBUG ===');
      console.log('Document XML length:', docXml.length);
      
      // Extract text from <w:t> elements
      const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let match;
      const extractedTexts: string[] = [];
      
      while ((match = textRegex.exec(docXml)) !== null) {
        const text = match[1];
        if (text) {
          extractedTexts.push(text);
        }
      }
      
      console.log('Number of text elements found:', extractedTexts.length);
      console.log('Extracted texts:', extractedTexts);
      
      // IMPORTANT: Join without space to preserve tags
      const fullText = extractedTexts.join('');
      console.log('Full extracted text:', fullText);
      console.log('Full text length:', fullText.length);
      console.log('=== END DOCX DEBUG ===');
      
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      return '';
    }
  };

  // Handle template selection from dropdown
  const handleTemplateSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    if (index === -1) {
      setSelectedTemplate(null);
      setSelectedTemplateIndex(-1);
      setFormValues({});
      setWordCounts({});
      setDateFormats({});
      return;
    }

    const template = availableTemplates[index];
    setLoadingTemplate(true);
    
    try {
      console.log('Loading template:', template.path);
      const response = await fetch(template.path);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('Template loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      // Extract text from the document
      const documentText = await extractTextFromDocx(arrayBuffer);
      console.log('Extracted text from document, length:', documentText.length);
      
      if (!documentText || documentText.length === 0) {
        console.error('No text extracted from document');
        alert('Warning: Could not extract any text from this template. The template may be empty or corrupted.');
      }
      
      // Extract tags with their types and options
      const extractedTags = extractTagsFromText(documentText);
      console.log('Extracted tags:', extractedTags);
      
      if (extractedTags.length === 0) {
        console.warn('No tags found in template');
      }
      
      setSelectedTemplate({
        name: template.name,
        fileName: template.fileName,
        path: template.path,
        content: arrayBuffer,
        fields: extractedTags,
        fieldCount: extractedTags.length,
      });
      
      setSelectedTemplateIndex(index);
      
      // Initialize form values and date formats
      const initialValues: Record<string, any> = {};
      const initialDateFormats: Record<string, string> = {};
      
      extractedTags.forEach((tag: ExtractedTag) => {
        if (tag.type.includes('dropdown') && tag.options && tag.options.length > 0) {
          initialValues[tag.name] = tag.options[0];
        } else {
          initialValues[tag.name] = '';
        }
        
        // Initialize date format for each date field
        if (tag.type === 'date' || tag.type === 'date_dropdown') {
          initialDateFormats[tag.name] = "January 27, 2026 (Full)"; // Default format
        }
      });
      
      setFormValues(initialValues);
      setWordCounts({});
      setDateFormats(initialDateFormats);
    } catch (error) {
      console.error('Error loading template:', error);
      alert(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Clean option value (remove quotes)
  const cleanOptionValue = (value: string): string => {
    return value.trim().replace(/^['"]|['"]$/g, '');
  };

  // Format number value with decimal places
  const formatNumberValue = (value: any, decimalPlaces: number): string => {
    try {
      const num = parseFloat(value);
      if (isNaN(num)) return String(value);
      
      if (decimalPlaces === 0) {
        return Math.round(num).toString();
      } else {
        return num.toFixed(decimalPlaces);
      }
    } catch {
      return String(value);
    }
  };

  // Format date value
  const formatDateValue = (dateStr: string, format: string): string => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const formatPattern = DATE_FORMATS[format];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    switch (formatPattern) {
      case 'DD-MM-YYYY':
        return `${pad(day)}-${pad(month + 1)}-${year}`;
      case 'DD/MM/YYYY':
        return `${pad(day)}/${pad(month + 1)}/${year}`;
      case 'MMMM DD, YYYY':
        return `${months[month]} ${day}, ${year}`;
      case 'MMM DD, YYYY':
        return `${monthsShort[month]} ${day}, ${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${pad(month + 1)}-${pad(day)}`;
      case 'MM/DD/YYYY':
        return `${pad(month + 1)}/${pad(day)}/${year}`;
      case 'MM-DD-YYYY':
        return `${pad(month + 1)}-${pad(day)}-${year}`;
      default:
        return dateStr;
    }
  };

  // Limit text by words
  const limitTextByWords = (text: string, limit: number): [string, number] => {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length > limit) {
      return [words.slice(0, limit).join(' '), limit];
    }
    return [text, words.length];
  };

  // Handle form input changes
  const handleFormChange = (fieldName: string, value: any, fieldType: string) => {
    const isLargeTextField = fieldType === 'text' && 
      ['address', 'description', 'scope', 'services'].some(key => fieldName.toLowerCase().includes(key));
    
    if (isLargeTextField) {
      const [limitedText, wordCount] = limitTextByWords(value, WORD_LIMIT);
      setFormValues(prev => ({ ...prev, [fieldName]: limitedText }));
      setWordCounts(prev => ({ ...prev, [fieldName]: wordCount }));
    } else {
      setFormValues(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  // Handle date format change for a specific field
  const handleDateFormatChange = (fieldName: string, format: string) => {
    setDateFormats(prev => ({ ...prev, [fieldName]: format }));
  };

  // Generate document
  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;
    
    // Validate all fields are filled
    const emptyFields = selectedTemplate.fields.filter((f: ExtractedTag) => !formValues[f.name] && formValues[f.name] !== 0);
    if (emptyFields.length > 0) {
      alert(`Please fill in all fields. Missing: ${emptyFields.map((f: ExtractedTag) => f.name).join(', ')}`);
      return;
    }
    
    setGenerating(true);
    
    try {
      // Process replacements with formatting
      const processedReplacements: Record<string, string> = {};
      
      selectedTemplate.fields.forEach((field: ExtractedTag) => {
        const value = formValues[field.name];
        
        if (field.type === 'date') {
          // Use the specific date format for this field
          const fieldFormat = dateFormats[field.name] || "January 27, 2026 (Full)";
          processedReplacements[field.name] = formatDateValue(value, fieldFormat);
        } else if (field.type === 'date_dropdown') {
          // For date dropdowns, also use field-specific format
          const fieldFormat = dateFormats[field.name] || "January 27, 2026 (Full)";
          processedReplacements[field.name] = formatDateValue(value, fieldFormat);
        } else if (field.type === 'number') {
          processedReplacements[field.name] = formatNumberValue(value, selectedDecimalPlaces);
        } else if (field.type === 'number_dropdown') {
          processedReplacements[field.name] = formatNumberValue(value, selectedDecimalPlaces);
        } else {
          processedReplacements[field.name] = String(value);
        }
      });
      
      console.log('Processed replacements:', processedReplacements);
      
      // Generate document
      const generatedDoc = await generateDocumentFromTemplate(
        selectedTemplate.content,
        processedReplacements
      );
      
      // Create download
      const blob = new Blob([generatedDoc], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      a.download = `Engagement_Report_${selectedTemplate.name.replace(/\s+/g, '_')}_${timestamp}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Report generated successfully!');
    } catch (error) {
      console.error('Error generating document:', error);
      alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGenerating(false);
    }
  };

  // Generate document from template by replacing tags
const generateDocumentFromTemplate = async (
  templateArrayBuffer: ArrayBuffer,
  replacements: Record<string, string>
): Promise<ArrayBuffer> => {
  const JSZip = (await import('jszip')).default;

  const zip = new JSZip();
  await zip.loadAsync(templateArrayBuffer);

  let docXml = await zip.file('word/document.xml')?.async('string');
  if (!docXml) throw new Error('Could not find document.xml');

  /**
   * ✅ Replace ONLY non-empty paragraphs
   * ✅ Preserve <w:p/> empty paragraphs (blank lines)
   */
  docXml = docXml.replace(
    /<w:p(?!\/>)[\s\S]*?<\/w:p>/g,
    (paragraphXml) => {
      const textMatches = [...paragraphXml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)];
      let paragraphText = textMatches.map(m => m[1]).join('');

      for (const [tag, value] of Object.entries(replacements)) {
        const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const v = String(value);

        paragraphText = paragraphText
          .replace(new RegExp(`\\{\\{\\{${escapedTag}\\/[^}]+\\}\\}\\}`, 'g'), v)
          .replace(new RegExp(`\\{\\{\\{${escapedTag}\\}\\}\\}`, 'g'), v)
          .replace(new RegExp(`\\{\\{${escapedTag}\\/[^}]+\\}\\}`, 'g'), v)
          .replace(new RegExp(`\\{\\{${escapedTag}\\}\\}`, 'g'), v)
          .replace(new RegExp(`\\{${escapedTag}\\/[^}]+\\}`, 'g'), v)
          .replace(new RegExp(`\\{${escapedTag}\\}`, 'g'), v);
      }

      return `
        <w:p>
          <w:r>
            <w:t xml:space="preserve">${paragraphText}</w:t>
          </w:r>
        </w:p>
      `;
    }
  );
  
  zip.file('word/document.xml', docXml);
  return await zip.generateAsync({ type: 'arraybuffer' });
};
  // Upload-related logic and handlers removed along with upload UI.

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>📄 Engagement Report Generator</h1>
        <p>Create engagement reports from pre-defined NBFC questionnaires.</p>
      </header>

      <div className={styles.container}>
      {/* Configuration Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.configPanel}>
          <h3>⚙️ Configuration</h3>
          
          {/* Removed global date format selector */}
          
          <div className={styles.configSection}>
            <label htmlFor="decimalPlaces" className={styles.configLabel}>
              🔢 DECIMAL PLACES
            </label>
            <select
              id="decimalPlaces"
              value={selectedDecimalPlaces}
              onChange={(e) => setSelectedDecimalPlaces(parseInt(e.target.value))}
              className={styles.configSelect}
            >
              {DECIMAL_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} decimal{n !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.configSection}>
            <label htmlFor="templateSelect" className={styles.configLabel}>
              SELECT QUESTIONNAIRE
            </label>
            <select
              id="templateSelect"
              value={selectedTemplateIndex}
              onChange={handleTemplateSelect}
              className={styles.configSelect}
              disabled={loadingTemplate}
            >
              <option value={-1}>Choose a questionnaire...</option>
              {availableTemplates.map((template, index) => (
                <option key={index} value={index}>
                  {template.name}
                </option>
              ))}
            </select>
            {loadingTemplate && (
              <p className={styles.loadingText}>⏳ Loading...</p>
            )}
          </div>

          {/* Show template info in sidebar */}
          {selectedTemplate && (
            <div className={styles.sidebarTemplateInfo}>
              <div className={styles.sidebarTemplateHeader}>
                <h4>📄 {selectedTemplate.name}</h4>
                <p className={styles.sidebarTemplateFile}>{selectedTemplate.fileName}</p>
              </div>
              
              {selectedTemplate.fields && selectedTemplate.fields.length > 0 ? (
                <div className={styles.sidebarFieldsList}>
                  <p className={styles.fieldsSummary}>
                    <strong>Fill in the following ({selectedTemplate.fieldCount} total)</strong>
                  </p>
                  {selectedTemplate.fields.map((field: ExtractedTag, idx: number) => (
                    <div key={idx} className={styles.sidebarField}>
                      <span className={styles.fieldIcon}>
                        {field.type === 'text' && '📝'} 
                        {field.type === 'number' && '🔢'}
                        {field.type === 'date' && '📅'}
                        {field.type.includes('dropdown') && '📋'}
                      </span>
                      <span className={styles.fieldName}>{field.name}</span>
                      {field.options && (
                        <span className={styles.fieldOptions}>({field.options.length} opts)</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.sidebarNoTags}>No tags found in this template</p>
              )}
            </div>
          )}

          {/* Tag Notation Guide */}
          <div className={styles.tagGuideCompact}>
            <h4>ℹ️ Tag Guide</h4>
            <div className={styles.tagGuideContent}>
              <p><strong>Standard:</strong></p>
              <ul>
                <li><code>{'{x}'}</code> Text</li>
                <li><code>{'{{{x}}}'}</code> Number</li>
                <li><code>{"{{{x}}}"}</code> Date</li>

              </ul>
              <p><strong>Dropdown:</strong></p>
              <ul>
                <li><code>{"{x/'a','b'}"}</code></li>
              </ul>
            </div>
          </div>

          {/* How to use – shown when no questionnaire is selected */}
          {!selectedTemplate && (
            <div className={styles.howToCard}>
              <h4>📘 How to use this application</h4>
              <ol>
                <li>
                  Choose your preferred <strong>Decimal Places</strong> above.
                </li>
                <li>
                  Under <strong>Select Questionnaire</strong>, pick an NBFC category to load the questions.
                </li>
                <li>
                  Fill in all the fields that appear on the right. For date fields, select your preferred format.
                </li>
                <li>
                  Click <strong>Generate Report</strong> to download the Word file.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {selectedTemplate && (
          <div className={styles.selectedInfo}>
            <h2>Selected Questionnaire: {selectedTemplate.name}</h2>
            <p className={styles.selectedFile}>{selectedTemplate.fileName}</p>
          </div>
        )}

        {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h2>📝 {selectedTemplate.name}</h2>
              <p>Fill in all {selectedTemplate.fieldCount} fields below</p>
            </div>

            <div className={styles.formFields}>
              {selectedTemplate.fields.map((field: ExtractedTag, idx: number) => {
                const isLargeTextField = field.type === 'text' && 
                  ['address', 'description', 'scope', 'services'].some(key => field.name.toLowerCase().includes(key));
                const wordCount = wordCounts[field.name] || 0;
                //const isDateField = field.type === 'date' || field.type === 'date_dropdown';
                
                return (
                  <div key={idx} className={styles.formGroup}>
                    <label htmlFor={`field_${field.name}`} className={styles.fieldLabel}>
                      {field.type === 'text' && '📝'} 
                      {field.type === 'number' && '🔢'}
                      {field.type === 'date' && '📅'}
                      {field.type.includes('dropdown') && '📋 '}
                      <strong>{field.name.replace(/_/g, ' ')}</strong>
                    </label>

                    {field.type === 'text' && !isLargeTextField && (
                      <input
                        id={`field_${field.name}`}
                        type="text"
                        placeholder={`Enter ${field.name}`}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                        className={styles.input}
                      />
                    )}

                    {field.type === 'text' && isLargeTextField && (
                      <>
                        <textarea
                          id={`field_${field.name}`}
                          placeholder={`Enter ${field.name} (max ${WORD_LIMIT} words)`}
                          value={formValues[field.name] || ''}
                          onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                          className={styles.textarea}
                          rows={4}
                        />
                        <small className={styles.wordCount}>
                          {wordCount > WORD_LIMIT ? (
                            <span style={{ color: 'red' }}>⚠️ Limited to {WORD_LIMIT} words</span>
                          ) : (
                            <span>📊 {wordCount}/{WORD_LIMIT} words</span>
                          )}
                        </small>
                      </>
                    )}

                    {field.type === 'number' && (
                      <input
                        id={`field_${field.name}`}
                        type="number"
                        step="0.01"
                        placeholder={`Enter ${field.name}`}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                        className={styles.input}
                      />
                    )}

                    {field.type === 'date' && (
                      <>
                        <input
                          id={`field_${field.name}`}
                          type="date"
                          value={formValues[field.name] || ''}
                          onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                          className={styles.input}
                        />
                        <div className={styles.dateFormatSelector}>
                          <label htmlFor={`format_${field.name}`} className={styles.dateFormatLabel}>
                            📅 Format:
                          </label>
                          <select
                            id={`format_${field.name}`}
                            value={dateFormats[field.name] || "January 27, 2026 (Full)"}
                            onChange={(e) => handleDateFormatChange(field.name, e.target.value)}
                            className={styles.dateFormatSelect}
                          >
                            {Object.keys(DATE_FORMATS).map((format) => (
                              <option key={format} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {field.type === 'text_dropdown' && field.options && (
                      <select
                        id={`field_${field.name}`}
                        value={formValues[field.name] || (field.options[0] || '')}
                        onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                        className={styles.input}
                      >
                        {field.options.map((option, optIdx) => {
                          const cleanOpt = cleanOptionValue(option);
                          return (
                            <option key={optIdx} value={cleanOpt}>
                              {cleanOpt}
                            </option>
                          );
                        })}
                      </select>
                    )}

                    {field.type === 'number_dropdown' && field.options && (
                      <select
                        id={`field_${field.name}`}
                        value={formValues[field.name] || (field.options[0] || '')}
                        onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                        className={styles.input}
                      >
                        {field.options.map((option, optIdx) => {
                          const cleanOpt = cleanOptionValue(option);
                          return (
                            <option key={optIdx} value={cleanOpt}>
                              {cleanOpt}
                            </option>
                          );
                        })}
                      </select>
                    )}

                    {field.type === 'date_dropdown' && field.options && (
                      <>
                        <select
                          id={`field_${field.name}`}
                          value={formValues[field.name] || (field.options[0] || '')}
                          onChange={(e) => handleFormChange(field.name, e.target.value, field.type)}
                          className={styles.input}
                        >
                          {field.options.map((option, optIdx) => {
                            const cleanOpt = cleanOptionValue(option);
                            return (
                              <option key={optIdx} value={cleanOpt}>
                                {cleanOpt}
                              </option>
                            );
                          })}
                        </select>
                        <div className={styles.dateFormatSelector}>
                          <label htmlFor={`format_${field.name}`} className={styles.dateFormatLabel}>
                            📅 Format:
                          </label>
                          <select
                            id={`format_${field.name}`}
                            value={dateFormats[field.name] || "January 27, 2026 (Full)"}
                            onChange={(e) => handleDateFormatChange(field.name, e.target.value)}
                            className={styles.dateFormatSelect}
                          >
                            {Object.keys(DATE_FORMATS).map((format) => (
                              <option key={format} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.generateSection}>
              <button 
                className={styles.generateBtn}
                onClick={handleGenerateDocument}
                disabled={generating}
              >
                {generating ? '⏳ Generating Report...' : '🚀 Generate Report'}
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}