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

interface Menu {
  path: string
  label: string
}
export default defineComponent({
  components: {
    Card
  },
  setup() {
    const router = useRouter()
    const menus = ref<Menu[]>([
      { label: 'ตั้งค่าหน่วยนับ', path: '/unit' },
      { label: 'ตั้งค่าไอเทม', path: '/item' },
      { label: 'ดูใบเสร็จรับเงิน', path: '/receipt' },
      { label: 'ออกใบเสร็จรับเงิน', path: '/pos' }
    ])
    function cardClick(menu: Menu) {
      router.push(menu.path)
    }
    return {
      menus,
      cardClick
    }
  }
})
</script>
