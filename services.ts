
import { User } from './types';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'mohammadadisetiawan09@gmail.com';
const ADMIN_PASSWORD = 'Adinof30#';
const ADMIN_USERNAME = 'adisetiawan';

export const api = {
  login: (email: string, pass: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email.toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
          console.log('Admin login successful');
          resolve({
            id: 'admin-user-01',
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME
          });
        } else {
          console.error('Admin login failed: Invalid credentials');
          resolve(null);
        }
      }, 500);
    });
  },

  submitApplication: (applicationData: { name: string; email: string; role: string, country: string, experience: string }): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Simulating sending email and saving application for:', applicationData.name);
        // In a real app, this would post to a server.
        // Here, we just log it and the DataContext will handle adding it to state.
        resolve({ success: true });
      }, 500);
    });
  }
};
