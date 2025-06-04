import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/template-card";
import { LanguageToggle } from "@/components/language-toggle";
import { Utensils, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const templates = [
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean lines and elegant typography for upscale dining",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
    tags: ["Elegant", "Fine Dining"],
    gradient: "bg-gradient-to-br from-slate-100 to-slate-200",
  },
  {
    id: "vibrant",
    name: "Vibrant Casual",
    description: "Warm colors and playful design for casual dining",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
    tags: ["Casual", "Family"],
    gradient: "bg-gradient-to-br from-amber-100 to-orange-200",
  },
  {
    id: "dark",
    name: "Dark Premium",
    description: "Sophisticated dark theme for premium establishments",
    imageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
    tags: ["Premium", "Night Dining"],
    gradient: "bg-gradient-to-br from-slate-800 to-slate-900",
  },
];

export default function TemplateSelection() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);

  const createRestaurantMutation = useMutation({
    mutationFn: async (data: { name: string; template: string }) => {
      const response = await apiRequest("POST", "/api/restaurants", data);
      return await response.json();
    },
    onSuccess: (restaurant) => {
      setLocation(`/editor/${restaurant.id}`);
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    setIsCreating(true);
    const name = prompt("Enter your restaurant name:");
    
    if (name?.trim()) {
      createRestaurantMutation.mutate({
        name: name.trim(),
        template: templateId,
      });
    } else {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-amber-500 rounded-lg flex items-center justify-center">
                <Utensils className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                {t('menucraft')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button variant="outline" asChild>
                <a href="/api/logout">{t('signout')}</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('templates.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('templates.subtitle')}
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('templates.back')}
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Loading State */}
      {(isCreating || createRestaurantMutation.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Creating your restaurant...</p>
          </div>
        </div>
      )}
    </div>
  );
}
