import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Edit, Trash2, X } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { Menu, MenuSection, MenuItem } from "@shared/schema";

interface EditorSidebarProps {
  restaurant: Menu;
  sections: (MenuSection & { items: MenuItem[] })[];
  onSave: () => void;
  onClose: () => void;
  onAddSection: () => void;
  onEditSection: (section: MenuSection) => void;
  onDeleteSection: (sectionId: number) => void;
  onAddItem: (sectionId: number) => void;
  onEditItem: (item: MenuItem) => void;
  onUpdateDesign: (design: Partial<Menu>) => void;
}

export function EditorSidebar({
  restaurant,
  sections,
  onSave,
  onClose,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddItem,
  onEditItem,
  onUpdateDesign,
}: EditorSidebarProps) {
  const { t } = useI18n();
  const [spacing, setSpacing] = useState([3]);

  const colorSchemes = [
    { id: 'indigo', color: 'bg-indigo-500' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'amber', color: 'bg-amber-500' },
    { id: 'rose', color: 'bg-rose-500' },
  ];

  const handleColorSchemeChange = (colorScheme: string) => {
    onUpdateDesign({ designConfig: { colorScheme } });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onUpdateDesign({ designConfig: { fontFamily } });
  };

  const handleSpacingChange = (spacing: number[]) => {
    setSpacing(spacing);
    onUpdateDesign({ designConfig: { spacing: spacing[0] } });
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('editor.menuEditor')}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="sections" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sections">{t('editor.sections')}</TabsTrigger>
              <TabsTrigger value="design">{t('editor.design')}</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {t('editor.menuSections')}
                </h3>
                <Button size="sm" onClick={onAddSection}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('editor.addSection')}
                </Button>
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <Card key={section.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{section.name}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditSection(section)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSection(section.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => onEditItem(item)}
                        >
                          <div className="flex items-center gap-2">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">${item.price}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {item.isSpicy && (
                              <Badge variant="destructive" className="text-xs">🌶️</Badge>
                            )}
                            {item.isVegetarian && (
                              <Badge variant="secondary" className="text-xs">🌱</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onAddItem(section.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('editor.addItem')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  {t('editor.colorScheme')}
                </Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      className={`w-full h-8 rounded ${scheme.color} hover:opacity-80 transition-opacity`}
                      onClick={() => handleColorSchemeChange(scheme.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900">
                  {t('editor.fontFamily')}
                </Label>
                <Select onValueChange={handleFontFamilyChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('editor.selectFont')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans">Sans Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900">
                  {t('editor.spacing')}
                </Label>
                <div className="mt-2">
                  <Slider
                    value={spacing}
                    onValueChange={handleSpacingChange}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Button onClick={onSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {t('editor.saveMenu')}
        </Button>
      </div>
    </div>
  );
}