import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Missing Supabase environment variables!');
  console.error('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'SET' : 'MISSING');
}

const supabase = createClient(
  supabaseUrl ?? '',
  supabaseKey ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify user authentication
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'Unauthorized: No token provided', userId: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Unauthorized: Invalid token', userId: null };
  }
  
  return { error: null, userId: user.id };
}

// Health check endpoint
app.get("/make-server-b566cc20/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up endpoint
app.post("/make-server-b566cc20/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Signup request received:', { email: body.email, name: body.name, grade: body.grade });
    
    const { email, password, name, grade } = body;
    
    if (!email || !password || !name) {
      console.error('Signup validation failed: missing required fields');
      return c.json({ error: "Email, password, and name are required" }, 400);
    }
    
    // Create user with Supabase Auth
    console.log('Creating user with Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, grade },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (authError) {
      console.error('Auth error during signup:', authError);
      return c.json({ error: `Failed to create user: ${authError.message}` }, 400);
    }
    
    console.log('User created successfully:', authData.user.id);
    
    // Initialize user profile in KV store
    console.log('Saving user profile to KV store...');
    await kv.set(`profile:${authData.user.id}`, {
      name,
      grade,
      subjects: [],
      email,
      createdAt: new Date().toISOString(),
    });
    
    console.log('Signup completed successfully');
    return c.json({ 
      success: true, 
      user: authData.user,
      message: "Account created successfully" 
    });
  } catch (error: any) {
    console.error('Unexpected error in signup:', error);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// ==================== PROFILE ROUTES ====================

// Get user profile
app.get("/make-server-b566cc20/profile", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const profile = await kv.get(`profile:${userId}`);
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    return c.json({ profile });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return c.json({ error: `Failed to fetch profile: ${error?.message || error}` }, 500);
  }
});

// Update user profile
app.put("/make-server-b566cc20/profile", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`profile:${userId}`) || {};
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`profile:${userId}`, updatedProfile);
    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: `Failed to update profile: ${error.message}` }, 500);
  }
});

// ==================== HOMEWORK ROUTES ====================

// Get all homeworks for a user
app.get("/make-server-b566cc20/homeworks", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const homeworks = await kv.getByPrefix(`homework:${userId}:`);
    return c.json({ homeworks: homeworks || [] });
  } catch (error) {
    console.error('Error fetching homeworks:', error);
    return c.json({ error: `Failed to fetch homeworks: ${error.message}` }, 500);
  }
});

// Create a new homework
app.post("/make-server-b566cc20/homeworks", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const homework = await c.req.json();
    const homeworkId = Date.now().toString();
    const homeworkData = {
      id: homeworkId,
      ...homework,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`homework:${userId}:${homeworkId}`, homeworkData);
    
    // Log activity
    await logActivity(userId, `Added homework: ${homework.title} - ${homework.subject}`, "homework");
    
    return c.json({ success: true, homework: homeworkData });
  } catch (error) {
    console.error('Error creating homework:', error);
    return c.json({ error: `Failed to create homework: ${error.message}` }, 500);
  }
});

// Update a homework
app.put("/make-server-b566cc20/homeworks/:id", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const homeworkId = c.req.param('id');
    const updates = await c.req.json();
    const key = `homework:${userId}:${homeworkId}`;
    
    const currentHomework = await kv.get(key);
    if (!currentHomework) {
      return c.json({ error: "Homework not found" }, 404);
    }
    
    // Add completion timestamp if marking as complete
    if (updates.completed === true && !currentHomework.completed) {
      updates.completedAt = new Date().toISOString();
    }
    
    const updatedHomework = {
      ...currentHomework,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(key, updatedHomework);
    
    // Check for achievement unlocks when homework is completed
    let achievementResult = { newlyUnlocked: [] };
    if (updates.completed === true) {
      achievementResult = await checkAchievements(userId);
      
      // Log activity for completion
      let completionType = "on time";
      try {
        // Parse DD/MM/YYYY format
        const [day, month, year] = updatedHomework.dueDate.split('/').map(Number);
        const dueDate = new Date(year, month - 1, day);
        const completedAt = new Date(updatedHomework.completedAt);
        
        if (completedAt < dueDate) {
          completionType = "early";
        } else if (completedAt.toDateString() === dueDate.toDateString()) {
          completionType = "on time";
        } else {
          completionType = "late";
        }
      } catch (e) {
        console.error("Error parsing dates for completion type:", e);
      }
      
      await logActivity(userId, `Completed homework ${completionType}: ${updatedHomework.title}`, "homework");
    }
    
    return c.json({ 
      success: true, 
      homework: updatedHomework,
      achievementsUnlocked: achievementResult.newlyUnlocked 
    });
  } catch (error) {
    console.error('Error updating homework:', error);
    return c.json({ error: `Failed to update homework: ${error.message}` }, 500);
  }
});

// Delete a homework
app.delete("/make-server-b566cc20/homeworks/:id", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const homeworkId = c.req.param('id');
    await kv.del(`homework:${userId}:${homeworkId}`);
    return c.json({ success: true, message: "Homework deleted" });
  } catch (error) {
    console.error('Error deleting homework:', error);
    return c.json({ error: `Failed to delete homework: ${error.message}` }, 500);
  }
});

// ==================== SUBJECTS ROUTES ====================

// Get all subjects for a user
app.get("/make-server-b566cc20/subjects", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const profile = await kv.get(`profile:${userId}`);
    return c.json({ subjects: profile?.subjects || [] });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return c.json({ error: `Failed to fetch subjects: ${error.message}` }, 500);
  }
});

// Update subjects
app.put("/make-server-b566cc20/subjects", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const { subjects } = await c.req.json();
    const profile = await kv.get(`profile:${userId}`) || {};
    
    const updatedProfile = {
      ...profile,
      subjects,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`profile:${userId}`, updatedProfile);
    return c.json({ success: true, subjects });
  } catch (error) {
    console.error('Error updating subjects:', error);
    return c.json({ error: `Failed to update subjects: ${error.message}` }, 500);
  }
});

// ==================== ACTIVITY LOG ROUTES ====================

// Helper function to log activity
async function logActivity(userId: string, action: string, type: string) {
  const activityId = Date.now().toString();
  const activity = {
    id: activityId,
    userId,
    action,
    type,
    timestamp: new Date().toISOString(),
  };
  
  await kv.set(`activity:${userId}:${activityId}`, activity);
}

// Get recent activity for a user
app.get("/make-server-b566cc20/activities", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const activities = await kv.getByPrefix(`activity:${userId}:`);
    
    // Sort by timestamp (newest first)
    const sortedActivities = (activities || []).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    // Return only the last 50 activities
    return c.json({ activities: sortedActivities.slice(0, 50) });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return c.json({ error: `Failed to fetch activities: ${error.message}` }, 500);
  }
});

// Create activity log entry
app.post("/make-server-b566cc20/activities", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const { action, type } = await c.req.json();
    await logActivity(userId, action, type);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error creating activity log:', error);
    return c.json({ error: `Failed to log activity: ${error.message}` }, 500);
  }
});

// ==================== ACHIEVEMENT SYSTEM ====================

// Define all available achievements
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete 10 assignments before deadline",
    icon: "Award",
    category: "completion",
    requirement: { type: "early_completion", count: 10 },
  },
  {
    id: "consistency_king",
    title: "Consistency King",
    description: "7-day homework completion streak",
    icon: "Flame",
    category: "streak",
    requirement: { type: "streak", days: 7 },
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Complete 5 assignments on time",
    icon: "Trophy",
    category: "milestone",
    requirement: { type: "on_time_completion", count: 5 },
  },
  {
    id: "time_master",
    title: "Time Master",
    description: "Complete 20 assignments on time",
    icon: "Clock",
    category: "efficiency",
    requirement: { type: "on_time_completion", count: 20 },
  },
  {
    id: "overachiever",
    title: "Overachiever",
    description: "Submit 10 assignments early (3+ days before deadline)",
    icon: "TrendingUp",
    category: "efficiency",
    requirement: { type: "super_early_completion", count: 10, daysBefore: 3 },
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 50 assignments total",
    icon: "GraduationCap",
    category: "milestone",
    requirement: { type: "total_completion", count: 50 },
  },
  {
    id: "deadline_destroyer",
    title: "Deadline Destroyer",
    description: "Complete 30 assignments before deadline",
    icon: "Target",
    category: "completion",
    requirement: { type: "early_completion", count: 30 },
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Complete all homework for a week",
    icon: "Calendar",
    category: "streak",
    requirement: { type: "week_complete", count: 1 },
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete 5 assignments within 1 day of receiving them",
    icon: "Zap",
    category: "efficiency",
    requirement: { type: "quick_completion", count: 5, hoursAfter: 24 },
  },
  {
    id: "comeback_kid",
    title: "Comeback Kid",
    description: "Complete 15 assignments after having overdue ones",
    icon: "RotateCcw",
    category: "completion",
    requirement: { type: "recovery_completion", count: 15 },
  },
];

// Helper function to check and unlock achievements
async function checkAchievements(userId: string) {
  try {
    // Get user profile
    const profile = await kv.get(`profile:${userId}`) || {};
    const unlockedAchievements = profile.achievements || [];
    
    // Get all user's homeworks
    const homeworks = await kv.getByPrefix(`homework:${userId}:`);
    
    // Calculate statistics
    const completedHomeworks = homeworks.filter((hw: any) => hw.completed === true);
    const totalCompleted = completedHomeworks.length;
    
    // Count early completions (completed before due date)
    const earlyCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return completedDate < dueDate;
    }).length;
    
    // Count super early completions (3+ days before deadline)
    const superEarlyCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      const daysDiff = (dueDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff >= 3;
    }).length;
    
    // Count on-time completions (before or on due date)
    const onTimeCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return completedDate <= dueDate;
    }).length;
    
    // Count quick completions (within 24 hours of creation)
    const quickCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.createdAt) return false;
      const completedDate = new Date(hw.completedAt);
      const createdDate = new Date(hw.createdAt);
      const hoursDiff = (completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }).length;
    
    // Calculate current streak
    const sortedCompletedHomeworks = completedHomeworks
      .filter((hw: any) => hw.completedAt)
      .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    let currentStreak = 0;
    let lastCompletionDate: Date | null = null;
    
    for (const hw of sortedCompletedHomeworks) {
      const completionDate = new Date(hw.completedAt);
      completionDate.setHours(0, 0, 0, 0);
      
      if (!lastCompletionDate) {
        currentStreak = 1;
        lastCompletionDate = completionDate;
      } else {
        const daysDiff = (lastCompletionDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          currentStreak++;
          lastCompletionDate = completionDate;
        } else if (daysDiff > 1) {
          break;
        }
      }
    }
    
    // Check each achievement
    const newlyUnlocked = [];
    
    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      const isAlreadyUnlocked = unlockedAchievements.some((a: any) => a.id === achievement.id);
      
      if (isAlreadyUnlocked) continue;
      
      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case "early_completion":
          shouldUnlock = earlyCompletions >= achievement.requirement.count;
          break;
        case "on_time_completion":
          shouldUnlock = onTimeCompletions >= achievement.requirement.count;
          break;
        case "super_early_completion":
          shouldUnlock = superEarlyCompletions >= achievement.requirement.count;
          break;
        case "total_completion":
          shouldUnlock = totalCompleted >= achievement.requirement.count;
          break;
        case "streak":
          shouldUnlock = currentStreak >= achievement.requirement.days;
          break;
        case "quick_completion":
          shouldUnlock = quickCompletions >= achievement.requirement.count;
          break;
        default:
          shouldUnlock = false;
      }
      
      if (shouldUnlock) {
        newlyUnlocked.push({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlockedAt: new Date().toISOString(),
        });
      }
    }
    
    // Update profile with newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...unlockedAchievements, ...newlyUnlocked];
      const updatedProfile = {
        ...profile,
        achievements: updatedAchievements,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`profile:${userId}`, updatedProfile);
      
      // Log activity for each unlocked achievement
      for (const achievement of newlyUnlocked) {
        await logActivity(userId, `Unlocked achievement: ${achievement.title}`, "account");
      }
    }
    
    return { newlyUnlocked };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { newlyUnlocked: [] };
  }
}

// ==================== ACHIEVEMENT ROUTES ====================

// Get all achievements (definitions + user's unlocked status)
app.get("/make-server-b566cc20/achievements", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const profile = await kv.get(`profile:${userId}`) || {};
    const unlockedAchievements = profile.achievements || [];
    
    // Get all user's homeworks to calculate progress
    const homeworks = await kv.getByPrefix(`homework:${userId}:`);
    const completedHomeworks = homeworks.filter((hw: any) => hw.completed === true);
    
    // Calculate statistics for progress
    const totalCompleted = completedHomeworks.length;
    
    const earlyCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return completedDate < dueDate;
    }).length;
    
    const superEarlyCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      const daysDiff = (dueDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff >= 3;
    }).length;
    
    const onTimeCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.dueDate) return false;
      const completedDate = new Date(hw.completedAt);
      const [day, month, year] = hw.dueDate.split('/').map(Number);
      const dueDate = new Date(year, month - 1, day);
      return completedDate <= dueDate;
    }).length;
    
    const quickCompletions = completedHomeworks.filter((hw: any) => {
      if (!hw.completedAt || !hw.createdAt) return false;
      const completedDate = new Date(hw.completedAt);
      const createdDate = new Date(hw.createdAt);
      const hoursDiff = (completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }).length;
    
    // Calculate current streak
    const sortedCompletedHomeworks = completedHomeworks
      .filter((hw: any) => hw.completedAt)
      .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    let currentStreak = 0;
    let lastCompletionDate: Date | null = null;
    
    for (const hw of sortedCompletedHomeworks) {
      const completionDate = new Date(hw.completedAt);
      completionDate.setHours(0, 0, 0, 0);
      
      if (!lastCompletionDate) {
        currentStreak = 1;
        lastCompletionDate = completionDate;
      } else {
        const daysDiff = (lastCompletionDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          currentStreak++;
          lastCompletionDate = completionDate;
        } else if (daysDiff > 1) {
          break;
        }
      }
    }
    
    // Map all achievement definitions with unlock status and progress
    const achievements = ACHIEVEMENT_DEFINITIONS.map(def => {
      const unlockedData = unlockedAchievements.find((a: any) => a.id === def.id);
      
      // Calculate progress based on requirement type
      let progress = 0;
      let total = 0;
      
      switch (def.requirement.type) {
        case "early_completion":
          progress = earlyCompletions;
          total = def.requirement.count;
          break;
        case "on_time_completion":
          progress = onTimeCompletions;
          total = def.requirement.count;
          break;
        case "super_early_completion":
          progress = superEarlyCompletions;
          total = def.requirement.count;
          break;
        case "total_completion":
          progress = totalCompleted;
          total = def.requirement.count;
          break;
        case "streak":
          progress = currentStreak;
          total = def.requirement.days;
          break;
        case "quick_completion":
          progress = quickCompletions;
          total = def.requirement.count;
          break;
        default:
          progress = 0;
          total = 1;
      }
      
      return {
        ...def,
        unlocked: !!unlockedData,
        date: unlockedData?.unlockedAt ? new Date(unlockedData.unlockedAt).toISOString().split('T')[0] : undefined,
        progress: Math.min(progress, total), // Cap at total
        total,
      };
    });
    
    return c.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return c.json({ error: `Failed to fetch achievements: ${error.message}` }, 500);
  }
});

// Manually trigger achievement check
app.post("/make-server-b566cc20/achievements/check", async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const result = await checkAchievements(userId);
    return c.json({ 
      success: true,
      newlyUnlocked: result.newlyUnlocked 
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return c.json({ error: `Failed to check achievements: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
