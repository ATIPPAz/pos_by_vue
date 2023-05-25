<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title>
      <h1>
        <span style="color: purple">ตั้</span>
        <span style="color: blue">ง</span>
        <span style="color: skyblue">ค่</span>
        <span style="color: green">า</span>
        <span style="color: greenyellow">ห</span>
        <span style="color: yellow">น่</span>
        <span style="color: orange">ว</span>
        <span style="color: orangered">ย</span>
        <span style="color: red">นั</span>
        <span style="color: pink">บ</span>
      </h1>
    </template>
    <template #content>
      <div class="j-end" style="margin-bottom: 14px">
        <button id="addButton" class="blue" @click="modelOpen(undefined)">เพิ่ม</button>
      </div>

      <DataTable :data="unitData" :column="header" :option="option">
        <template #cell-unitName="slotProp">{{ slotProp.data.unitName }}</template>
        <template #cell-idRowAction="data">
          <div>
            <button @click="modelOpen(data.data)" class="yellow" style="margin-right: 8px">
              edit
            </button>
            <button @click="deleteUnit(data.data)" class="red">delete</button>
          </div>
        </template>
      </DataTable>

      <Modal :open="open">
        <template #header>
          <span class="close" @click="closeDialog"> &times; </span>
          <p class="modal-title">{{ title }}</p>
        </template>
        <template #body>
          ชื่อหน่วย:<br />
          <input type="text" v-model="unitInput" />
        </template>
        <template #footer>
          <button @click="closeDialog" class="gray" style="margin-right: 8px">close</button>
          <button @click="saveChange" class="blue">save change</button>
        </template>
      </Modal>
    </template>
  </MainFrame>
</template>

<script lang="ts">
import { onMounted, ref, inject, defineComponent } from 'vue'
import { statusCode as status } from '@/interface/api'
import MainFrame from '@/components/mainFrame/MainFrame.vue'
import Modal from '@/components/modal/ModalDialog.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'

import type { Unit } from '@/interface/unit.interface'
import { useUnitApi } from '@/composables/api/useUnitApi'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  components: { DataTable, Modal, MainFrame },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitInput = ref('')
    const unitData = ref<Unit[]>([])
    const idSelect = ref<number>(0)
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const header = ref<IColumn[]>([
      {
        key: 'unitName',
        label: 'ชื่อ',
        style: {
          width: '70%'
        }
      }
    ])
    const option = ref<TableOption>({
      actionLabel: 'ดำเนินการ',
      rowNumber: true
    })
    function modelOpen(data: any = null) {
      if (data) {
        unitInput.value = data.unitName
        idSelect.value = data.unitId ?? -1
        title.value = 'แก้ไขหน่วย'
      } else {
        title.value = 'เพิ่มสินค้า'
      }
      open.value = true
    }
    async function deleteUnit(data: any) {
      loader.setLoadingOn()
      const { statusCode } = await useUnitApi().deleteUnit(data.unitId)
      if (statusCode === status.deleteSuccess) {
        toast.success('สำเร็จ', 'ลบหน่วยนับสำเร็จ')
      } else {
        toast.error('ไม่สำเร็จ', 'ไม่สามารถลบหน่วยนับได้')
      }
      await getUnit()
      loader.setLoadingOff()
    }
    async function saveChange() {
      loader.setLoadingOn()
      let statusCode = 0
      if (title.value === 'เพิ่มสินค้า') {
        statusCode = (await useUnitApi().createUnit({ unitName: unitInput.value })).statusCode
      } else {
        statusCode = (
          await useUnitApi().updateUnit({
            unitId: idSelect.value,
            unitName: unitInput.value
          })
        ).statusCode
      }
      if (status.updateSuccess === statusCode || status.createSuccess === statusCode) {
        toast.success('สำเร็จ', 'ดำเนินการสำเร็จ')
      } else {
        toast.error('ไม่สำเร็จ', 'ไม่สามารถดำเนินการได้')
      }
      open.value = false
      unitInput.value = ''
      await getUnit()
      loader.setLoadingOff()
    }

    function closeDialog() {
      open.value = false
      unitInput.value = ''
    }

    async function getUnit() {
      const res = (await useUnitApi().getUnit()).data!
      unitData.value = res
    }
    onMounted(async () => {
      loader.setLoadingOn()
      await getUnit()
      loader.setLoadingOff()
    })

    return {
      unitData,
      header,
      option,
      modelOpen,
      saveChange,
      deleteUnit,
      unitInput,
      title,
      closeDialog,
      open
    }
  }
})
</script>
