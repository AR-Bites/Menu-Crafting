import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
}

interface TemplateSelectionProps {
  onBack: () => void;
  onSelectTemplate: (templateId: number) => void;
}

const defaultTemplates: Template[] = [
  {
    id: 1,
    name: 'Modern Minimal',
    description: 'Clean lines and elegant typography for upscale dining',
    category: 'modern',
    previewImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533',
  },
  {
    id: 2,
    name: 'Vibrant Casual',
    description: 'Warm colors and playful design for casual dining',
    category: 'casual',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533',
  },
  {
    id: 3,
    name: 'Dark Premium',
    description: 'Sophisticated dark theme for premium establishments',
    category: 'premium',
    previewImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533',
  },
];

export function TemplateSelection({ onBack, onSelectTemplate }: TemplateSelectionProps) {
  const { t } = useI18n();

  const { data: templates = defaultTemplates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
    retry: false,
  });

  const getTemplateTagsKey = (category: string) => {
    switch (category) {
      case 'modern':
        return 'templates.modern.tags';
      case 'casual':
        return 'templates.vibrant.tags';
      case 'premium':
        return 'templates.dark.tags';
      default:
        return 'templates.modern.tags';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('templates.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('templates.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="template-card animate-pulse">
                  <div className="aspect-[3/4] bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded"></div>
                      <div className="h-6 w-20 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {templates.map((template) => (
                <Card key={template.id} className="template-card">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img 
                      src={template.previewImage} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        className="transform scale-90 group-hover:scale-100 transition-transform duration-200"
                        onClick={() => onSelectTemplate(template.id)}
                      >
                        {t('templates.useTemplate')}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {template.name}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {/* Static tags based on template category */}
                      {template.category === 'modern' && (
                        <>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            Elegant
                          </span>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            Fine Dining
                          </span>
                        </>
                      )}
                      {template.category === 'casual' && (
                        <>
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md">
                            Casual
                          </span>
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md">
                            Family
                          </span>
                        </>
                      )}
                      {template.category === 'premium' && (
                        <>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            Premium
                          </span>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            Night Dining
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToHome')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
