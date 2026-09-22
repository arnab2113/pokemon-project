import { useSelector, useDispatch } from 'react-redux';
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  updateProfile as updateProfileAction,
  addAddress as addAddressAction,
  removeAddress as removeAddressAction,
  clearAuthError as clearAuthErrorAction,
} from '../redux/slices/authSlice';
import { ROLES } from '../utils/constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, users, isAuthenticated, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginAction(credentials));
  const register = (userData) => dispatch(registerAction(userData));
  const logout = () => dispatch(logoutAction());
  const updateProfile = (data) => dispatch(updateProfileAction(data));
  const addAddress = (address) => dispatch(addAddressAction(address));
  const removeAddress = (id) => dispatch(removeAddressAction(id));
  const clearError = () => dispatch(clearAuthErrorAction());

  const isAdmin = user?.role === ROLES.ADMIN;

  return {
    user,
    users,
    isAuthenticated,
    isAdmin,
    error,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    clearError,
  };
};
