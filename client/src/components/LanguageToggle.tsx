import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

export function LanguageToggle() {
  const { language, toggleLanguage } = useI18n();

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={language === 'ar' ? toggleLanguage : undefined}
        className="px-3 py-1 text-sm font-medium transition-all duration-200"
      >
        EN
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'ghost'}
        size="sm"
        onClick={language === 'en' ? toggleLanguage : undefined}
        className="px-3 py-1 text-sm font-medium transition-all duration-200"
      >
        عربي
      </Button>
    </div>
  );
}
