import React from 'react';
import styles from './Header.module.css';
import pkfLogo from '../assets/pkf-india.png';

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={pkfLogo} alt="PKF Logo" className={styles.logoImg} />
        </div>
        {user && (
          <div className={styles.userInfo}>
            <span>👤 {user.email || user.displayName || 'User'}</span>
            {onLogout && (
              <button onClick={onLogout} className={styles.logoutBtn}>
                🚪 Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
