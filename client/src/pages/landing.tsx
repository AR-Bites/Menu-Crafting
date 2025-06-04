import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { Utensils, ArrowRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Link } from "wouter";

export default function Landing() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
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
              <Button asChild>
                <a href="/api/login" className="flex items-center space-x-2">
                  <span>{t('signin')}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t('welcome.title')}
                <span className="text-primary block mt-2">
                  {t('welcome.highlight')}
                </span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                {t('welcome.subtitle')}
              </p>
              <Button
                size="lg"
                className="text-lg px-8 py-4"
                asChild
              >
                <a href="/api/login" className="flex items-center space-x-2">
                  <span>{t('welcome.cta')}</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Drag & Drop Editor
                </h3>
                <p className="text-slate-600">
                  Intuitive interface for building beautiful menus without any coding knowledge.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  3D Models
                </h3>
                <p className="text-slate-600">
                  Showcase your dishes with stunning 3D models that customers can interact with.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-amber-500 rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  QR Code Sharing
                </h3>
                <p className="text-slate-600">
                  Generate QR codes instantly for contactless menu sharing with your customers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
