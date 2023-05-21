<template>
  <div class="container">
    <a href="/">กลับ</a>
    <div class="card-content" style="margin-top: 24px">
      <div class="card-header">ตั้งค่าหน่วยนับ</div>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="createUnitModalOpen">เพิ่ม</button>
      </div>
      <DataTable :filterBar="filter" :data="unitNameData" :header="header" :searchBar="true">
        <template #action
          ><div>
            <button>asda</button>
            <button>asdas</button>
          </div></template
        >
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
import { onMounted, ref, computed } from 'vue'
export default {
  components: { DataTable, Modal },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitData = ref<Unit[]>([])
    const header = ref(['ลำดับ', 'ชื่อ', 'อายุ', 'ดำเนินการ'])
    onMounted(async () => {
      const res = await getUnit()

      if (res.length > 0) {
        unitData.value = await getUnit()
      } else {
        unitData.value = [
          { unitId: 1, unitName: 'asdad' },
          { unitId: 3, unitName: 'xcvxx' },
          { unitId: 4, unitName: 'l;xcvxc' },
          { unitId: 5, unitName: 'esdwea' },
          { unitId: 1, unitName: 'xvxc' },
          { unitId: 3, unitName: 'uytu' },
          { unitId: 4, unitName: 'xcvxv;lk' },
          { unitId: 5, unitName: '23' },
          { unitId: 1, unitName: 'xcvxv' },
          { unitId: 3, unitName: '131' },
          { unitId: 4, unitName: 'l;xcvxcv' },
          { unitId: 5, unitName: 'czc' },
          { unitId: 1, unitName: '9089' },
          { unitId: 3, unitName: 'm,.m,' },
          { unitId: 4, unitName: 'l;wqeqwe' },
          { unitId: 5, unitName: 'hjkhj' },
          { unitId: 1, unitName: 'asd' },
          { unitId: 3, unitName: 'hgjgj' },
          { unitId: 4, unitName: 'l;`12``' },
          { unitId: 5, unitName: 'asdasd' },
          { unitId: 1, unitName: 'wrwe' },
          { unitId: 3, unitName: 'sdfsdf' },
          { unitId: 4, unitName: 'l;lk' },
          { unitId: 5, unitName: 'vcxcv' }
        ]
      }
    })
    const filter = ref([
      { name: 'อายุ', key: 'unitId', type: 'input', value: '', placeHolder: 'tet' },
      { name: 'ชื่อ', key: 'unitName', type: 'input', value: '', placeHolder: 'test' }
    ])
    const unitNameData = computed(() => {
      return unitData.value.map((e: Unit) => {
        return { unitName: e.unitName, unitId: e.unitId }
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
      filter,
      title,
      open
    }
  }
}
</script>

<style scoped></style>
