import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/useI18n";
import type { FullMenu } from "@/types/menu";
import { Save, Plus, Edit, Trash2, Layers, Palette } from "lucide-react";

interface EditorSidebarProps {
  menu: FullMenu;
  onSave: () => void;
  isSaving?: boolean;
}

export function EditorSidebar({ menu, onSave, isSaving }: EditorSidebarProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("sections");

  return (
    <div className="editor-sidebar">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {t('editor.title')}
          </h3>
        </div>
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : t('editor.save')}
        </Button>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
          <TabsTrigger value="sections" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>{t('editor.sections')}</span>
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>{t('editor.design')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Sections Panel */}
        <TabsContent value="sections" className="flex-1 overflow-y-auto p-4 mt-0">
          {/* Add Section Button */}
          <Button 
            variant="outline" 
            className="w-full mb-4 border-dashed border-2 hover:border-primary hover:text-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('editor.addSection')}
          </Button>

          {/* Menu Sections */}
          <div className="space-y-4">
            {menu.sections.map((section) => (
              <div key={section.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{section.name}</h4>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Section Items */}
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="bg-card rounded-md p-3 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-foreground">{item.name}</h5>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <span className="text-sm font-semibold text-primary">
                            ${item.price}
                          </span>
                        </div>
                        {item.image && (
                          <div className="ml-2 w-12 h-12 bg-muted rounded-md overflow-hidden">
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

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full mt-2 border border-dashed border-border hover:border-primary hover:text-primary"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {t('editor.addItem')}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Design Panel */}
        <TabsContent value="design" className="flex-1 overflow-y-auto p-4 mt-0">
          {/* Color Scheme */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">
              {t('editor.colorScheme')}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <button className="w-12 h-12 rounded-lg bg-primary border-2 border-primary shadow-inner"></button>
              <button className="w-12 h-12 rounded-lg bg-emerald-500 border-2 border-transparent hover:border-emerald-600"></button>
              <button className="w-12 h-12 rounded-lg bg-amber-500 border-2 border-transparent hover:border-amber-600"></button>
              <button className="w-12 h-12 rounded-lg bg-rose-500 border-2 border-transparent hover:border-rose-600"></button>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">
              {t('editor.typography')}
            </h4>
            <select className="w-full p-2 border border-border rounded-md text-sm bg-background">
              <option value="inter">Inter (Modern)</option>
              <option value="serif">Times (Classic)</option>
              <option value="sans">Helvetica (Clean)</option>
            </select>
          </div>

          {/* Layout Spacing */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">
              {t('editor.spacing')}
            </h4>
            <input 
              type="range" 
              min="1" 
              max="5" 
              defaultValue="3" 
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{t('editor.compact')}</span>
              <span>{t('editor.comfortable')}</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
