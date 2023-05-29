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
        <button id="addButton" class="blue" @click="modalOpen(undefined)">เพิ่ม</button>
      </div>

      <DataTable :data="unitData" :column="columnsData" :option="option">
        <template #cell-unitName="slotProp">{{ slotProp.data.unitName }}</template>
        <template #cell-idRowAction="data">
          <div>
            <button @click="modalOpen(data.data)" class="yellow" style="margin-right: 8px">
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
          <input type="text" v-model="unitForm.unitName" />
        </template>
        <template #footer>
          <button @click="closeDialog" class="gray" style="margin-right: 8px">close</button>
          <button @click="saveChange" class="blue">save change</button>
        </template>
      </Modal>
      <ConfirmModal ref="confirmDialog" v-model:open="openConfirm" />
    </template>
  </MainFrame>
</template>

<script lang="ts">
import { onMounted, ref, inject, defineComponent } from 'vue'
import { statusCode as status } from '@/interface/api'
import MainFrame from '@/components/mainFrame/MainFrame.vue'
import Modal from '@/components/modal/ModalDialog.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

import DataTable from '@/components/dataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable'

import type { Unit } from '@/interface/unit'
import { useUnitApi } from '@/composables/api'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  components: { DataTable, Modal, MainFrame, ConfirmModal },
  setup() {
    const open = ref(false)
    const title = ref('')
    const unitData = ref<Unit[]>([])
    const unitForm = ref<Unit>({})
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const confirmDialog = ref<any>(null)
    const openConfirm = ref(false)
    const unitApi = useUnitApi()
    const columnsData: IColumn[] = [
      {
        key: 'unitName',
        label: 'ชื่อ',
        style: {
          width: '70%'
        }
      }
    ]
    const option: TableOption = {
      actionLabel: 'ดำเนินการ',
      rowNumber: true
    }
    function modalOpen(data: any = null) {
      if (data) {
        unitForm.value.unitName = data.unitName
        unitForm.value.unitId = data.unitId ?? -1
        title.value = 'แก้ไขหน่วย'
      } else {
        title.value = 'เพิ่มสินค้า'
      }
      open.value = true
    }

    async function deleteUnit(data: any) {
      if (await confirmDialog.value.getConfirmResult()) {
        loader.setLoadingOn()
        const { statusCode } = await unitApi.deleteUnit(data.unitId)
        if (statusCode === status.deleteSuccess) {
          toast.success('สำเร็จ', 'ลบหน่วยนับสำเร็จ')
        } else {
          toast.error('ไม่สำเร็จ', 'ไม่สามารถลบหน่วยนับได้')
        }
        await getUnit()
        loader.setLoadingOff()
      }
    }

    async function saveChange() {
      loader.setLoadingOn()
      let statusCode = 0
      if (title.value === 'เพิ่มสินค้า') {
        statusCode = await unitApi
          .createUnit({ unitName: unitForm.value.unitName! })
          .then((e) => e.statusCode)
      } else {
        statusCode = await unitApi.updateUnit(unitForm.value).then((e) => e.statusCode)
      }
      if (status.updateSuccess === statusCode || status.createSuccess === statusCode) {
        toast.success('สำเร็จ', 'ดำเนินการสำเร็จ')
      } else {
        toast.error('ไม่สำเร็จ', 'ไม่สามารถดำเนินการได้')
      }
      open.value = false
      unitForm.value = { unitId: -1, unitName: '' }
      await getUnit()
      loader.setLoadingOff()
    }

    function closeDialog() {
      open.value = false
      unitForm.value = { unitId: -1, unitName: '' }
    }

    async function getUnit() {
      const res = await unitApi.getUnit().then((e) => e.data!)
      unitData.value = res
    }
    onMounted(async () => {
      loader.setLoadingOn()
      await getUnit()
      loader.setLoadingOff()
    })

    return {
      saveChange,
      modalOpen,
      deleteUnit,
      closeDialog,
      unitData,
      columnsData,
      option,
      unitForm,
      title,
      openConfirm,
      open,
      confirmDialog
    }
  }
})
</script>
