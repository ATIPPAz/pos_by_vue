import { type Plugin, type InjectionKey } from 'vue'
export type PluginInstance = ReturnType<typeof createInstance>
export const samplePluginSymbol: InjectionKey<PluginInstance> = Symbol('test')
// interface Plugin1 {
//   increment(): void
//   getCount(): number
//   test(): void
// }
function createInstance() {
  let count = 0
  return {
    increment() {
      count++
    },
    getCount() {
      return count
    }
  }
}

const plugin: Plugin = {
  install: (app, options) => {
    const sample = createInstance()
    app.provide(samplePluginSymbol, sample)
  }
}
export default plugin
