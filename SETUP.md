# Engagement Report Generator - React Vite with Firebase

A modern React Vite application for generating professional engagement reports with Word document export and Firebase integration.

## ✨ Features

- **Template Management** - Multiple NBFC category templates with dynamic field extraction
- **Smart Field Handling** - Word limits, multiple date formats, configurable decimals
- **Document Generation** - Create Word documents (.docx) with automatic field replacement
- **Firebase Integration** - Store and track all generated reports
- **Type-Safe** - Built with TypeScript for robust development
- **Responsive Design** - Mobile-friendly UI with CSS Modules

## 📋 Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Firebase project account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Add Template Files

Place Word template files in `public/templates/`:
- `template1.docx` - NBFC less than 500 crores
- `template2.docx` - NBFC 500 to 1000 crores
- `template3.docx` - NBFC more than 1000 crores

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 5. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
React_vite/
├── src/
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.module.css
│   │   ├── TemplateForm.tsx
│   │   └── TemplateForm.module.css
│   ├── firebase/
│   │   └── config.ts         # Firebase configuration
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── documentUtils.ts  # Helper functions
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── public/
│   └── templates/            # Word template files
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🏷️ Template Tag Notation

### Standard Fields

```
{field_name}        - Text input
{{field_name}}      - Number input
{{{field_name}}}    - Date picker
```

### Dropdown Fields

```
{field/'opt1','opt2','opt3'}        - Text dropdown
{{field/'100','200','300'}}         - Number dropdown
{{{field/'2024','2025','2026'}}}    - Date dropdown
```

## ⚙️ Configuration Options

### Date Formats
- 27-01-2026 (DD-MM-YYYY)
- 27/01/2026 (DD/MM/YYYY)
- January 27, 2026 (Full)
- Jan 27, 2026 (Short)
- 2026-01-27 (ISO)
- 01/27/2026 (MM/DD/YYYY)
- 01-27-2026 (MM-DD-YYYY)

### Decimal Places
0-5 decimal places (default: 0)

### Word Limit
50 words max for text/description fields (configurable)

## 🔧 Key Features Explained

### Word Limiting
- Applied to: address, description, scope, services
- Preserves whole words (no mid-word cutting)
- Shows word count indicator

### Number Formatting
- Formats with selected decimal places
- Adds thousands separators
- Example: 1500.5 → 1,500 (0 decimals) or 1,500.50 (2 decimals)

### Date Formatting
- Select format from sidebar
- Applied to all dates in document
- Supports international formats

### Dropdown Option Cleaning
- Input: `'Riya','Guru'`
- Display: `Riya, Guru` (quotes removed)

## 📊 Firebase Collections

### engagement_reports

```typescript
{
  id: string;                          // Document ID
  category: string;                    // NBFC category selected
  templateFile: string;                // Template filename
  fields: Record<string, string>;      // Form field values
  dateFormat: string;                  // Selected date format
  decimalPlaces: number;               // Selected decimal places
  generatedAt: Date;                   // Generation timestamp
  status: 'generated';                 // Report status
  userId?: string;                     // User ID (for future auth)
}
```

## 🛠️ API Reference

### documentUtils.ts Functions

```typescript
formatNumberValue(value: string | number, decimalPlaces: number): string
formatDate(date: Date, formatPattern: string): string
limitTextByWords(text: string, wordLimit?: number): [string, number]
cleanOptionValue(value: string): string
extractTagsFromTemplate(templateText: string): Record<string, string>
replaceTagsInText(text: string, replacements: Record<string, string>): string
generateDocumentFromTemplate(templateText: string, replacements: Record<string, string>): Promise<Blob>
```

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify `.env.local` has correct credentials
- Check Firestore is enabled in Firebase Console
- Ensure database permissions allow write access

### Template Not Loading
- Verify files exist in `public/templates/`
- Check browser console for errors
- Ensure filenames match TEMPLATE_MAPPING

### Document Generation Fails
- Ensure all fields are filled
- Check field names match template tags
- Review browser console for errors

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "firebase": "^10.x",
  "docx": "^8.x"
}
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, then:
# 1. Connect repo to Vercel
# 2. Add environment variables in Vercel dashboard
# 3. Deploy
```

### Other Platforms
1. Run `npm run build`
2. Deploy `dist/` folder to your hosting
3. Set environment variables on platform

## 📚 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔐 Security Notes

- Never commit `.env.local` with real credentials
- Use `.env.example` as template
- Enable Firebase security rules
- Restrict Firestore access to authenticated users

## 📝 License

Proprietary - CAP Corporate

## 💬 Support

For questions or issues, contact the development team.
