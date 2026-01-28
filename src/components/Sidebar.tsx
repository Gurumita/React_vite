import React from 'react';
import styles from './Sidebar.module.css';
import TemplateUpload from './TemplateUpload';

interface SidebarProps {
  user?: any;
  // Legacy props kept optional so existing usages remain type-safe,
  // but the configuration UI has been removed in favor of the new panel.
  onCategorySelect?: (category: string) => void;
  onDateFormatChange?: (format: string) => void;
  onDecimalPlacesChange?: (places: number) => void;
  selectedCategory?: string;
  selectedDateFormat?: string;
  selectedDecimalPlaces?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.container}>
        {user && (
          <section className={styles.section}>
            <TemplateUpload user={user} />
          </section>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
