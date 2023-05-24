<template>
  <MainPage title="ตั้งค่าสินค้า">
    <template #content>
      <DataTable :column="header" :option="option">
        <!-- <template #action="data"> </template> -->
      </DataTable>
    </template>
  </MainPage>
</template>

<script lang="ts">
import MainPage from '@/components/mainFrame/MainFrame.vue'
import { ref, defineComponent } from 'vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'
export default defineComponent({
  components: {
    MainPage,
    DataTable
  },
  setup() {
    const header = ref<IColumn[]>([
      {
        key: 'receiptCode',
        label: 'รหัสสินค้า'
      },
      { key: 'receiptDate', label: 'ชื่อสินค้า' },
      { key: 'receiptGrandTotal', label: 'หน่วย' },
      { key: 'receiptDate', label: 'ราคา' }
    ])
    const option = ref<TableOption>({
      actionLabel: 'ดำเนินการ'
    })

    return {
      header,
      option
    }
  }
})
</script>

<style scoped></style>
