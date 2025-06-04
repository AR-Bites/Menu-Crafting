import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertMenuSchema,
  insertMenuSectionSchema,
  insertMenuItemSchema,
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'model/gltf-binary';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Menu template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getMenuTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Menu routes
  app.get('/api/menus', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const menus = await storage.getUserMenus(userId);
      res.json(menus);
    } catch (error) {
      console.error("Error fetching menus:", error);
      res.status(500).json({ message: "Failed to fetch menus" });
    }
  });

  app.get('/api/menus/:id', isAuthenticated, async (req: any, res) => {
    try {
      const menuId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const menu = await storage.getMenu(menuId);
      if (!menu || menu.userId !== userId) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      const fullMenu = await storage.getFullMenu(menuId);
      res.json(fullMenu);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });

  app.post('/api/menus', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const menuData = insertMenuSchema.parse({
        ...req.body,
        userId,
        shareSlug: nanoid(10),
      });
      
      const menu = await storage.createMenu(menuData);
      res.status(201).json(menu);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating menu:", error);
      res.status(500).json({ message: "Failed to create menu" });
    }
  });

  app.put('/api/menus/:id', isAuthenticated, async (req: any, res) => {
    try {
      const menuId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const existingMenu = await storage.getMenu(menuId);
      if (!existingMenu || existingMenu.userId !== userId) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      const updateData = insertMenuSchema.partial().parse(req.body);
      const updatedMenu = await storage.updateMenu(menuId, updateData);
      res.json(updatedMenu);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating menu:", error);
      res.status(500).json({ message: "Failed to update menu" });
    }
  });

  app.delete('/api/menus/:id', isAuthenticated, async (req: any, res) => {
    try {
      const menuId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const menu = await storage.getMenu(menuId);
      if (!menu || menu.userId !== userId) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      await storage.deleteMenu(menuId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting menu:", error);
      res.status(500).json({ message: "Failed to delete menu" });
    }
  });

  // Public menu access
  app.get('/api/public/menus/:slug', async (req, res) => {
    try {
      const menu = await storage.getMenuBySlug(req.params.slug);
      if (!menu || !menu.isPublished) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      const fullMenu = await storage.getFullMenu(menu.id);
      res.json(fullMenu);
    } catch (error) {
      console.error("Error fetching public menu:", error);
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });

  // Menu section routes
  app.post('/api/menus/:menuId/sections', isAuthenticated, async (req: any, res) => {
    try {
      const menuId = parseInt(req.params.menuId);
      const userId = req.user.claims.sub;
      
      // Verify menu ownership
      const menu = await storage.getMenu(menuId);
      if (!menu || menu.userId !== userId) {
        return res.status(404).json({ message: "Menu not found" });
      }
      
      const sectionData = insertMenuSectionSchema.parse({
        ...req.body,
        menuId,
      });
      
      const section = await storage.createMenuSection(sectionData);
      res.status(201).json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating section:", error);
      res.status(500).json({ message: "Failed to create section" });
    }
  });

  app.put('/api/sections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const sectionId = parseInt(req.params.id);
      const updateData = insertMenuSectionSchema.partial().parse(req.body);
      
      const updatedSection = await storage.updateMenuSection(sectionId, updateData);
      res.json(updatedSection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating section:", error);
      res.status(500).json({ message: "Failed to update section" });
    }
  });

  app.delete('/api/sections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const sectionId = parseInt(req.params.id);
      await storage.deleteMenuSection(sectionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({ message: "Failed to delete section" });
    }
  });

  // Menu item routes
  app.post('/api/sections/:sectionId/items', isAuthenticated, async (req: any, res) => {
    try {
      const sectionId = parseInt(req.params.sectionId);
      
      const itemData = insertMenuItemSchema.parse({
        ...req.body,
        sectionId,
      });
      
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.put('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      
      const updatedItem = await storage.updateMenuItem(itemId, updateData);
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.deleteMenuItem(itemId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // File upload routes
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // In a real app, you'd upload to cloud storage (S3, Cloudinary, etc.)
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
