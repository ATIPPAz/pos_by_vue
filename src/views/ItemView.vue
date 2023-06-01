<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title> <h1>ตั้งค่าสินค้า</h1></template>
    <template #content>
      <div class="j-end" style="margin-bottom: 14px">
        <button class="blue" @click="modalOpen()">เพิ่ม</button>
      </div>
      <DataTable :column="columnData" :option="option" :data="itemData">
        <template #cell-itemCode="data">{{ data.data.itemCode }} </template>
        <template #cell-itemName="data">{{ data.data.itemName }} </template>
        <template #cell-unitName="data">{{ data.data.unitName }} </template>
        <template #cell-itemPrice="data">{{ data.data.itemPrice }} </template>
        <template #cell-idRowAction="data">
          <div>
            <button @click="modalOpen(data.data)" class="yellow" style="margin-right: 8px">
              edit
            </button>
            <button @click="deleteItem(data.data)" class="red">delete</button>
          </div>
        </template>
      </DataTable>
      <Modal v-model:open="openModal" :option="modalOption">
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
      </Modal>
      <ConfirmModal ref="confirmDialog" />
    </template>
  </MainFrame>
</template>

<script lang="ts">
import MainFrame from '@/components/layout/BasicLayout.vue'
import { ref, defineComponent, onMounted, inject, computed } from 'vue'
import Modal from '@/components/modal/ModalDialog.vue'
import { InputDropdown } from '@/components/input'
import { useItemApi, useUnitApi } from '@/composables/api'
import { statusCode as status } from '@/interface/api'
import type { Option } from '@/interface/dropdown'
import type { ItemApiRequest } from '@/composables/api/useItemApi'
import type { Item, ItemForm } from '@/interface/item'
import DataTable from '@/components/dataTable/DataTable.vue'
import type { ModalOption } from '@/interface/modal.js'

import type { IColumn, TableOption } from '@/interface/dataTable'
import type { Unit } from '@/interface/unit.js'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'

export default defineComponent({
  components: {
    MainFrame,
    InputDropdown,
    DataTable,
    ConfirmModal,
    Modal
  },
  setup() {
    const modalOption = ref<ModalOption>({ style: { width: '450px' } })
    const unitDropdown = ref<Unit[]>([])
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const unitApi = useUnitApi()
    const itemApi = useItemApi()
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
    const unitSelect = ref<number>(-1)
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

    return {
      columnData,
      option,
      itemData,
      openModal,
      titleModal,
      unitDropdownOption,
      saveChange,
      deleteItem,
      modalOpen,
      closeDialog,
      itemDropdown: unitDropdown,
      itemForm: itemForm,
      unitSelect,
      confirmDialog,
      modalOption
    }
  }
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
