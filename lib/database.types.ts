export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hunters: {
        Row: {
          id: string
          username: string
          level: number
          current_xp: number
          total_xp: number
          rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'
          current_streak: number
          longest_streak: number
          hunter_class: 'Warrior' | 'Assassin' | 'Mage' | 'Shadow Monarch' | null
          penalty_mode: boolean
          created_at: string
          last_active: string
        }
        Insert: {
          id: string
          username: string
          level?: number
          current_xp?: number
          total_xp?: number
          rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'
          current_streak?: number
          longest_streak?: number
          hunter_class?: 'Warrior' | 'Assassin' | 'Mage' | 'Shadow Monarch' | null
          penalty_mode?: boolean
          created_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          username?: string
          level?: number
          current_xp?: number
          total_xp?: number
          rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'
          current_streak?: number
          longest_streak?: number
          hunter_class?: 'Warrior' | 'Assassin' | 'Mage' | 'Shadow Monarch' | null
          penalty_mode?: boolean
          created_at?: string
          last_active?: string
        }
      }
      hunter_stats: {
        Row: {
          id: string
          hunter_id: string
          strength: number
          intelligence: number
          willpower: number
          discipline: number
          endurance: number
        }
        Insert: {
          id?: string
          hunter_id: string
          strength?: number
          intelligence?: number
          willpower?: number
          discipline?: number
          endurance?: number
        }
        Update: {
          id?: string
          hunter_id?: string
          strength?: number
          intelligence?: number
          willpower?: number
          discipline?: number
          endurance?: number
        }
      }
      hunter_goals: {
        Row: {
          id: string
          hunter_id: string
          primary_goal: string
          skillset: string[]
          daily_availability: number
          weaknesses: string[]
          long_term_mission: string | null
        }
        Insert: {
          id?: string
          hunter_id: string
          primary_goal: string
          skillset?: string[]
          daily_availability?: number
          weaknesses?: string[]
          long_term_mission?: string | null
        }
        Update: {
          id?: string
          hunter_id?: string
          primary_goal?: string
          skillset?: string[]
          daily_availability?: number
          weaknesses?: string[]
          long_term_mission?: string | null
        }
      }
      titles: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          unlock_requirement: Json
          image_path: string | null
          rarity: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          unlock_requirement?: Json
          image_path?: string | null
          rarity?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          unlock_requirement?: Json
          image_path?: string | null
          rarity?: string
        }
      }
      hunter_titles: {
        Row: {
          id: string
          hunter_id: string
          title_id: string
          unlocked_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          hunter_id: string
          title_id: string
          unlocked_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          hunter_id?: string
          title_id?: string
          unlocked_at?: string
          is_active?: boolean
        }
      }
      quests: {
        Row: {
          id: string
          hunter_id: string
          quest_type: 'Daily' | 'Boss' | 'Raid' | 'Optional'
          category: 'Business' | 'Skill' | 'Physical' | 'Mind'
          title: string
          description: string | null
          xp_reward: number
          difficulty: number
          status: 'Active' | 'Completed' | 'Failed' | 'Expired'
          due_date: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          hunter_id: string
          quest_type: 'Daily' | 'Boss' | 'Raid' | 'Optional'
          category: 'Business' | 'Skill' | 'Physical' | 'Mind'
          title: string
          description?: string | null
          xp_reward?: number
          difficulty?: number
          status?: 'Active' | 'Completed' | 'Failed' | 'Expired'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          hunter_id?: string
          quest_type?: 'Daily' | 'Boss' | 'Raid' | 'Optional'
          category?: 'Business' | 'Skill' | 'Physical' | 'Mind'
          title?: string
          description?: string | null
          xp_reward?: number
          difficulty?: number
          status?: 'Active' | 'Completed' | 'Failed' | 'Expired'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      level_milestones: {
        Row: {
          level: number
          xp_required: number
          rank_unlock: string | null
          image_path: string | null
        }
      }
      rank_data: {
        Row: {
          rank: string
          min_level: number
          image_path: string | null
          description: string | null
        }
      }
      ascension_log: {
        Row: {
          id: string
          hunter_id: string
          event_type: 'Level' | 'Rank' | 'Title'
          from_value: string | null
          to_value: string
          timestamp: string
          image_shown: string | null
        }
        Insert: {
          id?: string
          hunter_id: string
          event_type: 'Level' | 'Rank' | 'Title'
          from_value?: string | null
          to_value: string
          timestamp?: string
          image_shown?: string | null
        }
        Update: {
          id?: string
          hunter_id?: string
          event_type?: 'Level' | 'Rank' | 'Title'
          from_value?: string | null
          to_value?: string
          timestamp?: string
          image_shown?: string | null
        }
      }
    }
  }
}
