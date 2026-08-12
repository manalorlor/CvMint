import { supabase, isSupabaseConfigured, deleteAccountAndData, sendPasswordResetLink } from "./supabase";

export interface RegisteredUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  is_restricted: boolean;
  restriction_reason?: string;
  role: "admin" | "user";
}

export const ADMIN_EMAILS = ["manassehlorlor@gmail.com"];

const REGISTRY_STORAGE_KEY = "cvminter_user_registry_v1";

// Default admin seed user so admin always sees self in list
const ADMIN_SEED_USER: RegisteredUser = {
  id: "admin-master-001",
  email: "manassehlorlor@gmail.com",
  display_name: "System Administrator",
  avatar_url: "",
  created_at: new Date(2026, 0, 1).toISOString(),
  updated_at: new Date().toISOString(),
  is_restricted: false,
  role: "admin",
};

/**
 * Reads local storage user registry
 */
function getLocalRegistry(): RegisteredUser[] {
  if (typeof window === "undefined") return [ADMIN_SEED_USER];
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify([ADMIN_SEED_USER]));
      return [ADMIN_SEED_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [ADMIN_SEED_USER];
    return parsed;
  } catch (e) {
    console.warn("Failed to parse local user registry:", e);
    return [ADMIN_SEED_USER];
  }
}

/**
 * Saves updated local user registry
 */
function saveLocalRegistry(users: RegisteredUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Failed to save local user registry:", e);
  }
}

/**
 * Synchronizes/upserts a user into the local and Supabase registry whenever they sign up or log in
 */
export async function trackUserInRegistry(user: {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}): Promise<void> {
  if (!user || !user.email) return;

  const emailLower = user.email.toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(emailLower);
  const nowStr = new Date().toISOString();

  const displayName =
    user.display_name ||
    user.email.split("@")[0] ||
    (isAdmin ? "System Administrator" : "User");

  // 1. Sync local storage registry
  const currentLocal = getLocalRegistry();
  const existingIdx = currentLocal.findIndex(
    (u) => u.id === user.id || u.email.toLowerCase() === emailLower
  );

  if (existingIdx >= 0) {
    currentLocal[existingIdx] = {
      ...currentLocal[existingIdx],
      id: user.id || currentLocal[existingIdx].id,
      email: user.email,
      display_name: displayName || currentLocal[existingIdx].display_name,
      avatar_url: user.avatar_url || currentLocal[existingIdx].avatar_url || "",
      updated_at: nowStr,
      last_sign_in_at: nowStr,
      role: isAdmin ? "admin" : "user",
    };
  } else {
    currentLocal.push({
      id: user.id,
      email: user.email,
      display_name: displayName,
      avatar_url: user.avatar_url || "",
      created_at: nowStr,
      updated_at: nowStr,
      last_sign_in_at: nowStr,
      is_restricted: false,
      role: isAdmin ? "admin" : "user",
    });
  }

  saveLocalRegistry(currentLocal);

  // 2. Sync Supabase profiles table if available
  if (isSupabaseConfigured) {
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        display_name: displayName,
        avatar_url: user.avatar_url || "",
        updated_at: nowStr,
      });
    } catch (e) {
      console.warn("Could not upsert profile record in Supabase:", e);
    }
  }
}

/**
 * Fetches all registered users for the Admin panel.
 * Combines records from Supabase 'profiles' table and local registry for 100% completeness.
 */
export async function fetchAllRegisteredUsers(): Promise<RegisteredUser[]> {
  const usersMap = new Map<string, RegisteredUser>();

  // Load seed / local storage users
  const localUsers = getLocalRegistry();
  for (const u of localUsers) {
    const key = u.email.toLowerCase();
    usersMap.set(key, {
      ...u,
      role: ADMIN_EMAILS.includes(key) ? "admin" : "user",
    });
  }

  // Fetch Supabase profiles table
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error && Array.isArray(data)) {
        for (const item of data) {
          if (!item.email) continue;
          const key = item.email.toLowerCase();
          const existing = usersMap.get(key);

          usersMap.set(key, {
            id: item.id || existing?.id || `usr_${Math.random().toString(36).slice(2, 9)}`,
            email: item.email,
            display_name:
              item.display_name ||
              item.full_name ||
              existing?.display_name ||
              item.email.split("@")[0],
            avatar_url: item.avatar_url || existing?.avatar_url || "",
            created_at: item.created_at || existing?.created_at || new Date().toISOString(),
            updated_at: item.updated_at || existing?.updated_at || new Date().toISOString(),
            last_sign_in_at: existing?.last_sign_in_at || new Date().toISOString(),
            is_restricted: Boolean(item.is_restricted || existing?.is_restricted),
            restriction_reason: item.restriction_reason || existing?.restriction_reason || "",
            role: ADMIN_EMAILS.includes(key) ? "admin" : "user",
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch profiles from Supabase:", e);
    }

    // Check resumes table for any user IDs created prior to profiles table tracking
    try {
      const { data: resumeRows } = await supabase.from("resumes").select("user_id, updated_at");
      if (Array.isArray(resumeRows)) {
        for (const row of resumeRows) {
          if (!row.user_id) continue;
          const alreadyMatched = Array.from(usersMap.values()).some((u) => u.id === row.user_id);
          if (!alreadyMatched) {
            const tempKey = `legacy_${row.user_id}`;
            usersMap.set(tempKey, {
              id: row.user_id,
              email: `user_${row.user_id.slice(0, 8)}@supabase.user`,
              display_name: `Registered User (${row.user_id.slice(0, 6)})`,
              avatar_url: "",
              created_at: row.updated_at || new Date().toISOString(),
              updated_at: row.updated_at || new Date().toISOString(),
              is_restricted: false,
              role: "user",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch legacy resumes for user tracking:", e);
    }
  }

  const result = Array.from(usersMap.values());
  // Sort admin first, then by created_at descending
  result.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return result;
}

/**
 * Checks if a user is currently restricted
 */
export async function checkIsUserRestricted(userId: string, email: string): Promise<{ isRestricted: boolean; reason?: string }> {
  if (!email) return { isRestricted: false };
  const emailLower = email.toLowerCase();

  // Admins can never be restricted
  if (ADMIN_EMAILS.includes(emailLower)) {
    return { isRestricted: false };
  }

  // Check local registry first
  const localUsers = getLocalRegistry();
  const matchedLocal = localUsers.find(
    (u) => u.id === userId || u.email.toLowerCase() === emailLower
  );

  if (matchedLocal?.is_restricted) {
    return {
      isRestricted: true,
      reason: matchedLocal.restriction_reason || "Account restricted by administrator.",
    };
  }

  // Check Supabase profiles table
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("is_restricted, restriction_reason")
        .or(`id.eq.${userId},email.eq.${emailLower}`)
        .single();

      if (data && data.is_restricted) {
        return {
          isRestricted: true,
          reason: data.restriction_reason || "Account restricted by administrator.",
        };
      }
    } catch (e) {
      // ignore table read errors if column doesn't exist yet
    }
  }

  return { isRestricted: false };
}

/**
 * Toggles restriction status for a user
 */
export async function adminSetUserRestriction(
  userId: string,
  email: string,
  isRestricted: boolean,
  reason: string = ""
): Promise<void> {
  const emailLower = email.toLowerCase();
  if (ADMIN_EMAILS.includes(emailLower)) {
    throw new Error("Cannot restrict a System Administrator account.");
  }

  // Update local registry
  const localUsers = getLocalRegistry();
  const idx = localUsers.findIndex(
    (u) => u.id === userId || u.email.toLowerCase() === emailLower
  );

  if (idx >= 0) {
    localUsers[idx].is_restricted = isRestricted;
    localUsers[idx].restriction_reason = isRestricted ? reason : "";
    localUsers[idx].updated_at = new Date().toISOString();
    saveLocalRegistry(localUsers);
  }

  // Update Supabase profiles table if configured
  if (isSupabaseConfigured) {
    try {
      await supabase.from("profiles").upsert({
        id: userId,
        email: emailLower,
        is_restricted: isRestricted,
        restriction_reason: isRestricted ? reason : "",
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Could not update restriction status in Supabase:", e);
    }
  }
}

/**
 * Deletes a user account and wipes their stored database resumes
 */
export async function adminDeleteUserAccount(userId: string, email: string): Promise<void> {
  const emailLower = email.toLowerCase();
  if (ADMIN_EMAILS.includes(emailLower)) {
    throw new Error("Cannot delete a System Administrator account.");
  }

  // Remove from local registry
  const localUsers = getLocalRegistry();
  const filtered = localUsers.filter(
    (u) => u.id !== userId && u.email.toLowerCase() !== emailLower
  );
  saveLocalRegistry(filtered);

  // Wipe records from Supabase
  if (isSupabaseConfigured) {
    try {
      await deleteAccountAndData(userId);
    } catch (e) {
      console.warn("Could not wipe user records from Supabase:", e);
    }
  }
}

/**
 * Admin triggers password reset link email for user
 */
export async function adminResetUserPassword(email: string): Promise<void> {
  if (!email) throw new Error("Email address is required.");
  await sendPasswordResetLink(email);
}
