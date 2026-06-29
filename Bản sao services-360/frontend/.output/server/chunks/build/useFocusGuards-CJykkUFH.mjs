import { v as vueExports } from './server.mjs';

function useFocusGuards() {
  vueExports.watchEffect((cleanupFn) => {
    return;
  });
}

export { useFocusGuards as u };
//# sourceMappingURL=useFocusGuards-CJykkUFH.mjs.map
