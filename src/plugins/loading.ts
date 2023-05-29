import { type Plugin, type InjectionKey, ref, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $loader>
export const loaderPluginSymbol: InjectionKey<PluginInstance> = Symbol('$loader')

function $loader() {
  const loader = ref(false)
  function setLoadingOn() {
    loader.value = true
  }
  function setLoadingOff() {
    loader.value = false
  }
  return {
    loadingState: computed(() => loader.value),
    setLoadingOn,
    setLoadingOff
  }
}

const plugin: Plugin = {
  install: (app, options) => {
    const sample = $loader()
    app.provide(loaderPluginSymbol, sample)
  }
}
export default plugin
