import { useState } from 'react';
import styles from './Login.module.css';
import pkfLogo from '../assets/pkf-india.png';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  OAuthProvider 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Using demo login.');
      handleDemoLogin();
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        provider: 'google',
        photoURL: user.photoURL
      });
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Using demo login.');
      handleDemoLogin();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.addScope('user.read');
provider.addScope('mail.read');

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        provider: 'microsoft',
        photoURL: user.photoURL
      });
    } catch (err: any) {
      setError(err.message || 'Microsoft login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Using demo login.');
      handleDemoLogin();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        provider: 'github',
        photoURL: user.photoURL
      });
    } catch (err: any) {
      setError(err.message || 'GitHub login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      uid: 'demo-user-' + Math.random().toString(36).substr(2, 9),
      email: 'demo@example.com',
      displayName: 'Demo User',
      provider: 'demo',
      photoURL: 'https://via.placeholder.com/40'
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <img src={pkfLogo} alt="PKF Logo" className={styles.headerLogo} />

        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.ssoSection}>
          <h2>Select Sign-In Method</h2>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`${styles.ssoButton} ${styles.google}`}
          >
            <span className={styles.icon}>🔵</span>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className={`${styles.ssoButton} ${styles.microsoft}`}
          >
            <span className={styles.icon}>🟦</span>
            <span>Continue with Microsoft</span>
          </button>

          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className={`${styles.ssoButton} ${styles.github}`}
          >
            <span className={styles.icon}>⬛</span>
            <span>Continue with GitHub</span>
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className={`${styles.ssoButton} ${styles.demo}`}
          >
            <span className={styles.icon}>📌</span>
            <span>Try Demo Account</span>
          </button>
        </div>

        <div className={styles.footer}>
          <p>By signing in, you agree to our Terms of Service</p>
          <p>Your templates and reports are securely stored</p>
        </div>
      </div>
    </div>
  );
}
