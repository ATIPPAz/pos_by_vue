<template>
  <MainPage title="ออกใบเสร็จรับเงิน">
    <template #content>
      <DataTable :column="header" :option="option">
        <template #action="data"> </template>
      </DataTable>
    </template>
  </MainPage>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import MainPage from '../../shared/PageDesign.vue'
import { statusCode as status } from '../../../plugins/statusCode'
import { ref, inject } from 'vue'
import DataTable, { type IColumn, type TableOption } from '../../shared/TableComponent.vue'

import { computed } from 'vue'
import router from '@/router'
export default {
  components: {
    MainPage,
    DataTable
  },
  setup() {
    const $api = inject('api')
    const header = ref<Icolumn[]>([
      {
        key: 'receiptCode',
        label: 'เลขที่อ้างอิง',
        styleCol: { type: 'input:text', disabled: true }
      },
      { key: 'receiptDate', label: 'วันที่' },
      { key: 'receiptGrandTotal', label: 'GrandTotal' }
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
