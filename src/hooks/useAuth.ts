import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTokens, setStep, logout } from '@store/slices/authSlice';
import { clearUser } from '@store/slices/userSlice';
import { storage } from '@utils/storage';
import { authApi } from '@services/api';
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.user.user);

  const login = useCallback(async (otp: string) => {
    try {
      const response = await authApi.verifyLogin({ session_id: 'mock', otp });
      
      dispatch(setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        userId: response.user_id,
      }));

      await storage.setAuthToken(response.access_token);
      await storage.setRefreshToken(response.refresh_token);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      dispatch(clearUser());
      await storage.clearAll();
      navigate('/');
    }
  }, [dispatch, navigate]);

  const checkAuth = useCallback(async () => {
    const token = await storage.getAuthToken();
    return !!token;
  }, []);

  const goToStep = useCallback((step: typeof auth.step) => {
    dispatch(setStep(step));
  }, [dispatch]);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    user,
    currentStep: auth.step,
    login,
    logout: logoutUser,
    checkAuth,
    goToStep,
  };
};