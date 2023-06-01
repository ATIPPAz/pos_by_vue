import { type Plugin, type InjectionKey, ref, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $loader>
export const loaderPluginSymbol: InjectionKey<PluginInstance> = Symbol('$loader')

function $loader() {
  const loader = ref(false)
  const loaderQueue: string[] = []
  function setLoadingOn(id: string) {
    loaderQueue.push(id)
    if (loaderQueue.length === 1) {
      loader.value = true
    }
  }
  function setLoadingOff(id: string) {
    if (loaderQueue.length > 0) {
      const index = loaderQueue.findIndex((e) => e === id)
      loaderQueue.splice(index, 1)
    }
    if (loaderQueue.length === 0 && loader.value) {
      loader.value = false
    }
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
