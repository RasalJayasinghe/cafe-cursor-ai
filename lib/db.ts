import { getStore } from "@netlify/blobs";
import * as fs from "fs";
import * as path from "path";

// Use Netlify Blobs for production, file-based for local development
const isDev = process.env.NODE_ENV === "development";
const DATA_DIR = path.join(process.cwd(), ".data");

// Ensure data directory exists for local development
if (isDev) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.warn("Could not create data directory:", error);
  }
}

function getBlobStore(storeName: string) {
  if (isDev && !process.env.NETLIFY_BLOBS_CONTEXT) {
    // Local development fallback - use file system
    return null;
  }
  return getStore({
    name: storeName,
    siteID: process.env.SITE_ID || "",
    token: process.env.NETLIFY_BLOBS_TOKEN || "",
  });
}

// File-based storage for local development
function readLocalData<T>(storeName: string): T[] {
  try {
    const filePath = path.join(DATA_DIR, `${storeName}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T[];
    }
  } catch (error) {
    console.warn(`Error reading local data for ${storeName}:`, error);
  }
  return [];
}

function writeLocalData<T>(storeName: string, data: T[]): void {
  try {
    const filePath = path.join(DATA_DIR, `${storeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing local data for ${storeName}:`, error);
  }
}

export interface Order {
  id: string;
  token?: string; // Add token field for verification
  customerName: string;
  email: string;
  phone: string;
  orderType: "pickup" | "dine-in";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  claimed: boolean; // Track if meal was claimed
}

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  publicId?: string; // Cloudinary public ID for deletion
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Question {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  askedAt: string;
  answeredAt?: string;
}

// Generic read function using Netlify Blobs or file-based storage
async function readData<T>(storeName: string): Promise<T[]> {
  const store = getBlobStore(storeName);
  
  if (!store) {
    // Local development: use file-based storage
    return readLocalData<T>(storeName);
  }

  try {
    const data = await store.get("data", { type: "json" });
    return (data || []) as T[];
  } catch (error) {
    console.error(`Error reading from blob store ${storeName}:`, error);
    return [];
  }
}

// Generic write function using Netlify Blobs or file-based storage
async function writeData<T>(storeName: string, data: T[]): Promise<void> {
  const store = getBlobStore(storeName);
  
  if (!store) {
    // Local development: use file-based storage
    writeLocalData(storeName, data);
    return;
  }

  try {
    await store.setJSON("data", data);
  } catch (error) {
    console.error(`Error writing to blob store ${storeName}:`, error);
    throw error;
  }
}

// Orders CRUD
export const ordersDb = {
  getAll: () => readData<Order>("orders"),

  getById: async (id: string) => {
    const orders = await readData<Order>("orders");
    return orders.find((order) => order.id === id);
  },

  getByEmail: async (email: string) => {
    const orders = await readData<Order>("orders");
    return orders.find((order) => order.email.toLowerCase() === email.toLowerCase());
  },

  create: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const orders = await readData<Order>("orders");
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    await writeData("orders", orders);
    return newOrder;
  },

  update: async (id: string, updates: Partial<Order>) => {
    const orders = await readData<Order>("orders");
    const index = orders.findIndex((order) => order.id === id);

    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeData("orders", orders);
    return orders[index];
  },

  delete: async (id: string) => {
    const orders = await readData<Order>("orders");
    const filtered = orders.filter((order) => order.id !== id);

    if (filtered.length === orders.length) return false;

    await writeData("orders", filtered);
    return true;
  },
};

// Projects CRUD
export const projectsDb = {
  getAll: () => readData<Project>("projects"),

  getById: async (id: string) => {
    const projects = await readData<Project>("projects");
    return projects.find((project) => project.id === id);
  },

  create: async (project: Omit<Project, "id" | "createdAt" | "likes">) => {
    const projects = await readData<Project>("projects");
    const newProject: Project = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    await writeData("projects", projects);
    return newProject;
  },

  update: async (id: string, updates: Partial<Project>) => {
    const projects = await readData<Project>("projects");
    const index = projects.findIndex((project) => project.id === id);

    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    await writeData("projects", projects);
    return projects[index];
  },

  delete: async (id: string) => {
    const projects = await readData<Project>("projects");
    const filtered = projects.filter((project) => project.id !== id);

    if (filtered.length === projects.length) return false;

    await writeData("projects", filtered);
    return true;
  },

  incrementLikes: async (id: string) => {
    const projects = await readData<Project>("projects");
    const index = projects.findIndex((project) => project.id === id);

    if (index === -1) return null;

    projects[index].likes += 1;
    await writeData("projects", projects);
    return projects[index];
  },
};

// Photos CRUD
export const photosDb = {
  getAll: () => readData<Photo>("photos"),

  getApproved: async () => {
    const photos = await readData<Photo>("photos");
    return photos.filter((photo) => photo.status === "approved");
  },

  getPending: async () => {
    const photos = await readData<Photo>("photos");
    return photos.filter((photo) => photo.status === "pending");
  },

  getById: async (id: string) => {
    const photos = await readData<Photo>("photos");
    return photos.find((photo) => photo.id === id);
  },

  create: async (photo: Omit<Photo, "id" | "uploadedAt" | "likes" | "status">) => {
    const photos = await readData<Photo>("photos");
    const newPhoto: Photo = {
      ...photo,
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      likes: 0,
      status: "pending", // All uploads need admin approval
      uploadedAt: new Date().toISOString(),
    };
    photos.push(newPhoto);
    await writeData("photos", photos);
    return newPhoto;
  },

  delete: async (id: string) => {
    const photos = await readData<Photo>("photos");
    const filtered = photos.filter((photo) => photo.id !== id);

    if (filtered.length === photos.length) return false;

    await writeData("photos", filtered);
    return true;
  },

  incrementLikes: async (id: string) => {
    const photos = await readData<Photo>("photos");
    const index = photos.findIndex((photo) => photo.id === id);

    if (index === -1) return null;

    photos[index].likes += 1;
    await writeData("photos", photos);
    return photos[index];
  },

  updateStatus: async (id: string, status: "pending" | "approved" | "rejected", reviewedBy?: string) => {
    const photos = await readData<Photo>("photos");
    const index = photos.findIndex((photo) => photo.id === id);

    if (index === -1) return null;

    photos[index] = {
      ...photos[index],
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    };
    await writeData("photos", photos);
    return photos[index];
  },
};

// Questions CRUD
export const questionsDb = {
  getAll: () => readData<Question>("questions"),

  getById: async (id: string) => {
    const questions = await readData<Question>("questions");
    return questions.find((question) => question.id === id);
  },

  create: async (question: Omit<Question, "id" | "askedAt">) => {
    const questions = await readData<Question>("questions");
    const newQuestion: Question = {
      ...question,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      askedAt: new Date().toISOString(),
    };
    questions.push(newQuestion);
    await writeData("questions", questions);
    return newQuestion;
  },

  answer: async (id: string, answer: string) => {
    const questions = await readData<Question>("questions");
    const index = questions.findIndex((question) => question.id === id);

    if (index === -1) return null;

    questions[index].answer = answer;
    questions[index].answeredAt = new Date().toISOString();
    await writeData("questions", questions);
    return questions[index];
  },

  delete: async (id: string) => {
    const questions = await readData<Question>("questions");
    const filtered = questions.filter((question) => question.id !== id);

    if (filtered.length === questions.length) return false;

    await writeData("questions", filtered);
    return true;
  },
};
