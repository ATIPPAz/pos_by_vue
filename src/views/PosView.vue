<template>
  <h1>ดูใบเสร็จรับเงิน</h1>
  <div style="margin-bottom: 14px">
    <label for="receiptCode">เลขที่เอกสาร:</label> <br />
    <input type="text" name="" disabled :value="receiptCode" />
    <br />
    <label for="">วันที่</label> <br />
    <input type="text" name="" disabled :value="receiptDate" />
  </div>
  <DataTable :column="columnsData" :data="receiptDetailsData" :option="option">
    <template #cell-itemCode="{ index, data }">
      <button class="gray" style="width: 100%; text-align: center" @click="openModal(index)">
        {{ data.itemCode }}
      </button>
    </template>
    <template #cell-itemName="{ data }">
      {{ data.itemName }}
    </template>
    <template #cell-unitName="{ data }">
      {{ data.unitName }}
    </template>
    <template #cell-itemQty="{ index }">
      <input type="number" min="0" v-model="receiptDetail[index].itemQty" />
    </template>
    <template #cell-itemPrice="{ data }">
      {{ data.itemPrice }}
    </template>
    <template #cell-itemDiscountPercent="{ index }">
      <input
        type="number"
        min="0"
        max="100"
        style="width: 95%"
        v-model="receiptDetail[index].itemDiscountPercent"
      />
    </template>
    <template #cell-itemDiscount="{ index }">
      {{ calDiscount(index) }}
    </template>
    <template #cell-itemAmount="{ index }">
      {{ calAmount(index) }}
    </template>

    <template #cell-idRowAction="data">
      <button @click="removeItemInReceipt(data)" class="red">ลบ</button>
    </template>
    <template v-slot:[`row-${receiptDetailsData.length-1}`]>
      <td style="padding: 16px">{{ receiptDetailsData.length }}</td>
      <td style="padding: 16px">
        <button
          style="width: 100%; text-align: center"
          @click="openModal(receiptDetailsData.length - 1)"
          class="blue"
        >
          เลือกสินค้า
        </button>
      </td>
      <td style="padding: 16px"></td>
      <td style="padding: 16px"></td>
      <td style="padding: 16px"><input disabled value="0" /></td>
      <td style="padding: 16px">0</td>
      <td style="padding: 16px"><input disabled value="0" /></td>
      <td style="padding: 16px"><input disabled value="0" /></td>
      <td style="padding: 16px">0</td>
      <td style="padding: 16px"><button disabled>ลบ</button></td>
    </template>
  </DataTable>
  <div class="j-end" style="margin-top: 14px">
    <table style="width: fit-content">
      <tbody>
        <tr>
          <td class="t-start">ยอดรวมสินค้าก่อนลด</td>
          <td><input type="number" :value="receiptTotalBeforeDiscount" disabled /><br /></td>
        </tr>
        <tr>
          <td class="t-start">ยอดรวมส่วนลดสินค้า</td>
          <td><input type="number" :value="receiptTotalDiscount" disabled /><br /></td>
        </tr>
        <tr>
          <td class="t-start">Subtotal</td>
          <td><input type="number" :value="receiptSubTotal" disabled /><br /></td>
        </tr>
        <tr>
          <td class="t-start">ส่วนลดการค้า</td>
          <td>
            <input
              type="number"
              v-model="receiptTradeDiscount"
              min="0"
              :disabled="!isValid"
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
              :value="receiptGrandTotal"
              disabled
            /><br />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top: 14px" class="j-end">
    <button
      @click="receiptModal?.openModal()"
      :class="!isValid ? {} : { yellow: true }"
      :style="!isValid ? { cursor: 'not-allowed' } : { cursor: 'pointer' }"
      style="margin-right: 8px"
      :disabled="!isValid"
    >
      ตัวอย่าง
    </button>
    <button
      @click="saveReceipt"
      :class="!isValid ? {} : { blue: true }"
      :style="!isValid ? { cursor: 'not-allowed' } : { cursor: 'pointer' }"
      :disabled="!isValid"
    >
      บันทึก
    </button>
  </div>
  <ModalSelectItem :all-items="itemModal" ref="modalSelectItem" />
  <ConfirmModal ref="confirmDialog" />
  <ReceiptModal ref="receiptModal" :receipt-data="receiptData" />
</template>

<script setup lang="ts">
import { DataTable } from '@/components/dataTable'
import { ModalSelectItem } from '@/components/modal'
import { useReceiptApi, useItemApi } from '@/composables/api'
import { ref, computed } from 'vue'
import type { Item } from '@/interface/item'
import type { ReceiptDetail } from '@/interface/receipt'
import type { IColumn, TableOption } from '@/interface/dataTable'
import { ConfirmModal } from '@/components/modal'
import { inject } from 'vue'
import { ReceiptModal } from '@/components/modal'
import { loaderPluginSymbol } from '@/plugins/loading'
import { onMounted } from 'vue'
import { statusCode as status } from '@/interface/api'
import { toastPluginSymbol } from '@/plugins/toast'

const confirmDialog = ref<InstanceType<typeof ConfirmModal>>()
const loader = inject(loaderPluginSymbol)
const toast = inject(toastPluginSymbol)
const receiptApi = useReceiptApi()
const itemApi = useItemApi()

const receiptModal = ref<InstanceType<typeof ReceiptModal>>()
const modalSelectItem = ref<InstanceType<typeof ModalSelectItem>>()

const option = ref<TableOption>({ actionLabel: 'ดำเนินการ' })
const itemModal = ref<Item[]>([])

const receiptDetail = ref<ReceiptDetail[]>([])
const receiptCode = ref('')
const receiptDate = ref(formatDateForDisplay(new Date()))

const receiptGrandTotal = computed(() => {
  return receiptSubTotal.value - receiptTradeDiscount.value
})
const receiptTradeDiscount = ref<number>(0)
const receiptTotalDiscount = computed(() => {
  let sum = 0
  for (let index = 0; index < receiptDetail.value.length; index++) {
    sum += calDiscount(index)
  }
  return sum
})
const receiptTotalBeforeDiscount = computed(() => {
  let sum = 0
  for (let index = 0; index < receiptDetail.value.length; index++) {
    sum += calAmount(index)
  }
  return sum
})
const receiptSubTotal = computed(() => {
  return receiptTotalBeforeDiscount.value - receiptTotalDiscount.value
})
const receiptData = computed(() => {
  const detail = receiptDetailsData.value.slice(0, -1).map((e) => ({ ...e }))
  detail.forEach((e, index) => {
    const amount = calAmount(index)
    const discount = calDiscount(index)
    e.itemAmount = amount
    e.itemDiscount = discount
  })
  return {
    receiptdetails: detail,
    receiptGrandTotal: receiptGrandTotal.value,
    receiptSubTotal: receiptSubTotal.value,
    receiptTotalBeforeDiscount: receiptTotalBeforeDiscount.value,
    receiptTotalDiscount: receiptTotalDiscount.value,
    receiptTradeDiscount: receiptTradeDiscount.value,
    receiptDate: receiptDate.value,
    receiptCode: receiptCode.value
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

async function getPrefix() {
  const { data } = await receiptApi.getPrefix()
  return data
}
async function setDefaultReceipt() {
  const prefix = await getPrefix()
  receiptCode.value = prefix?.prefix_keyName.padEnd(5, 'X') ?? ''
  receiptDetail.value = []
}
function formatDateForBackend(dateString: string): string {
  const date = dateString.split('/')
  return `${date[2]}-${date[1]}-${date[0]}`
}
async function openModal(index: number) {
  const idloader = crypto.randomUUID()
  loader?.setLoadingOn(idloader)
  const res = await itemApi.getItem()
  itemModal.value = res.data ?? []
  loader?.setLoadingOff(idloader)
  if (index === receiptDetailsData.value.length - 1) {
    const itemId = await modalSelectItem.value?.getItemSelectResult()
    if (itemId) {
      const item = itemModal.value.find((e) => e.itemId === itemId)!
      const selectedItem = {
        unitId: item.unitId ?? 0,
        unitName: item.unitName ?? '',
        itemId: item.itemId ?? 0,
        itemCode: item.itemCode ?? '',
        itemName: item.itemName ?? '',
        itemPrice: item.itemPrice ?? 0,
        itemAmount: 0,
        itemDiscount: 0,
        itemQty: 0,
        itemDiscountPercent: 0
      }

      receiptDetail.value.push(selectedItem)
    }
  } else {
    const itemId = await modalSelectItem.value?.getItemSelectResult(
      receiptDetailsData.value[index].itemId
    )
    if (itemId) {
      if (itemId !== receiptDetailsData.value[index].itemId) {
        const item = itemModal.value.find((e) => e.itemId === itemId)!
        const selectedItem = {
          unitId: item.unitId ?? 0,
          unitName: item.unitName ?? '',
          itemId: item.itemId ?? 0,
          itemCode: item.itemCode ?? '',
          itemName: item.itemName ?? '',
          itemPrice: item.itemPrice ?? 0,
          itemAmount: 0,
          itemDiscount: 0,
          itemQty: 0,
          itemDiscountPercent: 0
        }
        receiptDetail.value[index] = selectedItem
      }
    }
  }
}

async function removeItemInReceipt(data: { index: number }) {
  if (await confirmDialog.value?.getConfirmResult()) {
    if (receiptDetail.value) {
      receiptDetail.value.splice(data.index, 1)
    }
  }
}
function formatDateForDisplay(date: Date): string {
  const dayNo = (date.getDate() + '').padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${dayNo}/${month}/${year}`
}

async function saveReceipt() {
  const idloader = crypto.randomUUID()
  loader?.setLoadingOn(idloader)
  // const detail = receiptDetailsData.value.slice(0, -1)
  // detail.forEach((e, index) => {
  //   const amount = calAmount(index)
  //   const discount = calDiscount(index)
  //   e.itemAmount = amount
  //   e.itemDiscount = discount
  // })
  const { statusCode } = await receiptApi.createReceipt({
    receiptdetails: receiptData.value.receiptdetails,
    receiptGrandTotal: receiptGrandTotal.value,
    receiptSubTotal: receiptSubTotal.value,
    receiptTotalBeforeDiscount: receiptTotalBeforeDiscount.value,
    receiptTotalDiscount: receiptTotalDiscount.value,
    receiptTradeDiscount: receiptTradeDiscount.value,
    receiptDate: formatDateForBackend(receiptDate.value)
  })
  if (statusCode === status.createSuccess) {
    toast?.success('สำเร็จ', 'สร้างสินค้ารายการสั่งซื้อสำเร็จ')
    receiptDetail.value = []
    receiptTradeDiscount.value = 0
  } else {
    toast?.error('ไม่สำเร็จ', 'ไม่สามารถสร้างรายการซื้อสินค้าได้')
  }
  await setDefaultReceipt()
  loader?.setLoadingOff(idloader)
}

onMounted(async () => {
  const idloader = crypto.randomUUID()
  loader?.setLoadingOn(idloader)
  await setDefaultReceipt()
  loader?.setLoadingOff(idloader)
})
function calAmount(index: number) {
  const row = receiptDetail.value[index]
  return row.itemPrice * row.itemQty - calDiscount(index)
}
function calDiscount(index: number) {
  const row = receiptDetail.value[index]
  return (row.itemPrice * row.itemQty * row.itemDiscountPercent) / 100
}
const receiptDetailsData = computed(() => {
  const res = receiptDetail.value.slice()
  res.push({
    unitName: '',
    itemId: 0,
    itemCode: '',
    itemName: '',
    itemPrice: 0,
    itemAmount: 0,
    itemDiscount: 0,
    itemQty: 0,
    itemDiscountPercent: 0
  })
  return res
})
const isValid = computed(() => {
  const detail = receiptDetailsData.value.slice(0, -1)
  return detail.length > 0 && detail.every((e) => e.itemQty > 0)
})
</script>
