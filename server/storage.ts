import {
  users,
  menus,
  menuSections,
  menuItems,
  menuTemplates,
  type User,
  type UpsertUser,
  type Menu,
  type InsertMenu,
  type MenuSection,
  type InsertMenuSection,
  type MenuItem,
  type InsertMenuItem,
  type MenuTemplate,
  type InsertMenuTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Menu template operations
  getMenuTemplates(): Promise<MenuTemplate[]>;
  createMenuTemplate(template: InsertMenuTemplate): Promise<MenuTemplate>;
  
  // Menu operations
  getUserMenus(userId: string): Promise<Menu[]>;
  getMenu(id: number): Promise<Menu | undefined>;
  getMenuBySlug(slug: string): Promise<Menu | undefined>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu>;
  deleteMenu(id: number): Promise<void>;
  
  // Menu section operations
  getMenuSections(menuId: number): Promise<MenuSection[]>;
  createMenuSection(section: InsertMenuSection): Promise<MenuSection>;
  updateMenuSection(id: number, section: Partial<InsertMenuSection>): Promise<MenuSection>;
  deleteMenuSection(id: number): Promise<void>;
  
  // Menu item operations
  getSectionItems(sectionId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;
  
  // Full menu data
  getFullMenu(menuId: number): Promise<{
    menu: Menu;
    sections: Array<MenuSection & { items: MenuItem[] }>;
  } | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Menu template operations
  async getMenuTemplates(): Promise<MenuTemplate[]> {
    return await db
      .select()
      .from(menuTemplates)
      .where(eq(menuTemplates.isActive, true))
      .orderBy(menuTemplates.createdAt);
  }

  async createMenuTemplate(template: InsertMenuTemplate): Promise<MenuTemplate> {
    const [created] = await db
      .insert(menuTemplates)
      .values(template)
      .returning();
    return created;
  }

  // Menu operations
  async getUserMenus(userId: string): Promise<Menu[]> {
    return await db
      .select()
      .from(menus)
      .where(eq(menus.userId, userId))
      .orderBy(desc(menus.updatedAt));
  }

  async getMenu(id: number): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.id, id));
    return menu;
  }

  async getMenuBySlug(slug: string): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.shareSlug, slug));
    return menu;
  }

  async createMenu(menu: InsertMenu): Promise<Menu> {
    const [created] = await db.insert(menus).values(menu).returning();
    return created;
  }

  async updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu> {
    const [updated] = await db
      .update(menus)
      .set({ ...menu, updatedAt: new Date() })
      .where(eq(menus.id, id))
      .returning();
    return updated;
  }

  async deleteMenu(id: number): Promise<void> {
    await db.delete(menus).where(eq(menus.id, id));
  }

  // Menu section operations
  async getMenuSections(menuId: number): Promise<MenuSection[]> {
    return await db
      .select()
      .from(menuSections)
      .where(eq(menuSections.menuId, menuId))
      .orderBy(menuSections.sortOrder);
  }

  async createMenuSection(section: InsertMenuSection): Promise<MenuSection> {
    const [created] = await db
      .insert(menuSections)
      .values(section)
      .returning();
    return created;
  }

  async updateMenuSection(id: number, section: Partial<InsertMenuSection>): Promise<MenuSection> {
    const [updated] = await db
      .update(menuSections)
      .set(section)
      .where(eq(menuSections.id, id))
      .returning();
    return updated;
  }

  async deleteMenuSection(id: number): Promise<void> {
    await db.delete(menuSections).where(eq(menuSections.id, id));
  }

  // Menu item operations
  async getSectionItems(sectionId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.sectionId, sectionId))
      .orderBy(menuItems.sortOrder);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [created] = await db.insert(menuItems).values(item).returning();
    return created;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updated] = await db
      .update(menuItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updated;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Full menu data
  async getFullMenu(menuId: number): Promise<{
    menu: Menu;
    sections: Array<MenuSection & { items: MenuItem[] }>;
  } | undefined> {
    const menu = await this.getMenu(menuId);
    if (!menu) return undefined;

    const sections = await this.getMenuSections(menuId);
    const sectionsWithItems = await Promise.all(
      sections.map(async (section) => {
        const items = await this.getSectionItems(section.id);
        return { ...section, items };
      })
    );

    return { menu, sections: sectionsWithItems };
  }
}

export const storage = new DatabaseStorage();
