
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';

const PartsHeader = () => {
  const { language, direction } = useSettings();
  const { t } = useTranslation(language);
  
  return (
    <section className="bg-carTheme-navy text-white py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('partsMarketplace')}</h1>
        <p className="text-lg opacity-80">
          {t('partsDescription')}
        </p>
      </div>
    </section>
  );
};

export default PartsHeader;
