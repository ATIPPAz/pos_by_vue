<template>
  <div style="margin-bottom: 14px">
    <label for="receiptCode">เลขที่เอกสาร:</label> <br />
    <input type="text" name="" id="receiptCode" disabled :value="receiptData.receiptCode" />
    <br />
    <label for="">วันที่</label> <br />
    <input type="text" name="" id="dateNow" disabled :value="receiptData.receiptDate" />
  </div>
  <DataTable :column="columnsData" :data="receiptData.receiptdetails">
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
            <input type="number" :value="receiptData.receiptTotalBeforeDiscount" disabled /><br />
          </td>
        </tr>
        <tr>
          <td class="t-start">ยอดรวมส่วนลดสินค้า</td>
          <td><input type="number" :value="receiptData.receiptTotalDiscount" disabled /><br /></td>
        </tr>
        <tr>
          <td class="t-start">Subtotal</td>
          <td><input type="number" :value="receiptData.receiptSubTotal" disabled /><br /></td>
        </tr>
        <tr>
          <td class="t-start">ส่วนลดการค้า</td>
          <td>
            <input type="number" disabled :value="receiptData.receiptTradeDiscount" min="0" /><br />
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

<script lang="ts" setup>
import DataTable from '@/components/dataTable/DataTable.vue'
import { ref } from 'vue'
import type { ReceiptForm } from '@/interface/receipt'
import type { IColumn } from '@/interface/dataTable'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  receiptProp: {
    type: Object as PropType<ReceiptForm>,
    required: true
  }
})

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

const receiptData = computed(() => {
  const res = props.receiptProp
  let date = new Date(res.receiptDate)
  if (date.toString() == 'Invalid Date') {
    res.receiptDate = formatDateForDisplay(res.receiptDate)
  } else {
    res.receiptDate = formatDateForDisplay(date)
  }
  return res
})
function formatDateForDisplay(date: Date | string): string {
  if (typeof date === typeof '') {
    return date.toString()
  }
  const dateTime = date as Date
  const dayNo = (dateTime.getDate() + '').padStart(2, '0')
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0')
  const year = dateTime.getFullYear()
  return `${dayNo}/${month}/${year}`
}
</script>
