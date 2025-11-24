import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Create a singleton Supabase client for the frontend
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey);
  }
  return supabaseClient;
}

// API base URL
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b566cc20`;

// Helper function to make authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  } else {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}

// ==================== AUTH API ====================

export async function signUp(email: string, password: string, name: string, grade: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`, // Use anon key for signup
      },
      body: JSON.stringify({ email, password, name, grade }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Signup error response:", data);
      throw new Error(data.error || `Signup failed with status ${response.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error("Signup request failed:", error);
    throw new Error(error.message || "Signup failed - network error");
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return session;
}

// ==================== PROFILE API ====================

export async function getProfile() {
  return fetchWithAuth("/profile");
}

export async function updateProfile(updates: any) {
  return fetchWithAuth("/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ==================== HOMEWORK API ====================

export async function getHomeworks() {
  return fetchWithAuth("/homeworks");
}

export async function createHomework(homework: any) {
  return fetchWithAuth("/homeworks", {
    method: "POST",
    body: JSON.stringify(homework),
  });
}

export async function updateHomework(id: string, updates: any) {
  return fetchWithAuth(`/homeworks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteHomework(id: string) {
  return fetchWithAuth(`/homeworks/${id}`, {
    method: "DELETE",
  });
}

// Achievements
export async function getAchievements() {
  return fetchWithAuth("/achievements");
}

export async function checkAchievements() {
  return fetchWithAuth("/achievements/check", {
    method: "POST",
  });
}

// ==================== SUBJECTS API ====================

export async function getSubjects() {
  return fetchWithAuth("/subjects");
}

export async function updateSubjects(subjects: any[]) {
  return fetchWithAuth("/subjects", {
    method: "PUT",
    body: JSON.stringify({ subjects }),
  });
}