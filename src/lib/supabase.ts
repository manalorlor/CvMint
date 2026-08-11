import { createClient, User } from '@supabase/supabase-js';
import { ResumeData } from '../types';

let rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '').trim();

// Sanitize URL: strip trailing slashes, spaces, and accidental path suffixes like /auth/v1 or /rest/v1
rawUrl = rawUrl.trim().replace(/\/+$/, ''); // Remove trailing slashes
rawUrl = rawUrl.replace(/\/(auth|rest)\/v1\/?$/i, ''); // Strip /auth/v1 or /rest/v1 if included
const supabaseUrl = rawUrl;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

// Fallback client prevents runtime crashes when env vars are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type { User };

// Google Auth Handler
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify / environment variables."
    );
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

// Email/Password Handlers
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User | null> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify / environment settings."
    );
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  if (error) throw error;

  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not create profile record:', e);
    }
  }

  // Explicitly sign out so the user is directed to sign in with credentials after confirming
  await supabase.auth.signOut();
  return data.user;
}

export async function updateUserProfile(
  displayName: string,
  avatarUrl?: string
): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const updates: Record<string, any> = {
    display_name: displayName,
  };
  if (avatarUrl !== undefined) {
    updates.avatar_url = avatarUrl;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  if (error) throw error;

  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName,
        avatar_url: avatarUrl || data.user.user_metadata?.avatar_url || '',
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not update profile record:', e);
    }
  }
  return data.user;
}

export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify / environment settings."
    );
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  return data.user;
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables."
    );
  }
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables."
    );
  }
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

export async function logOut(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Supabase sign out error:', error);
}

export async function deleteAccountAndData(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error: resumeErr } = await supabase.from('resumes').delete().eq('user_id', userId);
    if (resumeErr) {
      console.error('Error deleting user resumes from Supabase database:', resumeErr);
    }
    const { error: profileErr } = await supabase.from('profiles').delete().eq('id', userId);
    if (profileErr) {
      console.error('Error deleting user profile from Supabase database:', profileErr);
    }
  } catch (err) {
    console.warn('Could not delete user Supabase records:', err);
  }
  const { error: signOutErr } = await supabase.auth.signOut();
  if (signOutErr) {
    console.error('Error signing out after account deletion:', signOutErr);
  }
}

// Supabase Resume Operations
export async function saveResumeToSupabase(userId: string, resume: ResumeData): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('resumes').upsert({
    id: resume.id,
    user_id: userId,
    title: resume.title,
    target_job_title: resume.targetJobTitle || '',
    resume_data: resume,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error('Supabase save resume error:', error);
  }
}

export async function deleteResumeFromSupabase(userId: string, resumeId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)
    .eq('user_id', userId);
  if (error) {
    console.error('Supabase delete resume error:', error);
  }
}

export async function fetchUserResumesFromSupabase(userId: string): Promise<ResumeData[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('resumes')
    .select('resume_data')
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase fetch resumes error:', error);
    return [];
  }
  if (!data) return [];
  return data.map((item) => item.resume_data as ResumeData).filter(Boolean);
}
