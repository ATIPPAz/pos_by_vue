<template>
  <MainPage title="ตั้งค่าสินค้า">
    <template #content>
      <div class="j-end" style="margin-bottom: 14px">
        <button class="blue" @click="createItemModalOpen">เพิ่ม</button>
      </div>
      <DataTable :column="header" :option="option" :data="itemData">
        <template #action="data">
          <div>
            <button @click="editItem(data.data)">edit</button>
            <button @click="deleteItem(data.data)">delete</button>
          </div>
        </template>
      </DataTable>
      <Modal
        :open="openModel"
        :title="titleModel"
        @on-save="saveChangeModel"
        @on-close="closeDialog"
        ><template #content>
          <div class="item-grid">
            <div class="item">
              รหัสสินค้า: <br />
              <input type="text" id="itemCode" />
            </div>
            <div class="item">
              ชื่อสินค้า: <br />
              <input type="text" id="itemName" />
            </div>
            <div class="item">
              ราคา: <br />

              <input type="number" id="itemPrice" min="0" step="1" value="0" />
            </div>
            <div class="item">
              หน่วย: <br />
              <select name="itemDropdown" id="itemDropdown"></select>
            </div></div></template
      ></Modal>
    </template>
  </MainPage>
</template>

<script lang="ts">
import MainPage from '@/components/mainFrame/MainFrame.vue'
import { ref, defineComponent } from 'vue'
import Modal from '@/components/model/ModelDialog.vue'

import { useItemApi } from '@/composables/api/useItemApi'
import type { Item } from '@/interface/item.interface'
import DataTable from '@/components/DataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'
export default defineComponent({
  components: {
    MainPage,
    DataTable,
    Modal
  },
  setup() {
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
    const openModel = ref(false)
    const titleModel = ref('เพิ่มสินค้า')
    function saveChangeModel() {}
    function createItemModalOpen() {
      titleModel.value = 'เพิ่มสินค้า'
      openModel.value = true
    }
    function closeDialog() {}
    ;(async () => {
      itemData.value = (await useItemApi().getItem()).data ?? []
    })()
    return {
      header,
      option,
      itemData,
      openModel,
      titleModel,
      saveChangeModel,
      createItemModalOpen,
      closeDialog
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
</style>
