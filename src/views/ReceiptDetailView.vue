<template>
  <MainFrame @click:backBtn="$router.push({ name: 'receipt' })">
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="receiptCode">เลขที่เอกสาร:</label> <br />
        <input type="text" name="" id="receiptCode" disabled :value="receiptData.receiptCode" />
        <br />
        <label for="">วันที่</label> <br />
        <input type="text" name="" id="dateNow" disabled :value="receiptData.receiptDate" />
      </div>
      <DataTable :column="columnsData" :data="receiptData.receiptdetails" :option="option">
        <template #cell-itemCode="{ data }">
          {{ data.itemCode }}
        </template>
        <template #cell-itemName="{ data }">
          {{ data.itemName }}
        </template>
        <template #cell-unitName="{ data }">
          {{ data.unitName }}
        </template>
        <template #cell-itemQty="{ data }">
          {{ data.itemQty }}
        </template>
        <template #cell-itemPrice="{ data }">
          {{ data.itemPrice }}
        </template>
        <template #cell-itemDiscountPercent="{ data }">
          {{ data.itemDiscountPercent }}
        </template>
        <template #cell-itemDiscount="{ data }">
          {{ data.itemDiscount }}
        </template>
        <template #cell-itemAmount="{ data }">
          {{ data.itemAmount }}
        </template>
      </DataTable>
      <div class="j-end" style="margin-top: 14px">
        <table style="width: fit-content">
          <tbody>
            <tr>
              <td class="t-start">ยอดรวมสินค้าก่อนลด</td>
              <td>
                <input
                  type="number"
                  :value="receiptData.receiptTotalBeforeDiscount"
                  disabled
                /><br />
              </td>
            </tr>
            <tr>
              <td class="t-start">ยอดรวมส่วนลดสินค้า</td>
              <td>
                <input type="number" :value="receiptData.receiptTotalDiscount" disabled /><br />
              </td>
            </tr>
            <tr>
              <td class="t-start">Subtotal</td>
              <td><input type="number" :value="receiptData.receiptSubTotal" disabled /><br /></td>
            </tr>
            <tr>
              <td class="t-start">ส่วนลดการค้า</td>
              <td>
                <input
                  type="number"
                  disabled
                  v-model="receiptData.receiptTradeDiscount"
                  min="0"
                /><br />
              </td>
            </tr>
            <tr>
              <td class="t-start">Grand total</td>
              <td>
                <input
                  type="number"
                  name=""
                  id="grandTotal"
                  :value="receiptData.receiptGrandTotal"
                  disabled
                /><br />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </MainFrame>
</template>

<script lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue'
import { useRoute } from 'vue-router'
import { useReceiptApi } from '@/composables/api'
import { ref, defineComponent } from 'vue'
import type { Receipt } from '@/interface/receipt'
import type { IColumn, TableOption } from '@/interface/dataTable'
import MainFrame from '@/components/layout/BasicLayout.vue'
import { inject } from 'vue'
import { loaderPluginSymbol } from '@/plugins/loading'
import { onMounted } from 'vue'
import { statusCode as status } from '@/interface/api'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  components: { DataTable, MainFrame },

  setup() {
    const loader = inject(loaderPluginSymbol)
    const toast = inject(toastPluginSymbol)
    const route = useRoute()
    const receiptId = ref(-1)
    const receiptApi = useReceiptApi()
    const date = ref<string>()
    const option = ref<TableOption>({ actionLabel: 'ดำเนินการ' })
    const columnsData = ref<IColumn[]>([
      {
        key: 'itemCode',
        label: 'รหัสสินค้า'
      },
      { key: 'itemName', label: 'ชื่อสินค้า' },
      { key: 'unitName', label: 'หน่วย' },
      {
        key: 'itemQty',
        label: 'จำนวน'
      },
      { key: 'itemPrice', label: 'ราคา' },
      {
        key: 'itemDiscountPercent',
        label: 'ราคาส่วนลด (%)'
      },
      { key: 'itemDiscount', label: 'ส่วนลด (บาท)' },
      { key: 'itemAmount', label: 'รวมเงิน' }
    ])
    const receiptData = ref<Receipt>({
      receiptdetails: []
    })

    function formatDateForDisplay(date: Date): string {
      const dayNo = (date.getDate() + '').padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${dayNo}/${month}/${year}`
    }

    onMounted(async () => {
      loader?.setLoadingOn()
      receiptId.value = parseInt(route.params.receiptId.toString())
      const { data, statusCode } = await receiptApi.getOneReceipt(receiptId.value)
      if (statusCode === status.error) {
        toast?.error('เกิดข้อผิดพลาด', 'เซิฟเวอร์มีปัญหา')
      }
      receiptData.value = data as Receipt
      if (receiptData.value.receiptDate) {
        receiptData.value.receiptDate = formatDateForDisplay(
          new Date(receiptData.value.receiptDate)
        )
      }
      loader?.setLoadingOff()
    })

    return {
      receiptData,
      columnsData,
      option,
      date
    }
  }
})
</script>
