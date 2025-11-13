import { Village, VillageId } from '@/types/village.types';
import holdingVillageConfig from '@/config/villages/getting_started.json';

/**
 * Village Registry Service
 * 
 * This is the single source of truth for all 13 villages.
 * NO HARDCODING in components - always read from this registry.
 */
class VillageRegistryService {
  private villages: Map<VillageId, Village> = new Map();

  constructor() {
    this.loadVillages();
  }

  private loadVillages() {
    // Load Village 0 (Holding Village / The Gate)
    this.villages.set('getting_started', holdingVillageConfig as Village);

    // Villages 1-12 will be loaded here as they are defined
    // Example:
    // this.villages.set('village_1', healersConfig as Village);
    // this.villages.set('village_2', buildersConfig as Village);
    // etc.
  }

  /**
   * Get a village by ID
   */
  getVillage(villageId: VillageId): Village | undefined {
    return this.villages.get(villageId);
  }

  /**
   * Get all public villages (excludes Holding Village)
   */
  getPublicVillages(): Village[] {
    return Array.from(this.villages.values()).filter(v => v.isPublic);
  }

  /**
   * Get all villages selectable during onboarding
   */
  getOnboardingVillages(): Village[] {
    return Array.from(this.villages.values()).filter(v => v.selectableAtOnboarding);
  }

  /**
   * Get the Holding Village (Village 0)
   */
  getHoldingVillage(): Village | undefined {
    return this.villages.get('getting_started');
  }

  /**
   * Search for guilds across all villages
   */
  searchGuilds(query: string): Array<{ village: Village; guild: any }> {
    const results: Array<{ village: Village; guild: any }> = [];
    const lowerQuery = query.toLowerCase();

    this.villages.forEach(village => {
      if (!village.isPublic) return; // Skip Holding Village

      village.guilds.forEach(guild => {
        if (
          guild.guildName.toLowerCase().includes(lowerQuery) ||
          guild.description.toLowerCase().includes(lowerQuery)
        ) {
          results.push({ village, guild });
        }
      });
    });

    return results;
  }

  /**
   * Get tools for a specific guild
   */
  getGuildTools(villageId: VillageId, guildId: string): string[] {
    const village = this.villages.get(villageId);
    if (!village) return [];

    const guild = village.guilds.find(g => g.guildId === guildId);
    if (!guild) return [];

    // Combine village default tools + guild extra tools
    return [...village.defaultTools, ...guild.extraTools];
  }

  /**
   * Get CAWS rules for a village
   */
  getVillageRules(villageId: VillageId): any[] {
    const village = this.villages.get(villageId);
    return village?.cawsRules || [];
  }

  /**
   * Check if a user can switch to a village
   */
  canSwitchToVillage(villageId: VillageId): boolean {
    const village = this.villages.get(villageId);
    return village?.selectableAsHome ?? false;
  }
}

// Export singleton instance
export const villageRegistry = new VillageRegistryService();
export default villageRegistry;