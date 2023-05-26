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
  <Card ref="z" @click="ttt" style="width: 225px; text-align: center; text-decoration: underline">
    tets
  </Card>
</template>
<script lang="ts">
import Card from '@/components/card/CardMenu.vue'
import { ref, defineComponent, getCurrentInstance } from 'vue'
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
    // const s = getCurrentInstance()
    const z = ref<any>(null)
    console.log(z.value)

    function ttt() {
      const text = prompt('sometext')
      console.log(z.value)

      z.value.setU(text)
    }
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
      cardClick,
      z,
      ttt
    }
  }
})
</script>
