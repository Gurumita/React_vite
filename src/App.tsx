import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase/config';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check user authentication status
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // If Firebase is not configured, skip auth and show login
      setAuthLoading(false);
      return;
    }

    if (!auth) {
      setAuthLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firebase auth check failed, allowing demo user login');
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setUser(null);
    }
  };

  if (authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <div className="container">
        <Sidebar user={user} />
      </div>
    </div>
  );
}

export default App;
