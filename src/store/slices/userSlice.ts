﻿import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PublicProfile, AfroIdentity, UserBadge, RankRegalia } from '@/types/profile.types';
import type { ConnectionGraph, MessageRequest } from '@/types/connection.types';

export interface UserState {
  // ✅ EXISTING: Core user data (keeping all your current fields)
  user: {
    id: string | null;
    phoneNumber: string | null;
    name: string | null;
    full_name: string | null;
    afro_id: string | null;
    role_name: string | null;
    role_id: string | null;
    iwa_score: number | null;
    sankofa_totem: string | null;
    kinship_tier: 'continental_african' | 'african_diaspora' | 'global_partner' | null;
    tribe: string | null;
    country: string | null;
  } | null;
  
  village: {
    villageId: string;
    villageName: string;
  } | null;
  
  role: {
    roleId: string;
    roleName: string;
  } | null;
  
  isLoading: boolean;
  error: string | null;
  
  // 🆕 NEW: 3-Layer Identity System
  afroIdentity: AfroIdentity | null;
  publicProfile: PublicProfile | null;
  
  // 🆕 NEW: Connections & Messaging
  connections: ConnectionGraph[];
  messageRequests: MessageRequest[];
  trustedConnections: string[];      // List of Afro-IDs with trust channel
  
  // 🆕 NEW: Badges & Rank
  badges: UserBadge[];
  rank: RankRegalia | null;
  
  // 🆕 NEW: UI State
  showAfroId: boolean;               // Toggle for revealing Afro-ID
  profileEditMode: boolean;
  
  // 🆕 NEW: Privacy Settings (matches PublicProfile visibility)
  privacySettings: {
    show_heritage: boolean;
    show_clan: boolean;
    show_family_tree: boolean;
    allow_message_requests: boolean;
    allow_booking: boolean;
    allow_tips: boolean;
    profile_public: boolean;
    posts_public: boolean;
    tools_public: boolean;
  };
}

const initialState: UserState = {
  user: null,
  village: null,
  role: null,
  isLoading: false,
  error: null,
  
  // 3-Layer Identity defaults
  afroIdentity: null,
  publicProfile: null,
  connections: [],
  messageRequests: [],
  trustedConnections: [],
  badges: [],
  rank: null,
  showAfroId: false,
  profileEditMode: false,
  
  // Privacy defaults (conservative - protect users by default)
  privacySettings: {
    show_heritage: false,
    show_clan: false,
    show_family_tree: false,
    allow_message_requests: true,
    allow_booking: true,
    allow_tips: true,
    profile_public: true,
    posts_public: true,
    tools_public: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ✅ EXISTING: Keep all your current actions
    setUser: (state, action: PayloadAction<{
      id: string;
      phoneNumber: string;
      name?: string;
      full_name?: string;
      afro_id?: string;
      role_name?: string;
      role_id?: string;
      iwa_score?: number;
      sankofa_totem?: string;
      kinship_tier?: 'continental_african' | 'african_diaspora' | 'global_partner';
      tribe?: string;
      country?: string;
    }>) => {
      state.user = {
        id: action.payload.id,
        phoneNumber: action.payload.phoneNumber,
        name: action.payload.name || null,
        full_name: action.payload.full_name || null,
        afro_id: action.payload.afro_id || null,
        role_name: action.payload.role_name || null,
        role_id: action.payload.role_id || null,
        iwa_score: action.payload.iwa_score || null,
        sankofa_totem: action.payload.sankofa_totem || null,
        kinship_tier: action.payload.kinship_tier || null,
        tribe: action.payload.tribe || null,
        country: action.payload.country || null,
      };
      state.error = null;
    },
    
    setUserVillage: (state, action: PayloadAction<{ villageId: string; villageName: string }>) => {
      state.village = action.payload;
    },
    
    setUserRole: (state, action: PayloadAction<{ roleId: string; roleName: string }>) => {
      state.role = action.payload;
      // Also update user.role_id and user.role_name if user exists
      if (state.user) {
        state.user.role_id = action.payload.roleId;
        state.user.role_name = action.payload.roleName;
      }
    },
    
    updateUserProfile: (state, action: PayloadAction<Partial<{
      name: string;
      full_name: string;
      afro_id: string;
      iwa_score: number;
      sankofa_totem: string;
      kinship_tier: 'continental_african' | 'african_diaspora' | 'global_partner';
      tribe: string;
      country: string;
    }>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearUser: (state) => {
      state.user = null;
      state.village = null;
      state.role = null;
      state.error = null;
      // Also clear new identity fields
      state.afroIdentity = null;
      state.publicProfile = null;
      state.connections = [];
      state.messageRequests = [];
      state.trustedConnections = [];
      state.badges = [];
      state.rank = null;
    },
    
    // 🆕 NEW: Afro-ID & Identity Management
    setAfroIdentity: (state, action: PayloadAction<AfroIdentity>) => {
      state.afroIdentity = action.payload;
      // Sync with legacy user.afro_id
      if (state.user) {
        state.user.afro_id = action.payload.afro_id;
      }
    },
    
    updateAfroIdentity: (state, action: PayloadAction<Partial<AfroIdentity>>) => {
      if (state.afroIdentity) {
        state.afroIdentity = { ...state.afroIdentity, ...action.payload };
      }
    },
    
    // 🆕 NEW: Public Profile Management
    setPublicProfile: (state, action: PayloadAction<PublicProfile>) => {
      state.publicProfile = action.payload;
    },
    
    updatePublicProfile: (state, action: PayloadAction<Partial<PublicProfile>>) => {
      if (state.publicProfile) {
        state.publicProfile = { ...state.publicProfile, ...action.payload };
      }
    },
    
    // 🆕 NEW: Display Name & Handle Management
    updateDisplayName: (state, action: PayloadAction<string>) => {
      if (state.publicProfile) {
        state.publicProfile.display_name = action.payload;
      }
      // Also update legacy user.full_name
      if (state.user) {
        state.user.full_name = action.payload;
      }
    },
    
    updateHandle: (state, action: PayloadAction<string>) => {
      if (state.publicProfile) {
        state.publicProfile.handle = action.payload;
      }
    },
    
    // 🆕 NEW: Connection Management
    addConnection: (state, action: PayloadAction<ConnectionGraph>) => {
      const exists = state.connections.find(c => c.connection_id === action.payload.connection_id);
      if (!exists) {
        state.connections.push(action.payload);
      }
    },
    
    updateConnection: (state, action: PayloadAction<{ connection_id: string; updates: Partial<ConnectionGraph> }>) => {
      const index = state.connections.findIndex(c => c.connection_id === action.payload.connection_id);
      if (index !== -1) {
        state.connections[index] = { 
          ...state.connections[index], 
          ...action.payload.updates,
          updated_at: new Date()
        };
      }
    },
    
    removeConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(c => c.connection_id !== action.payload);
    },
    
    // 🆕 NEW: Message Request Management
    addMessageRequest: (state, action: PayloadAction<MessageRequest>) => {
      const exists = state.messageRequests.find(r => r.request_id === action.payload.request_id);
      if (!exists) {
        state.messageRequests.push(action.payload);
      }
    },
    
    updateMessageRequest: (state, action: PayloadAction<{ 
      request_id: string; 
      status: MessageRequest['status'] 
    }>) => {
      const index = state.messageRequests.findIndex(r => r.request_id === action.payload.request_id);
      if (index !== -1) {
        state.messageRequests[index].status = action.payload.status;
        state.messageRequests[index].responded_at = new Date();
      }
    },
    
    removeMessageRequest: (state, action: PayloadAction<string>) => {
      state.messageRequests = state.messageRequests.filter(r => r.request_id !== action.payload);
    },
    
    clearMessageRequests: (state) => {
      state.messageRequests = [];
    },
    
    // 🆕 NEW: Trusted Connection Management (Afro-ID Level)
    addTrustedConnection: (state, action: PayloadAction<string>) => {
      if (!state.trustedConnections.includes(action.payload)) {
        state.trustedConnections.push(action.payload);
      }
    },
    
    removeTrustedConnection: (state, action: PayloadAction<string>) => {
      state.trustedConnections = state.trustedConnections.filter(id => id !== action.payload);
    },
    
    setTrustedConnections: (state, action: PayloadAction<string[]>) => {
      state.trustedConnections = action.payload;
    },
    
    // 🆕 NEW: Badge & Rank Management
    addBadge: (state, action: PayloadAction<UserBadge>) => {
      const exists = state.badges.find(b => b.id === action.payload.id);
      if (!exists) {
        state.badges.push(action.payload);
      }
    },
    
    removeBadge: (state, action: PayloadAction<string>) => {
      state.badges = state.badges.filter(b => b.id !== action.payload);
    },
    
    setBadges: (state, action: PayloadAction<UserBadge[]>) => {
      state.badges = action.payload;
    },
    
    setRank: (state, action: PayloadAction<RankRegalia>) => {
      state.rank = action.payload;
    },
    
    updateRank: (state, action: PayloadAction<Partial<RankRegalia>>) => {
      if (state.rank) {
        state.rank = { ...state.rank, ...action.payload };
      }
    },
    
    // 🆕 NEW: UI State Management
    toggleAfroIdVisibility: (state) => {
      state.showAfroId = !state.showAfroId;
    },
    
    setAfroIdVisibility: (state, action: PayloadAction<boolean>) => {
      state.showAfroId = action.payload;
    },
    
    setProfileEditMode: (state, action: PayloadAction<boolean>) => {
      state.profileEditMode = action.payload;
    },
    
    // 🆕 NEW: Privacy Settings Management
    updatePrivacySettings: (state, action: PayloadAction<Partial<UserState['privacySettings']>>) => {
      state.privacySettings = { ...state.privacySettings, ...action.payload };
      
      // Sync with publicProfile visibility settings
      if (state.publicProfile) {
        if (action.payload.show_heritage !== undefined) {
          state.publicProfile.show_heritage = action.payload.show_heritage;
        }
        if (action.payload.show_clan !== undefined) {
          state.publicProfile.show_clan = action.payload.show_clan;
        }
        if (action.payload.show_family_tree !== undefined) {
          state.publicProfile.show_family_tree = action.payload.show_family_tree;
        }
        if (action.payload.allow_message_requests !== undefined) {
          state.publicProfile.allow_message_requests = action.payload.allow_message_requests;
        }
        if (action.payload.allow_booking !== undefined) {
          state.publicProfile.allow_booking = action.payload.allow_booking;
        }
        if (action.payload.allow_tips !== undefined) {
          state.publicProfile.allow_tips = action.payload.allow_tips;
        }
      }
    },
    
    setPrivacySettings: (state, action: PayloadAction<UserState['privacySettings']>) => {
      state.privacySettings = action.payload;
    },
  },
});

export const {
  // Existing actions
  setUser,
  setUserVillage,
  setUserRole,
  updateUserProfile,
  setLoading,
  setError,
  clearUser,
  
  // New identity actions
  setAfroIdentity,
  updateAfroIdentity,
  setPublicProfile,
  updatePublicProfile,
  updateDisplayName,
  updateHandle,
  
  // Connection actions
  addConnection,
  updateConnection,
  removeConnection,
  
  // Message request actions
  addMessageRequest,
  updateMessageRequest,
  removeMessageRequest,
  clearMessageRequests,
  
  // Trusted connection actions
  addTrustedConnection,
  removeTrustedConnection,
  setTrustedConnections,
  
  // Badge & rank actions
  addBadge,
  removeBadge,
  setBadges,
  setRank,
  updateRank,
  
  // UI state actions
  toggleAfroIdVisibility,
  setAfroIdVisibility,
  setProfileEditMode,
  
  // Privacy actions
  updatePrivacySettings,
  setPrivacySettings,
} = userSlice.actions;

export default userSlice.reducer;