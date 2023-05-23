<template>
  <MainPage :title="title">
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="receiptCode">เลขที่เอกสาร:</label> <br />
        <input type="text" name="" id="receiptCode" disabled v-model="receiptCode" />
        <br />
        <label for="">วันที่</label> <br />
        <input type="text" name="" id="dateNow" disabled v-model="date" />
      </div>

      <DataTable :column="header" :data="receiptDetailsData" :option="option">
        <template #action> </template>
      </DataTable>
      <div class="j-end" style="margin-top: 14px">
        <table style="width: fit-content">
          <caption></caption>
          <tbody>
            <tr>
              <td class="t-start">ยอดรวมสินค้าก่อนลด</td>
              <td>
                <input type="number" name="" id="totalBeforDiscount" value="0" disabled /><br />
              </td>
            </tr>
            <tr>
              <td class="t-start">ยอดรวมส่วนลดสินค้า</td>
              <td><input type="number" name="" id="totalDiscount" value="0" disabled /><br /></td>
            </tr>
            <tr>
              <td class="t-start">Subtotal</td>
              <td><input type="number" name="" id="subTotal" value="0" disabled /><br /></td>
            </tr>
            <tr>
              <td class="t-start">ส่วนลดการค้า</td>
              <td>
                <input
                  type="number"
                  :disabled="isView"
                  name=""
                  id="tradeDiscount"
                  value="0"
                  min="0"
                /><br />
              </td>
            </tr>
            <tr>
              <td class="t-start">Grand total</td>
              <td><input type="number" name="" id="grandTotal" value="0" disabled /><br /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top: 14px" class="j-end">
        <button id="savePos" class="blue" v-show="!isView">บันทึก</button>
      </div>
    </template>
  </MainPage>
</template>
<script lang="ts">
import MainPage from '@/components/shared/PageDesign.vue'
import DataTable, { type IColumn, type TableOption } from '@/components/shared/TableComponent.vue'
import router from '@/router'
import { ref } from 'vue'
export default {
  components: { MainPage, DataTable },
  props: {
    title: {
      type: String,
      require: true
    },
    isView: {
      type: Boolean,
      require: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    const date = ref<string>(formatDateForDisplay(new Date()))
    const receiptCode = ref<string>('TXXXX')
    const header = ref<IColumn[]>([
      {
        key: 'receiptCode',
        label: 'รหัสสินค้า',
        styleCol: { type: 'input:text', disabled: true }
      },
      { key: 'receiptDate', label: 'ชื่อสินค้า' },
      { key: 'receiptGrandTotal', label: 'หน่วย' },
      { key: 'receiptDate', label: 'จำนวน' },
      { key: 'receiptDate', label: 'ราคาส่วนลด (%)' },
      { key: 'receiptDate', label: 'ส่วนลด (บาท)' },
      { key: 'receiptDate', label: 'รวมเงิน' }
    ])
    const receiptDetailsData = ref([])
    const receiptId = ref<number>(router.params.receiptId)
    const option = ref<TableOption>({ actionLabel: '' })
    function formatDateForBackend(dateString: string): string {
      const date = dateString.split('/')
      return `${date[2]}-${date[1]}-${date[0]}`
    }
    function formatDateForDisplay(date: Date): string {
      const dayNo = (date.getDate() + '').padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${dayNo}/${month}/${year}`
    }

    return {
      date,
      header,
      receiptDetailsData,
      option,
      receiptCode
    }
  }
}
</script>
