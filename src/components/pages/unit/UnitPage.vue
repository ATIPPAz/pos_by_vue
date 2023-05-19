<template>
  <div class="container">
    <a href="/">กลับ</a>
    <div class="card-content" style="margin-top: 24px">
      <div class="card-header">ตั้งค่าหน่วยนับ</div>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="createUnitModalOpen">เพิ่ม</button>
      </div>
      <DataTable :data="unitNameData" :header="header">
        <template #action>asdasdsads</template>
      </DataTable>
    </div>
    <Modal :open="open" :title="title" @onClose="open = false">
      <template #body><h3>now! i custom slot name body in dialog</h3></template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Modal from '../../shared/ModalComponent.vue'
import DataTable from '../../shared/TableComponent.vue'
import { getUnit } from '../../../plugins/unitApi'
import type { Unit } from '../../../interface/UnitInterface'
import { onMounted, ref, computed, h } from 'vue'
export default {
  components: { DataTable, Modal },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitData = ref<Unit[]>([])
    const header = ref(['ลำดับ', 'ชื่อ', 'อายุ', 'ดำเนินการ'])
    onMounted(async () => {
      unitData.value = await getUnit()
    })
    const unitNameData = computed(() => {
      return unitData.value.map((e: Unit) => {
        return { unitName: e.unitName, id: e.unitId }
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

<style scoped></style>
