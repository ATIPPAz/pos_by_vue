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
import { onMounted } from 'vue'
import MainPage from '@/components/mainFrame/MainFrame.vue'
import { statusCode as status } from '@/interface/api/statusCode'
import { ref, inject } from 'vue'
import DataTable, { type IColumn, type TableOption } from '@/components/DataTable/DataTable.vue'

import { computed } from 'vue'
import router from '@/router'
export default {
  components: {
    MainPage,
    DataTable
  },
  setup() {
    const $api = inject('api')
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
}
</script>

<style scoped></style>
