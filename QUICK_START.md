# Quick Start Guide - React Vite Engagement Report Generator

## 🎯 TL;DR - Get Started in 5 Minutes

### Step 1: Setup Firebase (2 minutes)
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your Firebase credentials from firebase.google.com
```

### Step 2: Add Templates (1 minute)
Place 3 Word files in `public/templates/`:
- template1.docx
- template2.docx  
- template3.docx

### Step 3: Run Project (1 minute)
```bash
npm run dev
```

### Step 4: Open Browser (1 minute)
Open http://localhost:5173 - Done! 🎉

---

## 📚 File Guide

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application logic |
| `src/components/Header.tsx` | Top navigation bar |
| `src/components/Sidebar.tsx` | Config panel & template selection |
| `src/components/TemplateForm.tsx` | Dynamic form generator |
| `src/firebase/config.ts` | Firebase setup |
| `src/utils/documentUtils.ts` | All helper functions |
| `src/types/index.ts` | TypeScript types |
| `.env.local` | Your Firebase credentials (create from .env.example) |
| `public/templates/` | Your Word template files |

---

## 🔧 Configuration

### Change Word Limit (from 50)
Edit `src/utils/documentUtils.ts`:
```typescript
export const WORD_LIMIT = 50;  // Change to your value
```

### Change Decimal Places Default (from 0)
Edit `src/App.tsx`:
```typescript
const [selectedDecimalPlaces, setSelectedDecimalPlaces] = useState(0);  // Change default
```

### Add New Template Categories
Edit `src/utils/documentUtils.ts`:
```typescript
export const TEMPLATE_MAPPING = {
  'Your Category': 'your_template.docx',
  // ... existing entries
};
```

---

## 🚀 Common Commands

```bash
npm run dev          # Development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Test production build locally
npm run lint         # Check code quality
```

---

## 📋 What The App Does

1. **User selects** NBFC category from sidebar
2. **App loads** template fields automatically
3. **User fills** form with text, numbers, dates
4. **User clicks** "Generate Report"
5. **App**:
   - Validates all fields are filled
   - Formats dates/numbers per config
   - Creates Word document
   - Saves to Firebase
   - Downloads file
6. **Done!** Report ready to use

---

## 🔒 Firebase Setup Checklist

- [ ] Created Firebase project at firebase.google.com
- [ ] Enabled Firestore Database
- [ ] Got API Key from Project Settings
- [ ] Got Project ID from Project Settings
- [ ] Created `.env.local` with all 6 variables
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Configured Firestore security rules (optional for testing)

---

## 🎨 UI Component Layout

```
┌─────────────────────────────────────────┐
│          📄 Header (Navigation)         │
├──────────────┬────────────────────────┤
│  Sidebar     │                         │
│  (Config &   │  Main Content Area      │
│   Template   │                         │
│   Selection) │  (Dynamic Form)         │
│              │                         │
└──────────────┴────────────────────────┘
```

---

## 🐛 Debugging Tips

### Form not showing?
- Check `src/App.tsx` - `loadTemplateFields()` function
- Open browser DevTools > Console for errors

### Document not downloading?
- Check if all fields are filled (error message will appear)
- Check browser console for blob creation errors

### Firebase not saving?
- Verify `.env.local` has correct credentials
- Check Firebase Console > Firestore > Data
- Check security rules allow write access

---

## 📦 Production Build Checklist

Before deploying:

- [ ] Tested with `npm run dev` locally
- [ ] Filled in `.env.local` with production Firebase credentials
- [ ] Ran `npm run build` successfully
- [ ] Tested build with `npm run preview`
- [ ] Added Word templates to `public/templates/`
- [ ] Updated `TEMPLATE_MAPPING` if needed
- [ ] Reviewed `SETUP.md` for deployment options

---

## 💡 Pro Tips

1. **Test Locally First**: Always test with `npm run dev` before building
2. **Keep .env.local Safe**: Never commit it to Git (already in .gitignore)
3. **Watch Build Size**: Large Word templates may increase bundle
4. **Monitor Firestore Usage**: Free tier has quota limits
5. **Use TypeScript**: IDE will help catch errors before runtime

---

## 📞 Help Resources

- **Vite Issues**: https://vitejs.dev/guide/troubleshooting
- **React Issues**: https://react.dev/learn
- **Firebase Issues**: https://firebase.google.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## ⚡ Performance Notes

- Vite provides instant HMR (Hot Module Replacement)
- React 19 with StrictMode for development safety
- CSS Modules prevent style conflicts
- Firebase Firestore provides real-time data
- docx library is lightweight (~100KB)

---

**Ready?** Run `npm run dev` and enjoy! 🚀
