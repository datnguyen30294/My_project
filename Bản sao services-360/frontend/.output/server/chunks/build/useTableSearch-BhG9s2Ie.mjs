import { v as vueExports } from './server.mjs';

function useTableSearch(onUpdate, delay = 300) {
  const searchInput = vueExports.ref("");
  let searchTimeout;
  function onSearch(value) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onUpdate(value || void 0);
    }, delay);
  }
  return { searchInput, onSearch };
}

export { useTableSearch as u };
//# sourceMappingURL=useTableSearch-BhG9s2Ie.mjs.map
