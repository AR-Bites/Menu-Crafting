import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    signIn: "Sign In",
    signOut: "Sign Out",
    back: "Back",
    backToHome: "Back to Home",
    
    // Landing Page
    heroTitle: "Create Beautiful Digital Menus ",
    heroSubtitle: "in Minutes",
    heroDescription: "Design stunning restaurant menus with drag-and-drop simplicity. Add 3D models, customize layouts, and share with QR codes.",
    startCreating: "Start Creating",
    
    // Features
    "features.design.title": "Beautiful Design",
    "features.design.description": "Professional templates with customizable colors and fonts",
    "features.3d.title": "3D Models",
    "features.3d.description": "Showcase dishes with interactive 3D models",
    "features.share.title": "Easy Sharing",
    "features.share.description": "Share with QR codes and direct links",
    
    // Dashboard
    welcome: "Welcome",
    user: "User",
    "dashboard.subtitle": "Create and manage your restaurant menus",
    "dashboard.createNew": "Create New Menu",
    "dashboard.createDescription": "Start with a template and customize",
    "dashboard.analytics": "Analytics",
    "dashboard.analyticsDescription": "View menu performance and insights",
    "dashboard.recentMenus": "Recent Menus",
    "dashboard.newMenu": "New Menu",
    "dashboard.noMenus": "No menus yet",
    "dashboard.noMenusDescription": "Create your first menu to get started",
    "dashboard.createFirst": "Create Your First Menu",
    
    // Template Selection
    chooseTemplate: "Choose Your Template",
    templateDescription: "Start with a professionally designed template and customize it to match your brand",
    menuDetails: "Menu Details",
    menuTitle: "Menu Title",
    menuTitlePlaceholder: "e.g., Bella Vista Restaurant",
    menuSubtitle: "Menu Subtitle",
    menuSubtitlePlaceholder: "e.g., Authentic Italian Cuisine",
    selectTemplate: "Use Template",
    selected: "Selected",
    createMenu: "Create Menu",
    creating: "Creating...",
    
    // Editor
    menuEditor: "Menu Editor",
    saveMenu: "Save Menu",
    sections: "Sections",
    design: "Design",
    addSection: "Add Section",
    sectionName: "Section Name",
    editSectionName: "Edit section name:",
    confirmDeleteSection: "Are you sure you want to delete this section?",
    addItem: "Add Item",
    confirmDeleteItem: "Are you sure you want to delete this item?",
    
    // Item Editor
    addMenuItem: "Add Menu Item",
    editMenuItem: "Edit Menu Item",
    itemName: "Item Name",
    description: "Description",
    price: "Price",
    image: "Image",
    dragDropImage: "Drag & drop an image, or click to browse",
    chooseFile: "Choose File",
    clickToChange: "Click to change",
    "3dModelSupport": "3D Model Support",
    "3dModelDescription": "Upload .glb files to showcase your dishes in 3D!",
    saveItem: "Save Item",
    cancel: "Cancel",
    uploading: "Uploading...",
    
    // Design
    colorScheme: "Color Scheme",
    typography: "Typography",
    layoutSpacing: "Layout Spacing",
    compact: "Compact",
    comfortable: "Comfortable",
    
    // Preview
    desktop: "Desktop",
    mobile: "Mobile",
    
    // Publishing
    publish: "Publish",
    shareMenu: "Share Your Menu",
    shareMenuDescription: "Your menu is ready to be shared with the world!",
    publishFirst: "First, publish your menu to make it available online.",
    publishMenu: "Publish Menu",
    publishing: "Publishing...",
    shareableLink: "Shareable Link",
    qrCode: "QR Code",
    downloadQR: "Download QR Code",
    close: "Close",
    viewMenu: "View Menu",
    
    // Status
    published: "Published",
    draft: "Draft",
    edit: "Edit",
    view: "View",
    
    // Messages
    success: "Success",
    error: "Error",
    menuCreated: "Menu created successfully!",
    menuPublished: "Menu published successfully!",
    linkCopied: "Link copied to clipboard!",
    failedToCopyLink: "Failed to copy link",
    fileUploaded: "File uploaded successfully!",
    fillRequiredFields: "Please fill in all required fields",
    invalidPrice: "Please enter a valid price",
    invalidFileType: "Invalid file type. Only images and 3D models are allowed.",
    menuNotFound: "Menu not found",
    menuNotFoundDescription: "The menu you're looking for doesn't exist or has been removed.",
  },
  ar: {
    // Navigation
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    back: "رجوع",
    backToHome: "العودة للرئيسية",
    
    // Landing Page
    heroTitle: "أنشئ قوائم طعام رقمية جميلة ",
    heroSubtitle: "في دقائق",
    heroDescription: "صمم قوائم طعام مذهلة للمطاعم بسهولة السحب والإفلات. أضف نماذج ثلاثية الأبعاد، خصص التخطيطات، وشارك برموز QR.",
    startCreating: "ابدأ الإنشاء",
    
    // Features
    "features.design.title": "تصميم جميل",
    "features.design.description": "قوالب احترافية مع ألوان وخطوط قابلة للتخصيص",
    "features.3d.title": "نماذج ثلاثية الأبعاد",
    "features.3d.description": "اعرض الأطباق بنماذج ثلاثية الأبعاد تفاعلية",
    "features.share.title": "مشاركة سهلة",
    "features.share.description": "شارك برموز QR وروابط مباشرة",
    
    // Dashboard
    welcome: "مرحباً",
    user: "المستخدم",
    "dashboard.subtitle": "أنشئ وأدر قوائم طعام مطعمك",
    "dashboard.createNew": "إنشاء قائمة جديدة",
    "dashboard.createDescription": "ابدأ بقالب وخصصه",
    "dashboard.analytics": "التحليلات",
    "dashboard.analyticsDescription": "اعرض أداء القائمة والرؤى",
    "dashboard.recentMenus": "القوائم الحديثة",
    "dashboard.newMenu": "قائمة جديدة",
    "dashboard.noMenus": "لا توجد قوائم بعد",
    "dashboard.noMenusDescription": "أنشئ قائمتك الأولى للبدء",
    "dashboard.createFirst": "أنشئ قائمتك الأولى",
    
    // Template Selection
    chooseTemplate: "اختر قالبك",
    templateDescription: "ابدأ بقالب مصمم بمهنية وخصصه ليتناسب مع علامتك التجارية",
    menuDetails: "تفاصيل القائمة",
    menuTitle: "عنوان القائمة",
    menuTitlePlaceholder: "مثال: مطعم بيلا فيستا",
    menuSubtitle: "العنوان الفرعي للقائمة",
    menuSubtitlePlaceholder: "مثال: المأكولات الإيطالية الأصيلة",
    selectTemplate: "استخدم القالب",
    selected: "محدد",
    createMenu: "إنشاء القائمة",
    creating: "جارٍ الإنشاء...",
    
    // Editor
    menuEditor: "محرر القائمة",
    saveMenu: "حفظ القائمة",
    sections: "الأقسام",
    design: "التصميم",
    addSection: "إضافة قسم",
    sectionName: "اسم القسم",
    editSectionName: "تعديل اسم القسم:",
    confirmDeleteSection: "هل أنت متأكد من حذف هذا القسم؟",
    addItem: "إضافة عنصر",
    confirmDeleteItem: "هل أنت متأكد من حذف هذا العنصر؟",
    
    // Item Editor
    addMenuItem: "إضافة عنصر قائمة",
    editMenuItem: "تعديل عنصر قائمة",
    itemName: "اسم العنصر",
    description: "الوصف",
    price: "السعر",
    image: "الصورة",
    dragDropImage: "اسحب وأفلت صورة، أو انقر للتصفح",
    chooseFile: "اختر ملف",
    clickToChange: "انقر للتغيير",
    "3dModelSupport": "دعم النماذج ثلاثية الأبعاد",
    "3dModelDescription": "ارفع ملفات .glb لعرض أطباقك بشكل ثلاثي الأبعاد!",
    saveItem: "حفظ العنصر",
    cancel: "إلغاء",
    uploading: "جارٍ الرفع...",
    
    // Design
    colorScheme: "نظام الألوان",
    typography: "الطباعة",
    layoutSpacing: "تباعد التخطيط",
    compact: "مدمج",
    comfortable: "مريح",
    
    // Preview
    desktop: "سطح المكتب",
    mobile: "الجوال",
    
    // Publishing
    publish: "نشر",
    shareMenu: "شارك قائمتك",
    shareMenuDescription: "قائمتك جاهزة للمشاركة مع العالم!",
    publishFirst: "أولاً، انشر قائمتك لجعلها متاحة على الإنترنت.",
    publishMenu: "نشر القائمة",
    publishing: "جارٍ النشر...",
    shareableLink: "رابط للمشاركة",
    qrCode: "رمز QR",
    downloadQR: "تحميل رمز QR",
    close: "إغلاق",
    viewMenu: "عرض القائمة",
    
    // Status
    published: "منشور",
    draft: "مسودة",
    edit: "تعديل",
    view: "عرض",
    
    // Messages
    success: "نجح",
    error: "خطأ",
    menuCreated: "تم إنشاء القائمة بنجاح!",
    menuPublished: "تم نشر القائمة بنجاح!",
    linkCopied: "تم نسخ الرابط!",
    failedToCopyLink: "فشل في نسخ الرابط",
    fileUploaded: "تم رفع الملف بنجاح!",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    invalidPrice: "يرجى إدخال سعر صحيح",
    invalidFileType: "نوع ملف غير صحيح. يُسمح فقط بالصور والنماذج ثلاثية الأبعاد.",
    menuNotFound: "القائمة غير موجودة",
    menuNotFoundDescription: "القائمة التي تبحث عنها غير موجودة أو تم حذفها.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
