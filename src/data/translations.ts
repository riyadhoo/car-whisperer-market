
// Translation data for the application
export const translations = {
  en: {
    // Navigation
    home: 'Home',
    cars: 'Cars',
    parts: 'Parts',
    profile: 'Profile',
    cart: 'Cart',
    search: 'Search cars or parts...',
    
    // Parts page
    partsMarketplace: 'Car Parts Marketplace',
    partsDescription: 'Find new, used, and refurbished parts from trusted sellers and individuals.',
    filters: 'Filters',
    searchParts: 'Search parts...',
    category: 'Category',
    allCategories: 'All Categories',
    condition: 'Condition',
    anyCondition: 'Any Condition',
    priceRange: 'Price Range',
    sellerType: 'Seller Type',
    allSellers: 'All Sellers',
    shopsOnly: 'Shops Only',
    individualsOnly: 'Individuals Only',
    inStockOnly: 'In Stock Only',
    resetFilters: 'Reset Filters',
    shipping: 'Shipping & Services',
    freeShipping: 'Free Shipping',
    onOrdersOver: 'On orders over',
    compatibilityCheck: 'Compatibility Check',
    partsVerified: 'Parts verified to fit your vehicle',
    partFound: 'part found',
    partsFound: 'parts found',
    sortBy: 'Sort by',
    featured: 'Featured',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    newest: 'Newest First',
    noPartsMatch: 'No parts match your search criteria',
    newPartsAdded: 'New parts recently added to our inventory!',
    
    // PartCard
    details: 'Details',
    add: 'Add',
    fits: 'Fits:',
    
    // Footer
    quickLinks: 'Quick Links',
    categories: 'Categories',
    contactUs: 'Contact Us',
    sedans: 'Sedans',
    suvs: 'SUVs',
    trucks: 'Trucks',
    luxury: 'Luxury',
    about: 'About Us',
    copyright: 'All rights reserved.',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    cars: 'السيارات',
    parts: 'قطع الغيار',
    profile: 'الملف الشخصي',
    cart: 'سلة التسوق',
    search: 'ابحث عن سيارات أو قطع غيار...',
    
    // Parts page
    partsMarketplace: 'سوق قطع غيار السيارات',
    partsDescription: 'ابحث عن قطع غيار جديدة ومستعملة ومجددة من بائعين موثوق بهم وأفراد.',
    filters: 'المرشحات',
    searchParts: 'البحث عن قطع غيار...',
    category: 'الفئة',
    allCategories: 'جميع الفئات',
    condition: 'الحالة',
    anyCondition: 'أي حالة',
    priceRange: 'نطاق السعر',
    sellerType: 'نوع البائع',
    allSellers: 'جميع البائعين',
    shopsOnly: 'المتاجر فقط',
    individualsOnly: 'الأفراد فقط',
    inStockOnly: 'المتوفر فقط',
    resetFilters: 'إعادة ضبط المرشحات',
    shipping: 'الشحن والخدمات',
    freeShipping: 'شحن مجاني',
    onOrdersOver: 'على الطلبات التي تزيد عن',
    compatibilityCheck: 'فحص التوافق',
    partsVerified: 'قطع غيار تم التحقق من توافقها مع سيارتك',
    partFound: 'قطعة موجودة',
    partsFound: 'قطع موجودة',
    sortBy: 'ترتيب حسب',
    featured: 'مميز',
    priceLow: 'السعر: من الأدنى إلى الأعلى',
    priceHigh: 'السعر: من الأعلى إلى الأدنى',
    newest: 'الأحدث أولاً',
    noPartsMatch: 'لا توجد قطع غيار تطابق معايير البحث الخاصة بك',
    newPartsAdded: 'تمت إضافة قطع غيار جديدة مؤخرًا إلى مخزوننا!',
    
    // PartCard
    details: 'التفاصيل',
    add: 'إضافة',
    fits: 'يناسب:',
    
    // Footer
    quickLinks: 'روابط سريعة',
    categories: 'الفئات',
    contactUs: 'اتصل بنا',
    sedans: 'سيارات سيدان',
    suvs: 'سيارات الدفع الرباعي',
    trucks: 'الشاحنات',
    luxury: 'فاخرة',
    about: 'معلومات عنا',
    copyright: 'جميع الحقوق محفوظة.',
  }
};

// Hook to get translations
export const useTranslation = (language: 'en' | 'ar') => {
  return {
    t: (key: keyof typeof translations.en): string => {
      // TypeScript doesn't know if the key exists in the ar translations, so we need to cast
      return translations[language][key as keyof typeof translations[typeof language]] || key;
    }
  };
};
