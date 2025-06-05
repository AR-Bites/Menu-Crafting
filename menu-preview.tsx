import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import type { Menu, MenuSection, MenuItem } from "@shared/schema";
import { ModelViewer } from "@/components/ModelViewer";

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
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewModeChange = (newMode: 'desktop' | 'tablet' | 'mobile') => {
    if (newMode === viewMode) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(newMode);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

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
            {/* Enhanced View Toggle with Always-Visible Labels */}
            <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
              <Button
                variant={viewMode === 'desktop' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange('desktop')}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                  viewMode === 'desktop' 
                    ? "bg-blue-600 text-white shadow-md transform scale-105" 
                    : "hover:bg-white hover:shadow-sm text-gray-700"
                )}
              >
                <Monitor className="h-4 w-4" />
                <span className="text-sm font-medium">Desktop</span>
              </Button>
              <Button
                variant={viewMode === 'tablet' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange('tablet')}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                  viewMode === 'tablet' 
                    ? "bg-purple-600 text-white shadow-md transform scale-105" 
                    : "hover:bg-white hover:shadow-sm text-gray-700"
                )}
              >
                <Tablet className="h-4 w-4" />
                <span className="text-sm font-medium">Tablet</span>
              </Button>
              <Button
                variant={viewMode === 'mobile' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange('mobile')}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                  viewMode === 'mobile' 
                    ? "bg-green-600 text-white shadow-md transform scale-105" 
                    : "hover:bg-white hover:shadow-sm text-gray-700"
                )}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile</span>
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
            "bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
            isTransitioning && "opacity-50 scale-95",
            viewMode === 'desktop' && "w-full max-w-5xl h-full",
            viewMode === 'tablet' && "w-[768px] h-[1024px] max-w-[90%] max-h-[90%]",
            viewMode === 'mobile' && "w-[375px] h-[667px] max-w-[90%] max-h-[90%] rounded-[2rem] border-8 border-gray-800"
          )}
        >
          {/* Mobile Notch Effect */}
          {viewMode === 'mobile' && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-gray-900 rounded-full z-10"></div>
          )}

          {/* Menu Content */}
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className={cn(
              "bg-gradient-to-r from-blue-600 to-blue-800 text-white",
              viewMode === 'mobile' ? "p-4 pt-8" : "p-6"
            )}>
              <h1 className={cn(
                "font-bold mb-2",
                viewMode === 'mobile' ? "text-lg" : viewMode === 'tablet' ? "text-xl" : "text-2xl"
              )}>
                {restaurant.restaurantName || t('editor.restaurantName')}
              </h1>
              {restaurant.tagline && (
                <p className="text-blue-100">{restaurant.tagline}</p>
              )}
            </div>

            {/* Menu Sections */}
            <div className={cn(
              "space-y-6",
              viewMode === 'mobile' ? "p-4" : "p-6"
            )}>
              {sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h2 className={cn(
                      "font-semibold text-gray-900",
                      viewMode === 'mobile' ? "text-lg" : viewMode === 'tablet' ? "text-xl" : "text-xl"
                    )}>
                      {section.name}
                    </h2>
                    {section.description && (
                      <p className="text-gray-600 mt-1 text-sm">{section.description}</p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors",
                          viewMode === 'mobile' 
                            ? "p-3 flex flex-col space-y-2" 
                            : "p-4 flex items-start justify-between"
                        )}
                      >
                        {viewMode === 'mobile' ? (
                          // Mobile Layout - Stacked
                          <>
                            <div className="flex items-start justify-between w-full">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900 text-sm">
                                    {item.name}
                                  </h3>
                                  <div className="flex gap-1">
                                    {item.isSpicy && (
                                      <Badge variant="destructive" className="text-xs px-1 py-0">
                                        🌶️
                                      </Badge>
                                    )}
                                    {item.isVegetarian && (
                                      <Badge variant="secondary" className="text-xs px-1 py-0">
                                        🌱
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-base font-semibold text-blue-600">
                                  ${item.price}
                                </div>
                              </div>
                              {(item.model3d || item.image) && (
                                <div className="w-12 h-12 ml-2 flex-shrink-0">
                                  {item.model3d ? (
                                    <ModelViewer 
                                      src={item.model3d} 
                                      alt={item.name}
                                      className="w-full h-full"
                                      autoRotate={true}
                                      cameraControls={true}
                                    />
                                  ) : (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full rounded-md object-cover"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </>
                        ) : (
                          // Desktop & Tablet Layout - Side by side
                          <>
                            <div className="flex gap-4 flex-1">
                              {(item.model3d || item.image) && (
                                <div className={cn(
                                  "flex-shrink-0",
                                  viewMode === 'tablet' ? "w-14 h-14" : "w-16 h-16"
                                )}>
                                  {item.model3d ? (
                                    <ModelViewer 
                                      src={item.model3d} 
                                      alt={item.name}
                                      className="w-full h-full"
                                      autoRotate={true}
                                      cameraControls={true}
                                    />
                                  ) : (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full rounded-lg object-cover"
                                    />
                                  )}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={cn(
                                    "font-medium text-gray-900",
                                    viewMode === 'tablet' ? "text-sm" : "text-base"
                                  )}>
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
                                  <p className={cn(
                                    "text-gray-600 mb-2",
                                    viewMode === 'tablet' ? "text-xs" : "text-sm"
                                  )}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className={cn(
                              "font-semibold text-blue-600",
                              viewMode === 'tablet' ? "text-base" : "text-lg"
                            )}>
                              ${item.price}
                            </div>
                          </>
                        )}
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
