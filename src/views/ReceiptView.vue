<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title> <h1>ดูใบเสร็จรับเงิน</h1> </template>
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="startDate">วันที่เริ่มต้น:</label>
        <input type="date" v-model="startDate" style="margin: 0px 8px" />
        <label for="endDate"> วันสิ้นสุด:</label>
        <input type="date" v-model="endDate" style="margin: 0px 8px" />
        <button id="searchButton" @click="searchReceipt" class="blue">ค้นหา</button>
      </div>
      <DataTable :column="header" :data="receiptData" :option="option">
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
    </template>
  </MainFrame>
</template>

<script lang="ts">
import router from '@/router'
import MainFrame from '@/components/layout/BasicLayout.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { loaderPluginSymbol } from '@/plugins/loading'
import { useReceiptApi } from '@/composables/api'
import { statusCode as status } from '@/interface/api'
import { ref, defineComponent, computed, onMounted, inject } from 'vue'
import type { Receipt } from '@/interface/receipt'
import type { IColumn, TableOption } from '@/interface/dataTable'
import { toastPluginSymbol } from '@/plugins/toast'

export default defineComponent({
  components: {
    MainFrame,
    DataTable
  },
  setup() {
    const receiptApi = useReceiptApi()
    const loader = inject(loaderPluginSymbol)!
    const toast = inject(toastPluginSymbol)!
    const startDate = ref(formatDateForDisplay(getPreviousDay(new Date())))
    const endDate = ref(formatDateForDisplay(new Date()))
    const header = ref<IColumn[]>([
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
    const receiptData = computed(() => _receipt.value)
    async function searchReceipt() {
      loader.setLoadingOn()
      await getReceipt()
      loader.setLoadingOff()
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
    function openDetail(data: any) {
      router.push({ name: 'receiptDetail', params: { receiptId: data.receiptId } })
    }
    onMounted(async () => {
      loader.setLoadingOn()
      await getReceipt()
      loader.setLoadingOff()
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
})
</script>
