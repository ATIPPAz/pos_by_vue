<template>
  <div class="d-flex" style="justify-content: space-around">
    <div v-for="(menu, index) in menus" :key="index">
      <Card
        @click="cardClick(menu)"
        style="width: 225px; text-align: center; text-decoration: underline"
      >
        {{ menu.label }}
      </Card>
    </div>
  </div>
</template>
<script lang="ts">
import Card from '@/components/card/CardMenu.vue'
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { toastPluginSymbol } from '@/plugins/toast'
interface Menu {
  routeName: string
  label: string
}
export default defineComponent({
  components: {
    Card
  },
  setup() {
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
    return {
      menus,
      toast,
      cardClick
    }
  }
})
</script>
