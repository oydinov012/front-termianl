import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';
import { User, LoginResponse } from '../types';

// ==========================================
// 🟢 TYPE DEFINITIONS (Context turlari)
// ==========================================
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 🔄 AVTO-AUTH CHECK (Sahifa yangilanganda tokenni tekshirish)
  // ==========================================
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Token bor bo'lsa, foydalanuvchi profilini yuklaymiz
          const response = await api.get<User[]>('/api/profile/');
          if (response.data && response.data.length > 0) {
            setUser(response.data[0]);
          } else {
            // Agar token bor-u, lekin profil massivi bo'sh kelsa, vaqtincha obyekt yaratamiz
            // Bu narsa frontend qotib qolishini oldini oladi
            setUser({ username: 'Foydalanuvchi' } as User);
          }
        } catch (error) {
          console.error('Avtomatik tekshirish muvaffaqiyatsiz tugadi:', error);
          // Token muddati o'tgan bo'lsa, tozalaymiz
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      // 🔴 Har qanday holatda ham yuklanishni tugatamiz
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ==========================================
  // 🚀 LOGIN JARAYONI (Tizimga kirish)
  // ==========================================
  const login = async (username: string, password: string) => {
    try {
      // 1. Backenddan tokenlarni olish
      const response = await api.post<LoginResponse>('/api/auth/login/', { username, password });
      const { access, refresh } = response.data;

      // 2. Tokenlarni brauzer xotirasiga yozish
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 3. Foydalanuvchi profil ma'lumotlarini so'rash
      try {
        const profileResponse = await api.get<User[]>('/api/profile/');
        
        if (profileResponse.data && profileResponse.data.length > 0) {
          // Profil muvaffaqiyatli kelgan bo'lsa, stateni yangilaymiz
          setUser(profileResponse.data[0]);
        } else {
          console.warn("Ogohlantirish: Backend profil massivini bo'sh qaytardi!");
          // Agar login muvaffaqiyatli bo'lsa-yu, profil bo'sh kelsa, o'tishni to'smaymiz
          setUser({ username: username } as User);
        }
      } catch (profileErr) {
        console.error("Token olindi, lekin profil yuklashda xato ketdi:", profileErr);
        // Profil yuklanmasa ham, foydalanuvchi baribir login bo'lgan hisoblanadi
        setUser({ username: username } as User);
      }

    } catch (error) {
      console.error('Login funksiyasida xatolik:', error);
      throw error; // Xatolikni Login.tsx komponentiga otamiz (u yerda catch ushlaydi)
    }
  };

  // ==========================================
  // 📝 REGISTER JARAYONI (Ro'yxatdan o'tish)
  // ==========================================
  const register = async (username: string, email: string, password: string) => {
    try {
      // 1. Ro'yxatdan o'tkazish so'rovi
      await api.post('/api/auth/register/', { username, email, password });
      // 2. Ro'yxatdan o'tgan zahoti avtomatik login qildirish
      await login(username, password);
    } catch (error) {
      console.error('Ro\'yxatdan o\'tishda xatolik:', error);
      console.log(error);
      
      throw error;
    }
  };

  // ==========================================
  // ❌ LOGOUT JARAYONI (Tizimdan chiqish)
  // ==========================================
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // ==========================================
  // 🎨 CONTEXT PROVIDER (Qiymatlarni tarqatish)
  // ==========================================
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user, // User null bo'lmasa true, null bo'lsa false qaytaradi
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// 💡 CUSTOM HOOK (Komponentlarda ishlatish uchun)
// ==========================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth mütloqo AuthProvider ichida ishlatilishi shart!');
  }
  return context;
};