<template>
  <TwoColumnLayout>
    <template #title> <h1>ตั้งค่าสินค้า</h1></template>
    <template #left>
      <div>
        <div class="j-end" style="margin-bottom: 14px">
          <button class="blue" @click="modalOpen()">เพิ่ม</button>
        </div>
        <DataTable
          v-model:selectIndexRow="selectUnitIndex"
          :column="columnData"
          :option="option"
          :data="itemData"
        >
          <template #cell-itemCode="data">{{ data.data.itemCode }} </template>
          <template #cell-itemName="data">{{ data.data.itemName }} </template>
          <template #cell-unitName="data">{{ data.data.unitName }} </template>
          <template #cell-itemPrice="data">{{ data.data.itemPrice }} </template>
        </DataTable>
      </div>
    </template>
    <template #right>
      <SlideCard
        v-model:index-select="selectUnitIndex"
        :data-length="itemData.length"
        style="width: 100%"
      >
        <template #head> <h1>Item Detail</h1> </template>
        <template #body>
          <b>รหัสสินค้า</b><br />
          {{ slideItem ? slideItem.itemCode : '-' }}<br /><br />
          <b>ชื่อสินค้า</b><br />
          {{ slideItem ? slideItem.itemName : '-' }}<br /><br />
          <b>ราคา</b><br />
          {{ slideItem ? slideItem.itemPrice : '-' }}
        </template>
        <template #footer>
          <button
            style="margin-right: 8px"
            :class="!!slideItem ? { yellow: true } : {}"
            :disabled="!slideItem"
            @click="modalOpen(slideItem as ItemForm)"
          >
            แก้ไข
          </button>
          <button
            @click="deleteItem(slideItem as Item)"
            :class="!!slideItem ? { red: true } : {}"
            :disabled="!slideItem"
          >
            ลบ
          </button>
        </template>
        <template #left="{ disabled }">
          <h1
            :style="!disabled ? { cursor: 'pointer' } : { cursor: 'not-allowed' }"
            :class="!disabled ? { 'f-black': true } : { 'f-gray': true }"
          >
            &lt;
          </h1>
        </template>
        <template #right="{ disabled }"
          ><h1
            :style="!disabled ? { cursor: 'pointer' } : { cursor: 'not-allowed' }"
            :class="!disabled ? { 'f-black': true } : { 'f-gray': true }"
          >
            &gt;
          </h1>
        </template>
      </SlideCard></template
    >
  </TwoColumnLayout>

  <ModalDialog v-model:open="openModal" :option="modalOption">
    <template #header>
      <p class="modal-title">{{ titleModal }}</p>
    </template>
    <template #body>
      <div class="item-grid">
        <div class="item">
          รหัสสินค้า: <br />
          <input type="text" v-model="itemForm.itemCode" />
        </div>
        <div class="item">
          ชื่อสินค้า: <br />
          <input type="text" v-model="itemForm.itemName" />
        </div>
        <div class="item">
          ราคา: <br />
          <input type="number" v-model="itemForm.itemPrice" min="0" step="1" />
        </div>
        <div class="item">
          หน่วย: <br />
          <InputDropdown v-model="itemForm.unitId" :options="unitDropdownOption" />
        </div>
      </div>
    </template>
    <template #footer>
      <button @click="closeDialog" class="gray" style="margin-right: 8px">close</button>
      <button @click="saveChange" class="blue">save change</button>
    </template>
  </ModalDialog>
  <ConfirmModal ref="confirmDialog" />
</template>

<script setup lang="ts">
import { SlideCard } from '@/components/card'
import { ref, onMounted, inject, computed } from 'vue'
import { ModalDialog } from '@/components/modal'
import { InputDropdown } from '@/components/input'
import { useItemApi, useUnitApi } from '@/composables/api'
import { statusCode as status } from '@/interface/api'
import type { Option } from '@/interface/dropdown'
import type { ItemApiRequest } from '@/composables/api/useItemApi'
import type { Item, ItemForm } from '@/interface/item'
import { DataTable } from '@/components/dataTable'
import type { ModalOption } from '@/interface/modal'
import { TwoColumnLayout } from '@/components/layout'
import type { IColumn, TableOption } from '@/interface/dataTable'
import type { Unit } from '@/interface/unit'
import { ConfirmModal } from '@/components/modal'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'
const modalOption = ref<ModalOption>({ style: { width: '450px' } })
const unitDropdown = ref<Unit[]>([])
const loader = inject(loaderPluginSymbol)!
const toast = inject(toastPluginSymbol)!
const unitApi = useUnitApi()
const itemApi = useItemApi()
const slideItem = computed(() => {
  return selectUnitIndex.value >= 0 && selectUnitIndex.value <= itemData.value.length - 1
    ? itemData.value[selectUnitIndex.value]
    : null
})
const selectUnitIndex = ref(-1)
const confirmDialog = ref<InstanceType<typeof ConfirmModal>>()!
const columnData = ref<IColumn[]>([
  {
    key: 'itemCode',
    label: 'รหัสสินค้า'
  },
  { key: 'itemName', label: 'ชื่อสินค้า' },
  { key: 'unitName', label: 'หน่วย' },
  { key: 'itemPrice', label: 'ราคา' }
])
const itemData = ref<Item[]>([])
const option = ref<TableOption>({
  actionLabel: 'ดำเนินการ'
})
const unitDropdownOption = computed((): Option<number>[] =>
  unitDropdown.value.map((e) => {
    return {
      id: e.unitId!,
      label: e.unitName!
    }
  })
)
const itemForm = ref<ItemForm>({ itemPrice: 0, itemCode: '', itemName: '' })
const openModal = ref(false)
const titleModal = ref('เพิ่มสินค้า')
async function saveChange() {
  let _statusCode = 0
  if (!itemForm.value.unitId) {
    toast.error('ไม่สำเร็จ', 'กรุณาเลือกหน่วยนับ')
    return
  }
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  const itemApiForm: ItemApiRequest = {
    ...itemForm.value,
    unitId: itemForm.value.unitId!
  }
  if (titleModal.value === 'เพิ่มสินค้า') {
    const { statusCode } = await itemApi.createItem(itemApiForm)
    _statusCode = statusCode
  } else {
    const { statusCode } = await itemApi.updateItem(itemApiForm)
    _statusCode = statusCode
  }
  if (_statusCode === status.createSuccess || _statusCode === status.updateSuccess) {
    toast.success('สำเร็จ', 'ดำเนินการสำเร็จ')
  } else {
    toast.error('ไม่สำเร็จ', 'ไม่สามารถดำเนินการได้')
  }
  openModal.value = false
  itemForm.value = {
    itemCode: '',
    itemName: '',
    itemPrice: 0,
    unitId: undefined
  }
  await getItemData()
  loader.setLoadingOff(idloader)
}

async function deleteItem(data: Item) {
  if (await confirmDialog.value?.getConfirmResult()) {
    const idloader = crypto.randomUUID()
    loader.setLoadingOn(idloader)
    const { statusCode } = await itemApi.deleteItem(data.itemId!)
    if (statusCode === status.deleteSuccess) {
      toast.success('สำเร็จ', 'ลบสินค้าสำเร็จ')
    } else {
      toast.error('ไม่สำเร็จ', 'ไม่สามารถลบสินค้าได้')
    }
    await getItemData()
    loader.setLoadingOff(idloader)
  }
}
async function modalOpen(item: ItemForm | null = null) {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  await getUnitData()
  if (item) {
    titleModal.value = 'แก้ไขสินค้า'
    itemForm.value = item!
  } else {
    titleModal.value = 'เพิ่มสินค้า'
    itemForm.value.itemCode = ''
    itemForm.value.itemName = ''
    itemForm.value.itemPrice = 0
  }
  loader.setLoadingOff(idloader)
  openModal.value = true
}

function closeDialog() {
  openModal.value = false
  itemForm.value = {
    itemCode: '',
    itemName: '',
    itemPrice: 0,
    unitId: undefined
  }
}
async function getItemData() {
  const { data } = await itemApi.getItem()
  itemData.value = data
}
async function getUnitData() {
  const { data } = await unitApi.getUnit()
  unitDropdown.value = data
  itemForm.value.unitId = unitDropdown.value[0].unitId
}
onMounted(async () => {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  await getItemData()
  loader.setLoadingOff(idloader)
})
</script>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  padding: 10px;
}
.modal-content {
  width: 600px;
}
</style>
