import { type Plugin, type InjectionKey, ref, watch, reactive, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $toast>
export const toastPluginSymbol: InjectionKey<PluginInstance> = Symbol('$toast')
import { setTimeoutAsync } from '@/utils/setTimeoutAsync'
export function $toast() {
  const state = reactive({ color: '', header: '', content: '', openToast: false })
  const toastQueue = reactive<{ header: string; content: string; color: string }[]>([])

  async function open(param = { header: '', content: '', color: '' }) {
    state.color = param.color
    state.header = param.header
    state.content = param.content
    state.openToast = true
    await setTimeoutAsync(2000)
    state.openToast = false
    await setTimeoutAsync(250)
  }

  function success(header = 'สำเร็จ', content = 'ดำเนินการสำเร็จ') {
    addQueue({ header, content, color: 'green' })
  }
  function info(header = 'แจ้งเตือน', content = 'แจ้งเตือน') {
    addQueue({ header, content, color: 'blue' })
  }
  function error(header = 'ไม่สำเร็จ', content = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง') {
    addQueue({ header, content, color: 'red' })
  }
  function warning(header = 'แจ้งเตือน', content = 'มีความผิดปกติ') {
    addQueue({ header, content, color: 'yellow' })
  }
  let running = false

  async function addQueue(param = { header: '', content: '', color: '' }) {
    toastQueue.push(param)
    if (running) {
      return
    }
    while (toastQueue.length > 0) {
      running = true
      const element = toastQueue.shift()
      await open(element)
      running = false
    }
  }
  return {
    toastState: computed(() => state),
    success,
    info,
    error,
    warning
  }
}

const plugin: Plugin = {
  install: (app, options) => {
    const sample = $toast()
    app.provide(toastPluginSymbol, sample)
  }
}
export default plugin
