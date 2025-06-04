import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/language-toggle";
import { Utensils, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { Menu } from "@shared/schema";

export default function Home() {
  const { t } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: menus, isLoading } = useQuery({
    queryKey: ["/api/menus"],
  });

  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: number) => apiRequest(`/api/menus/${menuId}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menus"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Utensils className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t('home.title')}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    {t('home.welcome')}, {user.email}
                  </div>
                  <Button asChild variant="outline">
                    <a href="/api/logout">{t('common.logout')}</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('home.yourMenus')}
            </h2>
            <p className="text-gray-600 mt-1">
              {t('home.manageMenus')}
            </p>
          </div>

          <Button asChild>
            <Link href="/templates">
              <Plus className="h-4 w-4 mr-2" />
              {t('home.createMenu')}
            </Link>
          </Button>
        </div>

        {/* Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus?.map((menu: Menu) => (
            <Card key={menu.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      {menu.restaurantName}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {menu.isPublished && (
                      <Badge variant="secondary">{t('common.published')}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/editor/${menu.id}`}>
                        <Edit className="h-3 w-3 mr-1" />
                        {t('common.edit')}
                      </Link>
                    </Button>

                    {menu.shareSlug && (
                      <Button asChild variant="outline" size="sm">
                        <a href={`/menu/${menu.shareSlug}`} target="_blank">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {t('common.view')}
                        </a>
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMenuMutation.mutate(menu.id)}
                    disabled={deleteMenuMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!menus || menus.length === 0) && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('home.noMenus')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('home.getStarted')}
            </p>
            <Button asChild>
              <Link href="/templates">
                <Plus className="h-4 w-4 mr-2" />
                {t('home.createFirstMenu')}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}