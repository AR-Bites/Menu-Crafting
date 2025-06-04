import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, toggleLanguage } = useI18n();

  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
          language === 'en'
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
        onClick={language === 'ar' ? toggleLanguage : undefined}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
          language === 'ar'
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
        onClick={language === 'en' ? toggleLanguage : undefined}
      >
        عربي
      </Button>
    </div>
  );
}
