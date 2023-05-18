<script lang="ts">
import Modal from '../../shared/ModalComponent.vue'
import DataTable from '../../shared/TableComponent.vue'
import { getUnit } from '../../../plugins/unitApi'
import type { Unit } from '../../../interface/UnitInterface'
import { onMounted, ref, computed } from 'vue'
export default {
  components: { DataTable, Modal },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitData = ref<Unit[]>([])
    const header = ref(['ชื่อ'])
    onMounted(async () => {
      unitData.value = await getUnit()
    })
    const unitNameData = computed(() => {
      return unitData.value.map((e: Unit) => {
        return { unitName: e.unitName }
      })
    })
    function createUnitModalOpen() {
      open.value = true
      title.value = 'เพิ่มสินค้า'
    }
    return {
      createUnitModalOpen,
      unitNameData,
      unitData,
      header,
      title,
      open
    }
  }
}
</script>

<template>
  <div class="container">
    <a href="/">กลับ</a>
    <div class="card-content" style="margin-top: 24px">
      <div class="card-header">ตั้งค่าหน่วยนับ</div>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="createUnitModalOpen">เพิ่ม</button>
      </div>
      <DataTable :data="unitNameData" :header="header"> </DataTable>
    </div>
    <Modal :open="open" :title="title" @onClose="open = false">
      <template #body><h3>now! i custom slot name body in dialog</h3></template>
    </Modal>
  </div>
</template>
<style scoped></style>
