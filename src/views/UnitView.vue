<template>
  <MainPage title="ตั้งค่าหน่วยนับ">
    <template #content>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="createUnitModalOpen">เพิ่ม</button>
      </div>
      <DataTable :data="unitData" :column="header" :option="option">
        <template #action="data"
          ><div>
            <button @click="editUnit(data.data)">edit</button>
            <button @click="deleteUnit(data.data)">delete</button>
          </div></template
        >
      </DataTable>

      <Modal :open="open" :saveFunction="saveFunction" :title="title" @onClose="closeDialog">
        <!-- <template #body>
          ชื่อหน่วย:<br />
          <input type="text" v-model="unitInput" />
        </template> -->
      </Modal>
    </template>
  </MainPage>
</template>

<script lang="ts">
import { onMounted, ref, computed } from 'vue'
import { defineComponent } from 'vue'
import MainPage from '@/components/mainFrame/MainFrame.vue'
import Modal from '@/components/model/ModelDialog.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'
import type { Unit } from '@/interface/unit.interface'
import { useUnitApi } from '@/composables/api/useUnitApi'
export default defineComponent({
  components: { DataTable, Modal, MainPage },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitInput = ref('')
    const unitData = ref<Unit[]>([])
    const idSelect = ref(0)

    const header = ref<IColumn[]>([
      {
        key: 'unitName',
        label: 'ชื่อ'
      }
    ])
    const option = ref<TableOption>({
      actionLabel: 'ดำเนินการ',
      rowNumber: true
    })
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
      const res = (await useUnitApi().getUnit()).data!
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
    function createUnitModalOpen() {
      open.value = true
      title.value = 'เพิ่มสินค้า'
    }
    return {
      createUnitModalOpen,
      unitData,
      header,
      option,
      editUnit,
      saveFunction,
      deleteUnit,
      unitInput,
      title,
      closeDialog,
      open
    }
  }
})
</script>
