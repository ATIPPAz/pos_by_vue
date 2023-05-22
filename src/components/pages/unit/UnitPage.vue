<template>
  <div class="container">
    <a href="/">กลับ</a>
    <div class="card-content" style="margin-top: 24px">
      <div class="card-header">ตั้งค่าหน่วยนับ</div>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="createUnitModalOpen">เพิ่ม</button>
      </div>
      {{ unitNameData }}
      <DataTable :filterBar="filter" :data="unitNameData" :header="header" :searchBar="true">
        <template #action="data"
          ><div>
            <button @click="editUnit(data.data)">edit</button>
            <button @click="deleteUnit(data.data)">delete</button>
          </div></template
        >
      </DataTable>
    </div>
    <Modal :open="open" :saveFunction="saveFunction" :title="title" @onClose="closeDialog">
      <template #body>
        ชื่อหน่วย:<br />
        <input type="text" v-model="unitInput" />
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Modal from '../../shared/ModalComponent.vue'
import DataTable from '../../shared/TableComponent.vue'
import type { Unit } from '../../../interface/UnitInterface'
import { onMounted, ref, computed, inject } from 'vue'
export default {
  components: { DataTable, Modal },
  setup() {
    const open = ref(false)
    const title = ref('')
    const $api = inject('api')
    const unitInput = ref('')
    const unitData = ref<Unit[]>([])
    const idSelect = ref(0)
    function editUnit(data: Unit) {
      unitInput.value = data.unitName
      idSelect.value = data.id ?? -1
      title.value = 'แก้ไขหน่วย'
      open.value = true
    }
    function deleteUnit(data: Unit) {
      const index = unitData.value.findIndex((e: Unit) => e.unitId === data.id)
      unitData.value.splice(index, 1)
    }
    const header = ref(['ลำดับ', 'ชื่อ', 'ดำเนินการ'])
    function saveFunction() {
      if (title.value === 'เพิ่มสินค้า') {
        saveChange()
      } else {
        updateChange()
      }
    }
    function closeDialog() {
      open.value = false
      unitInput.value = ''
    }
    function saveChange() {
      unitData.value.push({ unitName: unitInput.value, unitId: unitData.value.length })
      open.value = false

      unitInput.value = ''
    }
    function updateChange() {
      const index = unitData.value.findIndex((e: Unit) => e.unitId === idSelect.value)
      unitData.value[index].unitName = unitInput.value
      open.value = false
      unitInput.value = ''
    }
    onMounted(async () => {
      const res = await $api.getUnit()
      if (res.length > 0) {
        unitData.value = res
      } else {
        unitData.value = [
          { unitId: 1, unitName: '9089' },
          { unitId: 3, unitName: 'm,.m,' },
          { unitId: 4, unitName: 'l;wqeqwe' },
          { unitId: 5, unitName: 'hjkhj' },
          { unitId: 1, unitName: 'asd' },
          { unitId: 3, unitName: 'hgjgj' }
        ]
      }
    })
    const filter = ref([
      { name: 'name', key: 'unitName', type: 'input', value: '', placeHolder: 'enter name' }
    ])
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
      editUnit,
      saveFunction,
      deleteUnit,
      filter,
      unitInput,
      title,
      closeDialog,
      open
    }
  }
}
</script>

<style scoped></style>
