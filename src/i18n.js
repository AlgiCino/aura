import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const resources = {
  en: {
    translation: {
      "common": {
        "dashboard": "Dashboard",
        "projects": "Projects", 
        "tasks": "Tasks",
        "phases": "Phases",
        "templates": "Templates",
        "settings": "Settings",
        "logout": "Logout",
        "search": "Search...",
        "create": "Create",
        "edit": "Edit",
        "delete": "Delete",
        "cancel": "Cancel",
        "save": "Save",
        "loading": "Loading...",
        "error": "Error",
        "success": "Success"
      },
      "dashboard": {
        "title": "Welcome to Aura",
        "subtitle": "Build, manage, and deploy your applications with ease",
        "stats": {
          "projects": "Projects",
          "tasks": "Active Tasks", 
          "completed": "Completed",
          "templates": "Templates"
        }
      },
      "projects": {
        "title": "Projects",
        "create": "Create Project",
        "name": "Project Name",
        "description": "Description",
        "status": "Status",
        "priority": "Priority"
      }
    }
  },
  ar: {
    translation: {
      "common": {
        "dashboard": "لوحة التحكم",
        "projects": "المشاريع",
        "tasks": "المهام", 
        "phases": "المراحل",
        "templates": "القوالب",
        "settings": "الإعدادات",
        "logout": "تسجيل الخروج",
        "search": "البحث...",
        "create": "إنشاء",
        "edit": "تعديل", 
        "delete": "حذف",
        "cancel": "إلغاء",
        "save": "حفظ",
        "loading": "جاري التحميل...",
        "error": "خطأ",
        "success": "نجح"
      },
      "dashboard": {
        "title": "أهلاً بك في أورا", 
        "subtitle": "قم ببناء وإدارة ونشر تطبيقاتك بسهولة",
        "stats": {
          "projects": "المشاريع",
          "tasks": "المهام النشطة",
          "completed": "مكتمل", 
          "templates": "القوالب"
        }
      },
      "projects": {
        "title": "المشاريع",
        "create": "إنشاء مشروع",
        "name": "اسم المشروع",
        "description": "الوصف", 
        "status": "الحالة",
        "priority": "الأولوية"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;