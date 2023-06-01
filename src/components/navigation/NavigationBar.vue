<template>
  <div class="d-flex" style="justify-content: space-around">
    <div v-for="(menu, index) in menus" :key="index">
      <CardMenu
        @click="cardClick(menu)"
        style="width: 225px; text-align: center; text-decoration: underline"
      >
        {{ menu.label }}
      </CardMenu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CardMenu } from '@/components/card'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { toastPluginSymbol } from '@/plugins/toast'
interface Menu {
  routeName: string
  label: string
}

const router = useRouter()
const toast = inject(toastPluginSymbol)!
const menus = ref<Menu[]>([
  { label: 'ตั้งค่าหน่วยนับ', routeName: 'unit' },
  { label: 'ตั้งค่าไอเทม', routeName: 'item' },
  { label: 'ดูใบเสร็จรับเงิน', routeName: 'receipt' },
  { label: 'ออกใบเสร็จรับเงิน', routeName: 'pos' }
])
// let click = 0
function cardClick(menu: Menu) {
  // if (menu.routeName === 'unit') {
  //   toast.success('สำเร็จ', 'ทดสอบสำเร็จ' + click)
  //   toast.success('สำเร็จ', 'ทดสอบสำเร็จ' + click)
  //   toast.success('สำเร็จ', 'ทดสอบสำเร็จ' + click)
  // } else if (menu.routeName === 'pos') {
  //   toast.error('ไม่สำเร็จ', 'ทดสอบสำเร็จ' + click)
  // } else if (menu.routeName === 'item') {
  //   toast.info('เเจ้งเตือน', 'ทดสอบสำเร็จ' + click)
  // } else {
  //   toast.warning('คำเตือน', 'ทดสอบสำเร็จ' + click)
  // }
  // click += 1
  router.push({ name: menu.routeName })
}
</script>
