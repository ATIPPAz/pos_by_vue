<script lang="ts">
import Card from '../../shared/CardComponent.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
interface Manu {
  id: number
  path: string
  label: string
}
export default {
  components: {
    Card
  },
  setup() {
    const router = useRouter()
    const manus = ref<Manu[]>([
      { id: 1, label: 'ตั้งค่าหน่วยนับ', path: '/unit' },
      { id: 1, label: 'ตั้งค่าไอเทม', path: '/item' },
      { id: 1, label: 'ดูใบเสร็จรับเงิน', path: '/receipt' },
      { id: 1, label: 'ออกใบเสร็จรับเงิน', path: '/pos' }
    ])
    function cardClick(manu: Manu) {
      router.push(manu.path)
    }
    return {
      manus,
      cardClick
    }
  }
}
</script>

<template>
  <div class="d-flex" style="justify-content: space-around">
    <div v-for="manu in manus" :key="manu.id">
      <Card
        @onClick="cardClick"
        style="width: 225px; text-align: center; text-decoration: underline"
        :item="manu"
      >
        {{ manu.label }}
      </Card>
    </div>
  </div>
</template>
