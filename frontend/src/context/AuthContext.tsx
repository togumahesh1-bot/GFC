import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, SavedAddress } from '../types';
import { db, subscribeToStorageChanges, hashPassword } from '../db/storage';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, phone: string, email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  toggleFavorite: (foodItemId: string) => boolean;
  isFavorite: (foodItemId: string) => boolean;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeSavedAddress: (id: string) => void;
  updateProfile: (name: string, phone: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const { showToast } = useToast();

  const syncUserFromStorage = useCallback(() => {
    const fresh = db.getCurrentUser();
    setCurrentUser(fresh);
  }, []);

  useEffect(() => {
    return subscribeToStorageChanges(syncUserFromStorage);
  }, [syncUserFromStorage]);

  const login = async (emailOrPhone: string, password = ''): Promise<{ success: boolean; message: string }> => {
    const users = db.getUsers();
    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Check if matching email or phone
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanInput || u.phone.trim() === cleanInput
    );

    if (!user) {
      return { success: false, message: 'No account found with this email or phone' };
    }

    // If user has a password hash, verify it (demo allows simple test login)
    if (user.passwordHash && password) {
      const hashed = await hashPassword(password);
      if (user.passwordHash !== hashed && password !== 'admin123' && password !== 'demo123') {
        return { success: false, message: 'Invalid password. Try "admin123" for admin or "demo123"' };
      }
    }

    db.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, message: 'Logged in successfully' };
  };

  const signup = async (
    name: string,
    phone: string,
    email: string,
    password = ''
  ): Promise<{ success: boolean; message: string }> => {
    const users = db.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!name.trim()) return { success: false, message: 'Please enter your name' };
    if (!cleanPhone || cleanPhone.length < 10) return { success: false, message: 'Please enter a valid 10-digit phone number' };

    const exists = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
    );

    if (exists) {
      return { success: false, message: 'An account with this email or phone already exists. Please log in.' };
    }

    let passwordHash = undefined;
    if (password) {
      passwordHash = await hashPassword(password);
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhone}@gangamma.in`,
      role: 'customer',
      passwordHash,
      loyaltyPoints: 50, // Welcome bonus of 50 loyalty points!
      savedAddresses: [],
      favorites: ['ff-1', 'ff-8'],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('gff_users_v1', JSON.stringify(updatedUsers));
    db.setCurrentUser(newUser);
    setCurrentUser(newUser);
    showToast(`Account created! You received 50 bonus loyalty points 🎉`, 'success');
    return { success: true, message: 'Account created successfully' };
  };

  const logout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const loginAsCustomer = () => {
    const users = db.getUsers();
    let customer = users.find((u) => u.role === 'customer');
    if (!customer) {
      customer = {
        id: 'usr-demo-cust',
        name: 'Mahesh Togu',
        email: 'togumahesh1@gmail.com',
        phone: '9123456780',
        role: 'customer',
        loyaltyPoints: 120,
        savedAddresses: [
          {
            id: 'addr-1',
            label: 'Home',
            address: 'Flat 302, Sai Residency, Road No. 4, Banjara Hills',
            landmark: 'Near Water Tank',
            pincode: '500034',
            isDefault: true,
          },
        ],
        favorites: ['ff-1', 'ff-6', 'ff-10', 'ff-22'],
        createdAt: new Date().toISOString(),
      };
      db.updateUser(customer);
    }
    db.setCurrentUser(customer);
    setCurrentUser(customer);
    showToast('Switched to Customer Account (Mahesh)', 'success');
  };

  const loginAsAdmin = () => {
    const users = db.getUsers();
    let admin = users.find((u) => u.role === 'admin');
    if (!admin) {
      admin = {
        id: 'usr-admin-1',
        name: 'Gangamma Restaurant Manager',
        email: 'admin@gangamma.com',
        phone: '9876543210',
        role: 'admin',
        loyaltyPoints: 500,
        savedAddresses: [],
        favorites: ['ff-1', 'ff-8', 'ff-10'],
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      db.updateUser(admin);
    }
    db.setCurrentUser(admin);
    setCurrentUser(admin);
    showToast('Switched to Restaurant Admin Portal', 'success');
  };

  const toggleFavorite = (foodItemId: string): boolean => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please log in to save your favorite dishes', 'info');
      return false;
    }
    const isNowFav = db.toggleFavorite(currentUser.id, foodItemId);
    const updated = db.getCurrentUser();
    setCurrentUser(updated);
    showToast(isNowFav ? 'Added to your favorites ❤️' : 'Removed from favorites', 'info');
    return isNowFav;
  };

  const isFavorite = (foodItemId: string): boolean => {
    if (!currentUser) return false;
    return currentUser.favorites?.includes(foodItemId) || false;
  };

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: SavedAddress = {
      ...address,
      id: 'addr-' + Date.now(),
      isDefault: currentUser.savedAddresses.length === 0,
    };
    const updatedUser: User = {
      ...currentUser,
      savedAddresses: [...currentUser.savedAddresses, newAddr],
    };
    db.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    showToast('Address saved for quick checkout', 'success');
  };

  const removeSavedAddress = (id: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.filter((a) => a.id !== id),
    };
    db.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    showToast('Address removed', 'info');
  };

  const updateProfile = (name: string, phone: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      phone: phone.trim() || currentUser.phone,
    };
    db.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    showToast('Profile updated successfully', 'success');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        signup,
        logout,
        loginAsCustomer,
        loginAsAdmin,
        toggleFavorite,
        isFavorite,
        addSavedAddress,
        removeSavedAddress,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
