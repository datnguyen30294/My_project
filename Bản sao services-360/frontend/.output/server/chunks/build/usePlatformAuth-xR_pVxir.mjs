import { F as useState, v as vueExports, G as apiPlatformMe } from './server.mjs';

const usePlatformAuth = () => {
  const user = useState("platform-auth-user", () => null);
  const token = useState("platform-auth-token", () => null);
  const isAuthenticated = vueExports.computed(() => !!token.value);
  const init = () => {
  };
  const setAuth = (data) => {
    token.value = data.token;
    user.value = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email
    };
  };
  const clearAuth = () => {
    user.value = null;
    token.value = null;
  };
  const fetchUser = async () => {
    try {
      const response = await apiPlatformMe();
      user.value = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      };
    } catch {
      clearAuth();
    }
  };
  return {
    user: vueExports.readonly(user),
    token: vueExports.readonly(token),
    isAuthenticated,
    init,
    setAuth,
    clearAuth,
    fetchUser
  };
};

export { usePlatformAuth as u };
//# sourceMappingURL=usePlatformAuth-xR_pVxir.mjs.map
