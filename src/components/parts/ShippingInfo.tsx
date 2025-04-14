
import React from 'react';
import { SlidersHorizontal, Truck } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/data/translations';

const ShippingInfo = () => {
  const { language, direction } = useSettings();
  const { t } = useTranslation(language);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-bold mb-3">{t('shipping')}</h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <Truck className="h-5 w-5 text-carTheme-red mr-2 mt-0.5" />
          <div>
            <p className="font-medium">{t('freeShipping')}</p>
            <p className="text-sm text-muted-foreground">{t('onOrdersOver')} $75</p>
          </div>
        </div>
        <div className="flex items-start">
          <SlidersHorizontal className="h-5 w-5 text-carTheme-red mr-2 mt-0.5" />
          <div>
            <p className="font-medium">{t('compatibilityCheck')}</p>
            <p className="text-sm text-muted-foreground">{t('partsVerified')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
