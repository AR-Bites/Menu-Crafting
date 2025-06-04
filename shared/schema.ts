import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu templates
export const menuTemplates = pgTable("menu_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  designConfig: jsonb("design_config").notNull(), // Colors, fonts, spacing
  previewImage: varchar("preview_image"),
  category: varchar("category", { length: 50 }), // modern, casual, premium
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User menus
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  templateId: serial("template_id").references(() => menuTemplates.id),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  restaurantName: varchar("restaurant_name", { length: 200 }),
  tagline: varchar("tagline", { length: 300 }),
  headerImage: varchar("header_image"),
  designConfig: jsonb("design_config"), // Override template design
  isPublished: boolean("is_published").default(false),
  shareSlug: varchar("share_slug").unique(), // For public sharing
  qrCodeData: text("qr_code_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu sections (Starters, Mains, Desserts, etc.)
export const menuSections = pgTable("menu_sections", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }), // Arabic translation
  description: text("description"),
  descriptionAr: text("description_ar"),
  sortOrder: integer("sort_order").default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Menu items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => menuSections.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  nameAr: varchar("name_ar", { length: 200 }), // Arabic translation
  description: text("description"),
  descriptionAr: text("description_ar"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image"), // Image URL or file path
  model3d: varchar("model_3d"), // GLB file path
  allergens: jsonb("allergens"), // Array of allergen info
  extras: jsonb("extras"), // Additional options like "Add cheese"
  isAvailable: boolean("is_available").default(true),
  isSpicy: boolean("is_spicy").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuSectionSchema = createInsertSchema(menuSections).omit({
  id: true,
  createdAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuTemplateSchema = createInsertSchema(menuTemplates).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type MenuSection = typeof menuSections.$inferSelect;
export type InsertMenuSection = z.infer<typeof insertMenuSectionSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuTemplate = typeof menuTemplates.$inferSelect;
export type InsertMenuTemplate = z.infer<typeof insertMenuTemplateSchema>;
