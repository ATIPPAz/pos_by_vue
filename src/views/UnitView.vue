<template>
  <TwoColumnLayout>
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
    <template #left>
      <div>
        <div class="j-end" style="margin-bottom: 14px">
          <button id="addButton" class="blue" @click="modalOpen(undefined)">เพิ่ม</button>
        </div>
        <DataTable :data="unitData" :column="columnsData" :option="option" :selectRow="selectRow">
          <template #cell-unitName="slotProp">
            {{ slotProp.data.unitName }}
          </template>
          <template #cell-idRowAction="data">
            <div>
              <button @click="modalOpen(data.data)" class="yellow" style="margin-right: 8px">
                edit
              </button>
              <button @click="deleteUnit(data.data)" class="red">delete</button>
            </div>
          </template>
        </DataTable>
      </div>
    </template>
    <template #right>
      <SlideCard style="width: 100%">
        <template #head>test</template>
        <template #body>testdasd.sa;d.</template>
        <template #footer>daspldps</template>
        <template #left> <h1>&lt;</h1> </template>
        <template #right><h1>&gt;</h1> </template>
      </SlideCard>
    </template>
  </TwoColumnLayout>
  <Modal v-model:open="open">
    <template #header>
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
  <ConfirmModal ref="confirmDialog" />
</template>

<script lang="ts">
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue'
import SlideCard from '@/components/card/SlideCard.vue'
import { onMounted, ref, inject, defineComponent } from 'vue'
import { statusCode as status } from '@/interface/api'
import Modal from '@/components/modal/ModalDialog.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable'
import type { Unit, UnitForm } from '@/interface/unit'
import { useUnitApi } from '@/composables/api'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'
import { computed } from 'vue'
export default defineComponent({
  components: { DataTable, Modal, ConfirmModal, SlideCard, TwoColumnLayout },
  setup() {
    const open = ref(false)
    const unitData = ref<Unit[]>([])
    const unitForm = ref<UnitForm>({ unitName: '' })
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const confirmDialog = ref<InstanceType<typeof ConfirmModal>>()
    const isEdit = ref(false)
    const unitApi = useUnitApi()
    const selectUnit = ref<Unit>({ unitId: 51 })
    const selectRow = computed(() => {
      return {
        data: selectUnit.value,
        key: 'unitId'
      }
    })
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
        isEdit.value = true
      } else {
        isEdit.value = false
        unitForm.value.unitName = ''
      }
      open.value = true
    }
    async function deleteUnit(data: any) {
      if (await confirmDialog.value?.getConfirmResult()) {
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
      if (!isEdit.value) {
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
    const title = computed(() => {
      return !isEdit.value ? 'เพิ่มสินค้า' : 'แก้ไขหน่วย'
    })
    return {
      saveChange,
      selectRow,
      modalOpen,
      deleteUnit,
      closeDialog,
      unitData,
      columnsData,
      option,
      unitForm,
      title,
      open,
      confirmDialog
    }
  }
})
</script>
