import { clientEngine, DEMO_USERS } from './clientEngine';

const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('landchain_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `HTTP ${response.status}: Request failed`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await handleResponse(res);
    } catch {
      // Fallback for VS Code "Go Live" (Live Server) mode
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        localStorage.setItem('landchain_token', `client_token_${user.role}_${user.id}`);
        return {
          success: true,
          token: `client_token_${user.role}_${user.id}`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
          }
        };
      }
      throw new Error('Invalid email or password.');
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      // Fallback for VS Code Live Server mode
      const token = localStorage.getItem('landchain_token');
      if (token && token.startsWith('client_token_')) {
        const parts = token.split('_');
        const role = parts[2];
        const id = parseInt(parts[3], 10);
        const user = DEMO_USERS.find(u => u.id === id) || DEMO_USERS[0];
        return { success: true, user };
      }
      throw new Error('Not authenticated');
    }
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${BASE_URL}/stats`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.getStats();
    }
  },

  // Land Records
  async getLandRecords(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/land-records?${query}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.getRecords(params);
    }
  },

  async getLandRecordById(id) {
    try {
      const res = await fetch(`${BASE_URL}/land-records/${id}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.getRecordById(id);
    }
  },

  async createLandRecord(formData) {
    try {
      const res = await fetch(`${BASE_URL}/land-records`, {
        method: 'POST',
        headers: {
          ...getAuthHeader()
        },
        body: formData
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.createRecord(formData);
    }
  },

  async updateLandRecord(id, data) {
    try {
      const res = await fetch(`${BASE_URL}/land-records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.transferLandRecord(id, data);
    }
  },

  async transferProperty(id, data) {
    return this.updateLandRecord(id, data);
  },

  // Verification & Tamper Detection
  async verifyLandRecord(id) {
    try {
      const res = await fetch(`${BASE_URL}/land-records/${id}/verify`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.verifyRecord(id);
    }
  },

  // Blockchain
  async getBlockchain() {
    try {
      const res = await fetch(`${BASE_URL}/blockchain`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.getBlockchain();
    }
  },

  async validateBlockchain() {
    try {
      const res = await fetch(`${BASE_URL}/blockchain/validate`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.validateBlockchain();
    }
  },

  async getBlockByIndex(index) {
    try {
      const res = await fetch(`${BASE_URL}/blockchain/${index}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      const bc = await clientEngine.getBlockchain();
      return { success: true, block: bc.chain[index] };
    }
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/audit-logs?${query}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.getAuditLogs(params);
    }
  },

  // Users (ADMIN only)
  async getUsers() {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return {
        success: true,
        count: DEMO_USERS.length,
        users: DEMO_USERS.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          created_at: u.created_at,
          status: 'ACTIVE'
        }))
      };
    }
  },

  // Demo Tamper Simulation (ADMIN only)
  async simulateTampering(id, data = {}) {
    try {
      const res = await fetch(`${BASE_URL}/demo/tamper/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.simulateTamper(id, data);
    }
  },

  async restoreRecord(id) {
    try {
      const res = await fetch(`${BASE_URL}/demo/restore/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      return await handleResponse(res);
    } catch {
      return clientEngine.restoreRecord(id);
    }
  }
};
