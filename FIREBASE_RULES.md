// Firebase Firestore Security Rules
// Copy this to your Firebase Console > Firestore > Rules

// For Development (Allow all - NOT SECURE!)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

// For Production (Recommended)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Engagement Reports Collection
    match /engagement_reports/{document=**} {
      // Allow all reads (reports are meant to be shared)
      allow read: if true;
      
      // Allow writes only (new reports)
      allow create: if true;
      
      // Disallow updates/deletes (preserve history)
      allow update, delete: if false;
    }
    
  }
}

// For Production with Authentication (Most Secure)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Engagement Reports Collection
    match /engagement_reports/{document=**} {
      // Allow reads if authenticated
      allow read: if request.auth != null;
      
      // Allow writes only for authenticated users
      allow create: if request.auth != null;
      
      // Allow update/delete only by document creator
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
    
  }
}

// Notes:
// 1. Start with development rules for testing
// 2. Move to production rules before going live
// 3. Add authentication in App.tsx for secure mode
// 4. Update security rules regularly
// 5. Test rules thoroughly before deploying
