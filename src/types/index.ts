export type FieldType = 'text' | 'text_dropdown' | 'number' | 'number_dropdown' | 'date' | 'date_dropdown';

export interface TemplateField {
  name: string;
  fieldType: FieldType;
  options?: string[];
}

export interface TemplateMapping {
  [key: string]: string;
}

export interface EngagementReport {
  id?: string;
  category: string;
  templateFile: string;
  fields: Record<string, string | number | Date>;
  dateFormat: string;
  decimalPlaces: number;
  generatedAt?: Date;
  userId?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}
