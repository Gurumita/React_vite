import React, { useState } from 'react';
import styles from './TemplateForm.module.css';
import type { TemplateField } from '../types';
import { limitTextByWords, WORD_LIMIT, cleanOptionValue } from '../utils/documentUtils';

interface TemplateFormProps {
  fields: TemplateField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  selectedDateFormat: string;
  selectedDecimalPlaces: number;
  isLoading?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  fields,
  onSubmit,
  isLoading = false,
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (fieldName: string, value: string, fieldType: string) => {
    if (fieldType === 'text' && ['address', 'description', 'scope', 'services'].some(key => fieldName.toLowerCase().includes(key))) {
      const [limitedText, wordCount] = limitTextByWords(value, WORD_LIMIT);
      setValues(prev => ({ ...prev, [fieldName]: limitedText }));
      setWordCounts(prev => ({ ...prev, [fieldName]: wordCount }));
    } else {
      setValues(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    const emptyFields = fields.filter(f => !values[f.name]);
    if (emptyFields.length > 0) {
      alert(`Please fill in all fields. Missing: ${emptyFields.map(f => f.name).join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (fields.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>👆 Load template fields to start filling in the report.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>📝 Fill in the Template Fields</h2>
      <p className={styles.info}>Found <strong>{fields.length}</strong> fields</p>

      <div className={styles.fieldsGrid}>
        {fields.map((field) => {
          const isLargeTextField = ['address', 'description', 'scope', 'services'].some(
            key => field.name.toLowerCase().includes(key)
          );
          const wordCount = wordCounts[field.name] || 0;

          return (
            <div key={field.name} className={styles.fieldGroup}>
              <label htmlFor={field.name} className={styles.label}>
                <span className={styles.icon}>
                  {field.fieldType.includes('date') ? '📅' : 
                   field.fieldType.includes('number') ? '🔢' : '📝'}
                  {field.fieldType.includes('dropdown') ? ' 📋' : ''}
                </span>
                {field.name.replace(/_/g, ' ')}
              </label>

              {field.fieldType === 'date' && (
                <input
                  type="date"
                  id={field.name}
                  onChange={(e) => {
                    //const date = new Date(e.target.value);
                    // Format will be applied during document generation
                    setValues(prev => ({ ...prev, [field.name]: e.target.value }));
                  }}
                  className={styles.input}
                  required
                />
              )}

              {(field.fieldType === 'text_dropdown' || field.fieldType === 'date_dropdown' || field.fieldType === 'number_dropdown') && (
                <select
                  id={field.name}
                  value={values[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value, field.fieldType)}
                  className={styles.select}
                  required
                >
                  <option value="">Select an option...</option>
                  {field.options?.map((opt) => {
                    const cleanOpt = cleanOptionValue(opt);
                    return (
                      <option key={opt} value={cleanOpt}>
                        {cleanOpt}
                      </option>
                    );
                  })}
                </select>
              )}

              {field.fieldType === 'number' && (
                <input
                  type="number"
                  id={field.name}
                  value={values[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value, field.fieldType)}
                  step="0.01"
                  min="0"
                  className={styles.input}
                  required
                />
              )}

              {field.fieldType === 'text' && isLargeTextField && (
                <>
                  <textarea
                    id={field.name}
                    value={values[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value, field.fieldType)}
                    className={styles.textarea}
                    rows={4}
                    required
                  />
                  <small className={styles.wordCount}>
                    {wordCount > WORD_LIMIT ? (
                      <span style={{ color: 'red' }}>⚠️ Limited to {WORD_LIMIT} words (you entered {wordCount})</span>
                    ) : (
                      <span>📊 Word count: {wordCount}/{WORD_LIMIT}</span>
                    )}
                  </small>
                </>
              )}

              {field.fieldType === 'text' && !isLargeTextField && (
                <input
                  type="text"
                  id={field.name}
                  value={values[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value, field.fieldType)}
                  className={styles.input}
                  required
                />
              )}
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={submitting || isLoading} className={styles.submitBtn}>
        {submitting ? '⏳ Generating Report...' : '🚀 Generate Report'}
      </button>
    </form>
  );
};

export default TemplateForm;
