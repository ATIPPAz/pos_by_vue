<template>
  <h1>ดูใบเสร็จรับเงิน</h1>
  <div style="margin-bottom: 14px">
    <label for="startDate">วันที่เริ่มต้น:</label>
    <input type="date" v-model="startDate" style="margin: 0px 8px" />
    <label for="endDate"> วันสิ้นสุด:</label>
    <input type="date" v-model="endDate" style="margin: 0px 8px" />
    <button id="searchButton" @click="searchReceipt" class="blue">ค้นหา</button>
  </div>
  <DataTable :column="columnsData" :data="receiptData" :option="option">
    <template #cell-receiptCode="{ data }">
      {{ data.receiptCode }}
    </template>
    <template #cell-receiptDate="{ data }">
      {{ data.receiptDate }}
    </template>
    <template #cell-receiptGrandTotal="{ data }">
      {{ data.receiptGrandTotal }}
    </template>
    <template #cell-idRowAction="{ data }">
      <button @click="openDetail(data)" class="blue">ดูรายละเอียด</button>
    </template>
  </DataTable>
  <ReceiptModal ref="receiptModal" :receipt-data="receiptDetailData" />
</template>

<script lang="ts" setup>
import { statusCode as status } from '@/interface/api'
import { useReceiptApi } from '@/composables/api'
import { loaderPluginSymbol } from '@/plugins/loading'
import { toastPluginSymbol } from '@/plugins/toast'
import { ref, computed, onMounted, inject } from 'vue'

import type { IColumn, TableOption } from '@/interface/dataTable'
import type { Receipt, ReceiptForm } from '@/interface/receipt'

import { DataTable } from '@/components/dataTable'
import { ReceiptModal } from '@/components/modal'

const receiptApi = useReceiptApi()
const loader = inject(loaderPluginSymbol)!
const toast = inject(toastPluginSymbol)!
const startDate = ref(formatDateForDisplay(getPreviousDay(new Date())))
const endDate = ref(formatDateForDisplay(new Date()))
const receiptModal = ref<InstanceType<typeof ReceiptModal>>()
const columnsData = ref<IColumn[]>([
  {
    key: 'receiptCode',
    label: 'เลขที่อ้างอิง'
  },
  { key: 'receiptDate', label: 'วันที่' },
  { key: 'receiptGrandTotal', label: 'GrandTotal' }
])
const option = ref<TableOption>({
  actionLabel: 'ดำเนินการ'
})
const _receipt = ref<Receipt[]>([])

const receiptDetailData = ref<ReceiptForm>({
  receiptDate: '',
  receiptdetails: [],
  receiptGrandTotal: 0,
  receiptSubTotal: 0,
  receiptTotalBeforeDiscount: 0,
  receiptTotalDiscount: 0,
  receiptTradeDiscount: 0
})
async function searchReceipt() {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  await getReceipt()
  loader.setLoadingOff(idloader)
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
async function getReceipt() {
  const res = await receiptApi.getAllReceipt(startDate.value, endDate.value)
  if (res.statusCode === status.getSuccess) {
    _receipt.value = res.data as Receipt[]
    return res.data
  } else {
    toast.error('ไม่สำเร็จ', 'เซิฟเวอร์มีปัญหา')
    _receipt.value = []
    return []
  }
}
async function openDetail(emitData: Receipt) {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  const { data, statusCode } = await receiptApi.getOneReceipt(emitData.receiptId!)
  if (statusCode === status.error) {
    toast?.error('เกิดข้อผิดพลาด', 'เซิฟเวอร์มีปัญหา')
  }
  loader.setLoadingOff(idloader)
  receiptDetailData.value = data as ReceiptForm
  receiptModal.value?.openModal()
}
const receiptData = computed(() => _receipt.value)
onMounted(async () => {
  const idloader = crypto.randomUUID()
  loader.setLoadingOn(idloader)
  await getReceipt()
  loader.setLoadingOff(idloader)
})
</script>
