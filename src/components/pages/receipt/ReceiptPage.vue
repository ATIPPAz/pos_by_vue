<template>
  <MainPage title="ดูใบเสร็จรับเงิน">
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="startDate">วันที่เริ่มต้น:</label>
        <input type="date" v-model="startDate" />
        <label for="endDate"> วันสิ้นสุด:</label>
        <input type="date" v-model="endDate" />
        <button id="searchButton" @click="searchReceipt" class="blue">ค้นหา</button>
      </div>
      <DataTable :column="header" :data="receiptData" :option="option">
        <template #action="data">
          <button @click="openDetail(data.data)" class="blue">ดูรายละเอียด</button>
        </template>
      </DataTable>
    </template>
  </MainPage>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import MainPage from '../../shared/PageDesign.vue'
import { statusCode as status } from '../../../plugins/statusCode'
import { ref } from 'vue'
import { receiptApi } from '@/composables/api'
import type { Receipt } from '@/interface/api/receipt.interface'
import DataTable, { type IColumn, type TableOption } from '../../shared/TableComponent.vue'

import { computed } from 'vue'
import router from '@/router'
export default {
  components: {
    MainPage,
    DataTable
  },
  setup() {
    const startDate = ref(formatDateForDisplay(getPreviousDay(new Date())))
    const endDate = ref(formatDateForDisplay(new Date()))
    const header = ref<IColumn[]>([
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
    async function searchReceipt() {
      console.log(await getReceipt())
    }
    function getPreviousDay(date = new Date()) {
      const previous = new Date(date.getTime())
      previous.setDate(date.getDate() - 1)
      return previous
    }

    function formatDateForDisplay(date: Date) {
      const dayNo = (date.getDate() + '').padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${year}-${month}-${dayNo}`
    }
    let _receipt = ref<Receipt[]>([])
    async function getReceipt() {
      const res = await receiptApi().getAllReceipt(startDate.value, endDate.value)
      if (res.statusCode === status.getSuccess) {
        _receipt.value = res.data as Receipt[]
        return res.data
      } else {
        _receipt.value = []
        return []
      }
    }
    function openDetail(data: Receipt) {
      router.push({ name: 'receiptDetail', params: { receiptId: data.receiptId } })
    }
    const receiptData = computed(() => _receipt.value)

    onMounted(async () => {
      await getReceipt()
      // console.log(receiptData.value)
    })
    return {
      startDate,
      option,

      searchReceipt,
      openDetail,
      receiptData,
      endDate,
      header
    }
  }
}
</script>

<style scoped></style>
