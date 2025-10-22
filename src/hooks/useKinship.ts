import { useCallback } from 'react';
import { useAppSelector } from '@store/hooks';
import { roleApi } from '@services/api';

/**
 * Hook for Kinship tier and kinship relations
 */
export const useKinship = () => {
  const user = useAppSelector((state) => state.user.user);

  const getKinshipTier = useCallback(() => {
    return user?.kinship_tier || 'global_partner';
  }, [user]);

  const isContnentalAfrican = useCallback(() => {
    return user?.kinship_tier === 'continental_african';
  }, [user]);

  const isAfricanDiaspora = useCallback(() => {
    return user?.kinship_tier === 'african_diaspora';
  }, [user]);

  const isGlobalPartner = useCallback(() => {
    return user?.kinship_tier === 'global_partner';
  }, [user]);

  const getKinshipBenefits = useCallback(() => {
    const tier = getKinshipTier();
    
    switch (tier) {
      case 'continental_african':
        return {
          wariDiscount: 0, // No fees
          escrowAccess: true,
          dgaRevenue: 100, // 100% KSE revenue
          votingPower: 3,
          prioritySupport: true,
        };
      case 'african_diaspora':
        return {
          wariDiscount: 0.5, // 0.5% fee
          escrowAccess: true,
          dgaRevenue: 90, // 90% KSE revenue
          votingPower: 2,
          prioritySupport: true,
        };
      case 'global_partner':
        return {
          wariDiscount: 1.5, // 1.5% fee
          escrowAccess: false,
          dgaRevenue: 70, // 70% KSE revenue
          votingPower: 1,
          prioritySupport: false,
        };
      default:
        return null;
    }
  }, [getKinshipTier]);

  const upgradeKinship = useCallback(async (newTier: string) => {
    try {
      // In real implementation, call Kinship service
      console.log('Upgrading kinship to:', newTier);
      return true;
    } catch (error) {
      console.error('Failed to upgrade kinship:', error);
      return false;
    }
  }, []);

  const validateKinship = useCallback(async (afroId: string) => {
    try {
      const result = await roleApi.validateAfroId(afroId);
      return result;
    } catch (error) {
      console.error('Failed to validate kinship:', error);
      return null;
    }
  }, []);

  return {
    kinshipTier: getKinshipTier(),
    isContnentalAfrican: isContnentalAfrican(),
    isAfricanDiaspora: isAfricanDiaspora(),
    isGlobalPartner: isGlobalPartner(),
    benefits: getKinshipBenefits(),
    upgradeKinship,
    validateKinship,
  };
};