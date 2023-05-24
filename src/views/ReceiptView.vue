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
import router from '@/router'
import MainPage from '@/components/mainFrame/MainFrame.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import { useReceiptApi } from '@/composables/api'
import { statusCode as status } from '@/interface/api'
import { ref, defineComponent, computed, onMounted } from 'vue'
import type { Receipt } from '@/interface/receipt.interface'
import type { ButtonClick, IColumn, TableOption } from '@/interface/dataTable.interface'
export default defineComponent({
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
        label: 'เลขที่อ้างอิง'
      },
      { key: 'receiptDate', label: 'วันที่' },
      { key: 'receiptGrandTotal', label: 'GrandTotal' }
    ])
    const option = ref<TableOption>({
      actionLabel: 'ดำเนินการ'
    })
    const receiptData = computed(() => _receipt.value)
    let _receipt = ref<Receipt[]>([])
    async function searchReceipt() {
      await getReceipt()
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
      const res = await useReceiptApi().getAllReceipt(startDate.value, endDate.value)
      if (res.statusCode === status.getSuccess) {
        _receipt.value = res.data as Receipt[]
        return res.data
      } else {
        _receipt.value = []
        return []
      }
    }
    function openDetail(data: ButtonClick) {
      router.push({ name: 'receiptDetail', params: { receiptId: data.data.receiptId } })
    }
    onMounted(async () => {
      await getReceipt()
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
