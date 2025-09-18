import { useTranslation } from 'react-i18next';
import { GlassButton } from './GlassButton';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLng = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLng);
    document.dir = newLng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <GlassButton
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">Toggle language</span>
      <span className="absolute -bottom-1 -right-1 text-xs font-bold">
        {i18n.language === 'en' ? 'ع' : 'EN'}
      </span>
    </GlassButton>
  );
}