import { useI18n } from "@/hooks/useI18n";
import type { FullMenu } from "@/types/menu";
import { Badge } from "@/components/ui/badge";

interface MenuPreviewProps {
  menu: FullMenu;
  isDesktop: boolean;
}

export function MenuPreview({ menu, isDesktop }: MenuPreviewProps) {
  const { language } = useI18n();

  const containerClass = isDesktop 
    ? "max-w-2xl mx-auto py-8 px-4" 
    : "max-w-sm mx-auto py-4 px-2";

  const getName = (name: string, nameAr?: string) => {
    return language === 'ar' && nameAr ? nameAr : name;
  };

  const getDescription = (description?: string, descriptionAr?: string) => {
    return language === 'ar' && descriptionAr ? descriptionAr : description;
  };

  return (
    <div className="flex-1 bg-muted overflow-auto">
      <div className={containerClass}>
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          {/* Menu Header */}
          <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900">
            {menu.menu.headerImage ? (
              <img 
                src={menu.menu.headerImage} 
                alt="Restaurant header"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" 
                alt="Restaurant interior"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {menu.menu.restaurantName}
                </h1>
                <p className="text-lg opacity-90">
                  {menu.menu.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <div className="p-8">
            {menu.sections.map((section) => (
              <div key={section.id} className="mb-10 last:mb-0">
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary">
                  {getName(section.name, section.nameAr)}
                </h2>
                
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {getName(item.name, item.nameAr)}
                          </h3>
                          <div className="flex gap-1">
                            {item.isVegetarian && (
                              <Badge variant="secondary" className="text-xs">
                                🌱
                              </Badge>
                            )}
                            {item.isSpicy && (
                              <Badge variant="destructive" className="text-xs">
                                🌶️
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {getDescription(item.description, item.descriptionAr)}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center space-x-3">
                        <span className="text-lg font-bold text-primary">
                          ${item.price}
                        </span>
                        {item.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={item.image} 
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
          </div>
        </div>
      </div>
    </div>
  );
}
