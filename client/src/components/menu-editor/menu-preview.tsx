import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import type { Menu, MenuSection, MenuItem } from "@shared/schema";

interface MenuPreviewProps {
  restaurant: Menu;
  sections: (MenuSection & { items: MenuItem[] })[];
  onBackToTemplates: () => void;
  onPublish: () => void;
}

export function MenuPreview({
  restaurant,
  sections,
  onBackToTemplates,
  onPublish,
}: MenuPreviewProps) {
  const { t, isRTL } = useI18n();
  const [isDesktop, setIsDesktop] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBackToTemplates}>
              {t('editor.backToTemplates')}
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {restaurant.name || t('editor.menuPreview')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={isDesktop ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsDesktop(true)}
                className="px-3"
              >
                <Monitor className="h-4 w-4 mr-1" />
                {t('editor.desktop')}
              </Button>
              <Button
                variant={!isDesktop ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsDesktop(false)}
                className="px-3"
              >
                <Smartphone className="h-4 w-4 mr-1" />
                {t('editor.mobile')}
              </Button>
            </div>

            <Button onClick={onPublish} className="bg-blue-600 hover:bg-blue-700">
              {t('editor.publish')}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className={cn(
            "bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
            isDesktop ? "w-full max-w-4xl h-full" : "w-80 h-[600px]"
          )}
        >
          {/* Menu Content */}
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <h1 className="text-2xl font-bold mb-2">
                {restaurant.restaurantName || t('editor.restaurantName')}
              </h1>
              {restaurant.tagline && (
                <p className="text-blue-100">{restaurant.tagline}</p>
              )}
            </div>

            {/* Menu Sections */}
            <div className="p-6 space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.name}
                    </h2>
                    {section.description && (
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex gap-4 flex-1">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <div className="flex gap-1">
                                {item.isSpicy && (
                                  <Badge variant="destructive" className="text-xs">
                                    🌶️
                                  </Badge>
                                )}
                                {item.isVegetarian && (
                                  <Badge variant="secondary" className="text-xs">
                                    🌱
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>{t('editor.noSections')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}