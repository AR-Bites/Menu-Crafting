import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    tags: string[];
    gradient: string;
  };
  onSelect: (templateId: string) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
      <div 
        className="aspect-[3/4] relative overflow-hidden"
        style={{ background: template.gradient }}
      >
        <img
          src={template.imageUrl}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={() => onSelect(template.id)}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-200"
          >
            {t('templates.use')}
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {template.name}
        </h3>
        <p className="text-slate-600 mb-3">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
