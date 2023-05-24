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

      <Modal :open="open" @onSave="saveFunction" :title="title" @onClose="closeDialog">
        <template #content>
          ชื่อหน่วย:<br />
          <input type="text" v-model="unitInput" />
        </template>
      </Modal>
    </template>
  </MainPage>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { defineComponent } from 'vue'
import { statusCode as status } from '@/interface/api'
import MainPage from '@/components/mainFrame/MainFrame.vue'
import Modal from '@/components/model/ModelDialog.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'
import type { ButtonClick } from '@/interface/dataTable.interface'
import type { Unit } from '@/interface/unit.interface'
import { useUnitApi } from '@/composables/api/useUnitApi'
export default defineComponent({
  components: { DataTable, Modal, MainPage },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitInput = ref('')
    const unitData = ref<Unit[]>([])
    const idSelect = ref<number>(0)

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
    function editUnit(data: ButtonClick) {
      unitInput.value = data.data.unitName
      idSelect.value = data.data.unitId ?? -1
      title.value = 'แก้ไขหน่วย'
      open.value = true
    }
    async function deleteUnit(data: ButtonClick) {
      const { statusCode } = await useUnitApi().deleteUnit(data.data.unitId)
      if (statusCode === status.deleteSuccess) {
        //some toast
      }
      // const index = unitData.value.findIndex((e: Unit) => e.unitId === data.id)
      // unitData.value.splice(index, 1)
      await getUnit()
    }
    async function saveFunction() {
      if (title.value === 'เพิ่มสินค้า') {
        await saveChange()
      } else {
        await updateChange()
      }
      await getUnit()
    }
    function closeDialog() {
      open.value = false
      unitInput.value = ''
    }
    async function saveChange() {
      const { statusCode } = await useUnitApi().createUnit({ unitName: unitInput.value })
      if (statusCode === status.createSuccess) {
        // some toast
      }
      // unitData.value.push({ unitName: unitInput.value, unitId: unitData.value.length })
      open.value = false
      unitInput.value = ''
    }
    async function updateChange() {
      const { statusCode } = await useUnitApi().updateUnit({
        unitId: idSelect.value,
        unitName: unitInput.value
      })
      if (statusCode === status.updateSuccess) {
        // some toast
      }
      // const index = unitData.value.findIndex((e: Unit) => e.unitId === idSelect.value)
      // unitData.value[index].unitName = unitInput.value
      open.value = false
      unitInput.value = ''
    }
    async function getUnit() {
      const res = (await useUnitApi().getUnit()).data!
      unitData.value = res
    }
    onMounted(() => {
      getUnit()
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
