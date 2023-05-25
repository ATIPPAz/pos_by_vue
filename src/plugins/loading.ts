import { type Plugin, type InjectionKey } from 'vue'
export type PluginInstance = ReturnType<typeof $loader>
export const loaderPluginSymbol: InjectionKey<PluginInstance> = Symbol('$loader')

function $loader() {
  const page = document.getElementsByTagName('body')[0]
  const loader = document.createElement('div')
  loader.id = 'loading'
  const bodyElement = document.getElementById('app')!
  loader.classList.add('loader', 'd-none')
  page.appendChild(loader)

  function setLoadingOn() {
    bodyElement.classList.replace('d-block', 'd-none')
    loader.classList.replace('d-none', 'd-flex')
  }
  function setLoadingOff() {
    bodyElement.classList.replace('d-none', 'd-block')
    loader.classList.replace('d-flex', 'd-none')
  }

  return {
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
