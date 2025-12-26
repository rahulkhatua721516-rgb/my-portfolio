
import { Project, Message, SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

/**
 * Intelligent API base detection for development and production.
 */
const getApiBase = () => {
  // 1. Check for environment variable (Vite/Vercel)
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // 2. Check for manual override in localStorage
  const override = localStorage.getItem('PORTFOLIO_API_URL');
  if (override) return override;

  const { hostname, protocol, port } = window.location;
  
  // Detect if running on a local development environment (e.g., localhost:3000)
  const isLocal = ['localhost', '127.0.0.1', '0.0.0.0', '::1', ''].includes(hostname);
  
  if (isLocal) {
    // If you're running the frontend on port 3000 and backend on 5000:
    return 'http://localhost:5000/api';
  }

  // In production, we assume the backend is hosted at the same origin under /api
  // or you can set PORTFOLIO_API_URL in your deployment environment.
  return '/api';
};

const API_BASE = getApiBase();

const getHeaders = () => {
  const token = localStorage.getItem('portfolio_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || ''}`,
    'Accept': 'application/json'
  };
};

/**
 * Helper to handle fetch errors consistently and provide debugging info
 */
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${res.status}`);
  }
  return res.json();
}

export const storageService = {
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const res = await fetch(`${API_BASE}/settings`, { 
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      const data = await handleResponse(res);
      return { ...DEFAULT_SETTINGS, ...data };
    } catch (e) {
      console.group("Portfolio API Error");
      console.error("❌ Failed to fetch settings from:", `${API_BASE}/settings`);
      console.error("Reason:", e instanceof Error ? e.message : "Network Error");
      console.info("💡 Troubleshooting: Ensure your Node.js backend (server.js) is running on port 5000.");
      console.groupEnd();
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (settings: SiteSettings): Promise<void> => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    await handleResponse(res);
  },

  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects`, { 
        method: 'GET',
        mode: 'cors' 
      });
      const data = await handleResponse(res);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("❌ Projects Fetch Error:", e);
      return [];
    }
  },

  saveProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project)
    });
    return await handleResponse(res);
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<void> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    await handleResponse(res);
  },

  getMessages: async (): Promise<Message[]> => {
    try {
      const res = await fetch(`${API_BASE}/messages`, { 
        headers: getHeaders(),
        mode: 'cors'
      });
      const data = await handleResponse(res);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  saveMessage: async (msg: Omit<Message, 'id' | 'date'>): Promise<void> => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    await handleResponse(res);
  },

  deleteMessage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await handleResponse(res);
  },

  clearAllMessages: async (): Promise<void> => {
    const messages = await storageService.getMessages();
    for (const msg of messages) {
      const idToDelete = msg.id || msg._id;
      if (idToDelete) {
        await storageService.deleteMessage(idToDelete);
      }
    }
  },

  login: async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('portfolio_token', token);
        localStorage.setItem('portfolio_auth', 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login Network Error:", e);
      throw e; // Rethrow to be caught by the UI
    }
  },

  isLoggedIn: (): boolean => {
    const auth = localStorage.getItem('portfolio_auth');
    const token = localStorage.getItem('portfolio_token');
    return auth === 'true' && !!token;
  },

  logout: (): void => {
    localStorage.removeItem('portfolio_auth');
    localStorage.removeItem('portfolio_token');
  }
};
