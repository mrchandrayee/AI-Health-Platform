'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { User, UserProfile } from '@/types';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const [userData, profileData] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getUserProfile()
      ]);
      setUser(userData as User);
      setProfile(profileData as UserProfile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      Cookies.remove('access_token');
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ username, password });
      
      // Store token in cookie
      Cookies.set('access_token', response.access_token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Fetch user data
      await refreshUser();
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.detail || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      await apiClient.register(userData);
      
      // Automatically log in after registration
      const loginSuccess = await login(userData.username, userData.password);
      
      if (loginSuccess) {
        toast.success('Account created successfully!');
      }
      
      return loginSuccess;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.detail || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    setProfile(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const updatedProfile = await apiClient.updateUserProfile(profileData);
      setProfile(updatedProfile as UserProfile);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.detail || 'Profile update failed');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
