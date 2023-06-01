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
        <DataTable
          :data="unitData"
          :column="columnsData"
          :option="option"
          v-model:selectIndexRow="selectUnitIndex"
        >
          <template #cell-unitName="slotProp">
            {{ slotProp.data.unitName }}
          </template>
        </DataTable>
      </div>
    </template>
    <template #right>
      <SlideCard style="width: 100%">
        <template #head> <h1>Unit Detail</h1> </template>
        <template #body>
          <b>ชื่อหน่วย</b><br />
          {{ slideUnitItem ? slideUnitItem.unitName : '-' }}
        </template>
        <template #footer>
          <button
            style="margin-right: 8px"
            :class="!!slideUnitItem ? { yellow: true } : {}"
            :disabled="!slideUnitItem"
            @click="modalOpen(slideUnitItem)"
          >
            แก้ไข
          </button>
          <button @click="deleteUnit(slideUnitItem)" class="red" :disabled="!slideUnitItem">
            ลบ
          </button>
        </template>
        <template #left>
          <h1
            :style="selectUnitIndex > 0 ? { cursor: 'pointer' } : { cursor: 'not-allowed' }"
            :class="selectUnitIndex > 0 ? { 'f-black': true } : { 'f-gray': true }"
            @click="selectUnitIndex > 0 ? (selectUnitIndex -= 1) : (selectUnitIndex = 0)"
          >
            &lt;
          </h1>
        </template>
        <template #right
          ><h1
            :style="
              selectUnitIndex < unitData.length - 1 && selectUnitIndex >= 0
                ? { cursor: 'pointer' }
                : { cursor: 'not-allowed' }
            "
            :class="
              selectUnitIndex < unitData.length - 1 && selectUnitIndex >= 0
                ? { 'f-black': true }
                : { 'f-gray': true }
            "
            @click="
              selectUnitIndex < unitData.length - 1
                ? (selectUnitIndex += 1)
                : (selectUnitIndex = unitData.length - 1)
            "
          >
            &gt;
          </h1>
        </template>
      </SlideCard>
    </template>
  </TwoColumnLayout>
  <ModalDialog v-model:open="open">
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
  </ModalDialog>
  <ConfirmModal ref="confirmDialog" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { statusCode as status } from '@/interface/api'
import { onMounted, ref, inject } from 'vue'
import { useUnitApi } from '@/composables/api'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'

import type { IColumn, TableOption } from '@/interface/dataTable'
import type { Unit, UnitForm } from '@/interface/unit'

import { TwoColumnLayout } from '@/components/layout'
import { SlideCard } from '@/components/card'
import { ModalDialog } from '@/components/modal'
import { ConfirmModal } from '@/components/modal'
import { DataTable } from '@/components/dataTable'

const open = ref(false)
const unitData = ref<Unit[]>([])
const unitForm = ref<UnitForm>({ unitName: '' })
const loader = inject(loaderPluginSymbol)!
const toast = inject(toastPluginSymbol)!
const confirmDialog = ref<InstanceType<typeof ConfirmModal>>()
const isEdit = ref(false)
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
const selectUnitIndex = ref<number>(-1)

function modalOpen(data: Unit | null = null) {
  if (data) {
    unitForm.value.unitName = data.unitName!
    unitForm.value.unitId = data.unitId ?? -1
    isEdit.value = true
  } else {
    isEdit.value = false
    unitForm.value.unitName = ''
  }
  open.value = true
}
async function deleteUnit(data: Unit | undefined) {
  if (!data) {
    toast.error('ไม่สำเร็จ', 'ไม่สามารถลบหน่วยนับได้')

    return
  }
  if (await confirmDialog.value?.getConfirmResult()) {
    const idloader = crypto.randomUUID()
    loader.setLoadingOn(idloader)
    const { statusCode } = await unitApi.deleteUnit(data.unitId!)
    if (statusCode === status.deleteSuccess) {
      toast.success('สำเร็จ', 'ลบหน่วยนับสำเร็จ')
    } else {
      toast.error('ไม่สำเร็จ', 'ไม่สามารถลบหน่วยนับได้')
    }
    await getUnit()
    loader.setLoadingOff(idloader)
  }
}
async function saveChange() {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
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
  loader.setLoadingOff(idloader)
}
function closeDialog() {
  open.value = false
  unitForm.value = { unitId: -1, unitName: '' }
}
async function getUnit() {
  const res = await unitApi.getUnit().then((e) => e.data!)
  unitData.value = res
}

const title = computed(() => {
  return !isEdit.value ? 'เพิ่มสินค้า' : 'แก้ไขหน่วย'
})
const slideUnitItem = computed(() => {
  return selectUnitIndex.value >= 0 && selectUnitIndex.value <= unitData.value.length - 1
    ? unitData.value[selectUnitIndex.value]
    : undefined
})

onMounted(async () => {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  await getUnit()
  loader.setLoadingOff(idloader)
})
</script>
<!-- <style lang="css">
.red {
  background-color: #ff0000;
  color: white;
}

.red:disabled {
  background-color: #4a0000;
  color: #4a0000;
}
</style> -->
