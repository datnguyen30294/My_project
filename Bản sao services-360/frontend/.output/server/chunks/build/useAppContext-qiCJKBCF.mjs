import { v as vueExports, H as useRuntimeConfig, I as useRequestURL } from './server.mjs';

function useAppContext() {
  const config = useRuntimeConfig();
  const platformDomain = config.public.platformDomain;
  const baseDomain = config.public.baseDomain;
  function getHostname() {
    {
      return useRequestURL().hostname;
    }
  }
  const isPlatformDomain = vueExports.computed(() => getHostname() === platformDomain);
  const isTenantDomain = vueExports.computed(() => {
    const hostname = getHostname();
    if (hostname === platformDomain) return false;
    return hostname.endsWith(`.${baseDomain}`) || hostname !== baseDomain;
  });
  const tenantSubdomain = vueExports.computed(() => {
    const hostname = getHostname();
    if (hostname === platformDomain) return null;
    const suffix = `.${baseDomain}`;
    if (hostname.endsWith(suffix)) {
      return hostname.slice(0, -suffix.length);
    }
    return null;
  });
  return {
    isTenantDomain,
    isPlatformDomain,
    tenantSubdomain
  };
}

export { useAppContext as u };
//# sourceMappingURL=useAppContext-qiCJKBCF.mjs.map
