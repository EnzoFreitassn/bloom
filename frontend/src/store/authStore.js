import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabase';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const session = data.session;
          const user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'user',
          };

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          set({ user, profile, token: session.access_token, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.message || 'Erro ao fazer login',
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, role: 'user' } },
          });

          if (error) throw error;

          const user = {
            id: data.user.id,
            email: data.user.email,
            role: 'user',
          };

          set({ user, token: data.session?.access_token || null, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.message || 'Erro ao registrar',
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, token: null });
      },

      clearError: () => set({ error: null }),

      fetchProfile: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          set({ profile });
        }
      },

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || 'user',
          };
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          set({ user, profile, token: session.access_token });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
