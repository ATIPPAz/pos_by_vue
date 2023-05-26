<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title> <h1>ตั้งค่าสินค้า</h1></template>
    <template #content>
      <div class="j-end" style="margin-bottom: 14px">
        <button class="blue" @click="modalOpen()">เพิ่ม</button>
      </div>
      <DataTable :column="header" :option="option" :data="itemData">
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
      <Modal :open="openModal" :option="modalOption">
        <template #header>
          <span class="close" @click="closeDialog"> &times; </span>
          <p class="modal-title">{{ titleModal }}</p>
        </template>
        <template #body>
          <div class="item-grid">
            <div class="item">
              รหัสสินค้า: <br />
              <input type="text" v-model="itemRequest.itemCode" />
            </div>
            <div class="item">
              ชื่อสินค้า: <br />
              <input type="text" v-model="itemRequest.itemName" />
            </div>
            <div class="item">
              ราคา: <br />
              <input type="number" v-model="itemRequest.itemPrice" min="0" step="1" />
            </div>
            <div class="item">
              หน่วย: <br />
              <select v-model="unitSelect">
                <option
                  v-for="unit in itemDropdown"
                  :value="{ unitId: unit.unitId, unitName: unit.unitName }"
                  :key="unit.unitId"
                >
                  {{ unit.unitName }}
                </option>
              </select>
            </div>
          </div>
        </template>
        <template #footer>
          <button @click="closeDialog" class="gray" style="margin-right: 8px">close</button>
          <button @click="saveChange" class="blue">save change</button>
        </template>
      </Modal>
      <ConfirmModal ref="confirmDialog" :open="openConfirm" />
    </template>
  </MainFrame>
</template>

<script lang="ts">
import MainFrame from '@/components/mainFrame/MainFrame.vue'
import { ref, defineComponent, onMounted, inject, watch } from 'vue'
import Modal from '@/components/modal/ModalDialog.vue'

import { useItemApi, useUnitApi as apiUnit } from '@/composables/api'
import { statusCode as status } from '@/interface/api'

import type { Item } from '@/interface/item.interface'
import DataTable from '@/components/dataTable/DataTable.vue'
import type { ModalOption } from '@/interface/modal.interface'

import type { IColumn, TableOption } from '@/interface/dataTable.interface'
import type { Unit } from '@/interface/unit.interface'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'

export default defineComponent({
  components: {
    MainFrame,
    DataTable,
    ConfirmModal,
    Modal
  },
  setup() {
    const modalOption = ref<ModalOption>({ style: { width: '450px' } })
    const itemDropdown = ref<Unit[]>([])
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const useUnitApi = apiUnit()
    const confirmDialog = ref<any>(null)
    const openConfirm = ref(false)
    const header = ref<IColumn[]>([
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
    const itemRequest = ref<Item>({ itemPrice: 0, itemCode: '', itemName: '' })
    const unitSelect = ref<Unit>({})
    const openModal = ref(false)
    const titleModal = ref('เพิ่มสินค้า')
    async function saveChange() {
      loader.setLoadingOn()
      let statusCode = 0
      if (titleModal.value === 'เพิ่มสินค้า') {
        statusCode = (await useItemApi().createItem(itemRequest.value)).statusCode
      } else {
        statusCode = (await useItemApi().updateItem(itemRequest.value)).statusCode
      }
      if (statusCode === status.createSuccess || statusCode === status.updateSuccess) {
        toast.success('สำเร็จ', 'ดำเนินการสำเร็จ')
      } else {
        toast.error('ไม่สำเร็จ', 'ไม่สามารถดำเนินการได้')
      }
      openModal.value = false
      itemRequest.value = {
        itemCode: '',
        itemName: '',
        itemPrice: 0,
        unitId: unitSelect.value?.unitId,
        unitName: unitSelect.value?.unitName
      }
      await getItemData()
      loader.setLoadingOff()
    }

    async function deleteItem(data: any) {
      openConfirm.value = true
      if (await confirmDialog.value.getConfirmResult()) {
        loader.setLoadingOn()
        const { statusCode } = await useItemApi().deleteItem(data.itemId)
        if (statusCode === status.deleteSuccess) {
          toast.success('สำเร็จ', 'ลบสินค้าสำเร็จ')
        } else {
          toast.error('ไม่สำเร็จ', 'ไม่สามารถลบสินค้าได้')
        }
        await getItemData()
        loader.setLoadingOff()
      }
      openConfirm.value = false
    }
    async function modalOpen(item: any = null) {
      loader.setLoadingOn()
      await getUnitData()
      if (item) {
        titleModal.value = 'แก้ไขสินค้า'
        openModal.value = true
        itemRequest.value = item
      } else {
        titleModal.value = 'เพิ่มสินค้า'
        openModal.value = true
      }
      loader.setLoadingOff()
    }
    watch(
      () => unitSelect.value,
      (newValue) => {
        itemRequest.value.unitId = newValue?.unitId
        itemRequest.value.unitName = newValue?.unitName
      }
    )
    watch(
      () => itemRequest.value,
      (newValue) => {
        unitSelect.value.unitId = newValue.unitId ?? 0
        unitSelect.value.unitName = newValue.unitName ?? ''
      },
      { deep: true }
    )
    function closeDialog() {
      openModal.value = false
      itemRequest.value = {
        itemCode: '',
        itemName: '',
        itemPrice: 0,
        unitId: unitSelect.value?.unitId,
        unitName: unitSelect.value?.unitName
      }
    }
    async function getItemData() {
      itemData.value = (await useItemApi().getItem()).data ?? []
    }
    async function getUnitData() {
      itemDropdown.value = (await useUnitApi.getUnit()).data ?? []
      unitSelect.value = itemDropdown.value[0]
    }
    onMounted(async () => {
      loader.setLoadingOn()
      await getItemData()
      loader.setLoadingOff()
    })

    return {
      header,
      option,
      itemData,
      openModal,
      titleModal,
      saveChange,
      deleteItem,
      modalOpen,
      closeDialog,
      itemDropdown,
      itemRequest,
      unitSelect,
      confirmDialog,
      openConfirm,
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
