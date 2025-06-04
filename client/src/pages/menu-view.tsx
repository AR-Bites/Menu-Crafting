import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { LanguageToggle } from "@/components/language-toggle";
import { Utensils } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function MenuView() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: menuData, isLoading, error } = useQuery({
    queryKey: [`/api/menu/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Menu not found</h2>
          <p className="text-slate-600">The menu you're looking for doesn't exist or is not published.</p>
        </div>
      </div>
    );
  }

  const { restaurant, sections } = menuData;

  const getColorSchemeClasses = () => {
    const schemes = {
      indigo: 'border-indigo-500',
      emerald: 'border-emerald-500',
      amber: 'border-amber-500',
      rose: 'border-rose-500',
    };
    return schemes[restaurant.colorScheme as keyof typeof schemes] || schemes.indigo;
  };

  const getFontFamilyClass = () => {
    const fonts = {
      inter: 'font-sans',
      serif: 'font-serif',
      sans: 'font-sans',
    };
    return fonts[restaurant.fontFamily as keyof typeof fonts] || fonts.inter;
  };

  const getSpacingClass = () => {
    const spacings = {
      1: 'space-y-2',
      2: 'space-y-4',
      3: 'space-y-6',
      4: 'space-y-8',
      5: 'space-y-10',
    };
    return spacings[restaurant.spacing as keyof typeof spacings] || spacings[3];
  };

  return (
    <div className={cn("min-h-screen bg-slate-50", getFontFamilyClass())}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-amber-500 rounded-lg flex items-center justify-center">
                <Utensils className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                {isRTL && restaurant.nameAr ? restaurant.nameAr : restaurant.name}
              </h1>
            </div>
            
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Restaurant Header */}
          <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900">
            {restaurant.headerImageUrl ? (
              <img
                src={restaurant.headerImageUrl}
                alt="Restaurant"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "text-center text-white",
                isRTL && "text-right"
              )}>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL && restaurant.nameAr ? restaurant.nameAr : restaurant.name}
                </h1>
                {restaurant.tagline && (
                  <p className="text-lg opacity-90">
                    {isRTL && restaurant.taglineAr ? restaurant.taglineAr : restaurant.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className={cn("p-8", getSpacingClass())}>
            {sections.map((section) => (
              <div key={section.id} className="mb-10 last:mb-0">
                <h2 className={cn(
                  "text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2",
                  getColorSchemeClasses()
                )}>
                  {isRTL && section.nameAr ? section.nameAr : section.name}
                </h2>
                
                <div className={getSpacingClass()}>
                  {section.items.map((item) => (
                    <div key={item.id} className={cn(
                      "flex items-start justify-between",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {isRTL && item.nameAr ? item.nameAr : item.name}
                        </h3>
                        {item.description && (
                          <p className="text-slate-600 mt-1">
                            {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                          </p>
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3",
                        isRTL ? "ml-4 space-x-reverse" : "mr-4"
                      )}>
                        <span className="text-lg font-bold text-primary">
                          ${item.price}
                        </span>
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {sections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  This menu is still being prepared.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
