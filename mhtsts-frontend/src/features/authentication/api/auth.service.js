import { mockUsers } from './mockData';

// Simulated delay to mimic network latency
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  async login(email, password) {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (!user.isActive) {
        return { success: false, message: 'Account is deactivated. Please contact administrator.' };
      }
      
      // Remove password before sending
      const { password: _, ...safeUser } = user;
      
      // In a real app, this would be a JWT token from the server
      const mockToken = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
      
      return {
        success: true,
        user: safeUser,
        token: mockToken
      };
    }
    
    return { success: false, message: 'Invalid email or password' };
  }

  async register(data) {
    await delay(1200);
    
    const exists = mockUsers.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email already registered');
    }
    
    return { success: true, message: 'Registration successful' };
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('mc_user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
