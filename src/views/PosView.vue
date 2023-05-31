<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title> <h1>ดูใบเสร็จรับเงิน</h1> </template>
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="receiptCode">เลขที่เอกสาร:</label> <br />
        <input type="text" name="" id="receiptCode" disabled :value="receiptData.receiptCode" />
        <br />
        <label for="">วันที่</label> <br />
        <input type="text" name="" id="dateNow" disabled :value="receiptData.receiptDate" />
      </div>
      <DataTable :column="header" :data="receiptDetailsData" :option="option">
        <template #cell-itemCode="{ index, data }">
          <button class="gray" @click="openModal(index)">
            {{ data.itemCode }}
          </button>
        </template>
        <template #cell-itemName="{ data }">
          {{ data.itemName }}
        </template>
        <template #cell-unitName="{ data }">
          {{ data.unitName }}
        </template>
        <template #cell-itemQty="{ data }">
          <input type="number" min="0" v-model="data.itemQty" />
        </template>
        <template #cell-itemPrice="{ data }">
          {{ data.itemPrice }}
        </template>
        <template #cell-itemDiscountPercent="{ data }">
          <input
            type="number"
            min="0"
            max="100"
            style="width: 95%"
            v-model="data.itemDiscountPercent"
          />
        </template>
        <template #cell-itemDiscount="{ data }">
          <input type="number" min="0" v-model="data.itemDiscount" />
        </template>
        <template #cell-itemAmount="{ data }">
          {{ data.itemAmount }}
        </template>

        <template #cell-idRowAction="data">
          <button @click="removeItemInReceipt(data)" class="red">ลบ</button>
        </template>
        <template #[`row-${receiptDetailsData.length-1}`]>
          <td style="padding: 16px">{{ receiptDetailsData.length }}</td>
          <td style="padding: 16px">
            <button @click="openModal(receiptDetailsData.length - 1)" class="blue">
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
                <input type="number" v-model="receiptData.receiptTradeDiscount" min="0" /><br />
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
      <div style="margin-top: 14px" class="j-end">
        <button @click="saveReceipt" class="blue">บันทึก</button>
      </div>
      <ModalSelectItem :all-items="itemModal" ref="modalSelectItem" />

      <ConfirmModal ref="confirmDialog" :open="openConfirm" />
    </template>
  </MainFrame>
</template>

<script lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue'
import ModalSelectItem from '@/components/modal/ModalSelectItem.vue'
import { useReceiptApi, useItemApi } from '@/composables/api'
import { ref, computed, watch, defineComponent } from 'vue'
import type { Item } from '@/interface/item'
import type { Receipt } from '@/interface/receipt'
import type { IColumn, TableOption } from '@/interface/dataTable'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import MainFrame from '@/components/layout/BasicLayout.vue'
import { inject } from 'vue'
import { loaderPluginSymbol } from '@/plugins/loading'
import { onMounted } from 'vue'
import { statusCode as status } from '@/interface/api'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  components: { DataTable, ModalSelectItem, ConfirmModal, MainFrame },

  setup() {
    const confirmDialog = ref<any>(null)
    const openConfirm = ref(false)
    const loader = inject(loaderPluginSymbol)
    const toast = inject(toastPluginSymbol)
    const receiptApi = useReceiptApi()
    const itemApi = useItemApi()
    const itemSelectIndex = ref(-1)
    const date = ref<string>()
    const modalSelectItem = ref<InstanceType<typeof ModalSelectItem>>()
    const modalOpen = ref(false)
    const option = ref<TableOption>({ actionLabel: 'ดำเนินการ' })
    const titleModal = ref('เลือกสินค้า')
    const itemModal = ref<Item[]>([])
    const selectItemModal = ref<Item | null>(null)
    const header = ref<IColumn[]>([
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
    async function getPrefix() {
      return (await receiptApi.getPrefix()).data
    }
    async function setDefaultReceipt() {
      const prefix = await getPrefix()
      receiptData.value = {
        receiptTradeDiscount: 0,
        receiptCode: prefix?.prefix_keyName.padEnd(5, 'X'),
        receiptDate: formatDateForDisplay(new Date()),
        receiptTotalDiscount: 0,
        receiptGrandTotal: 0,
        receiptdetails: [],
        receiptSubTotal: 0,
        receiptTotalBeforeDiscount: 0
      }
    }
    function formatDateForBackend(dateString: string): string {
      const date = dateString.split('/')
      return `${date[2]}-${date[1]}-${date[0]}`
    }
    async function openModal(index: number) {
      loader?.setLoadingOn()
      const res = await itemApi.getItem()
      itemModal.value = res.data ?? []
      loader?.setLoadingOff()
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
          receiptData.value.receiptdetails?.push(selectedItem)
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
            receiptData.value.receiptdetails[index] = selectedItem
          }
        }
      }
    }
    function saveChange() {
      const selectedItem = {
        unitId: selectItemModal.value?.unitId ?? 0,
        unitName: selectItemModal.value?.unitName ?? '',
        itemId: selectItemModal.value?.itemId ?? 0,
        itemCode: selectItemModal.value?.itemCode ?? '',
        itemName: selectItemModal.value?.itemName ?? '',
        itemPrice: selectItemModal.value?.itemPrice ?? 0,
        itemAmount: 0,
        itemDiscount: 0,
        itemQty: 0,
        itemDiscountPercent: 0
      }
      if (itemSelectIndex.value !== -1 && receiptData.value.receiptdetails) {
        receiptData.value.receiptdetails[itemSelectIndex.value] = selectedItem
      } else {
        receiptData.value.receiptdetails?.push(selectedItem)
      }
      modalOpen.value = false
      selectItemModal.value = null
    }

    function selectItemInModal(item: Item) {
      if (selectItemModal.value === null || selectItemModal.value.itemId !== item.itemId) {
        selectItemModal.value = item
      }
    }
    async function removeItemInReceipt(data: any) {
      openConfirm.value = true
      if (await confirmDialog.value.getConfirmResult()) {
        if (receiptData.value.receiptdetails) {
          receiptData.value.receiptdetails.splice(data.index, 1)
        }
      }
      openConfirm.value = false
    }
    function formatDateForDisplay(date: Date): string {
      const dayNo = (date.getDate() + '').padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${dayNo}/${month}/${year}`
    }
    function closeModal() {
      modalOpen.value = false
      selectItemModal.value = null
    }
    async function saveReceipt() {
      if (receiptData.value.receiptDate) {
        receiptData.value.receiptDate = formatDateForBackend(receiptData.value.receiptDate)
      }
      delete receiptData.value.receiptCode
      loader?.setLoadingOn()
      const { statusCode } = await receiptApi.createReceipt({
        ...receiptData.value,
        receiptDate: receiptData.value.receiptDate ?? '',
        receiptGrandTotal: receiptData.value.receiptGrandTotal ?? 0,
        receiptTotalBeforeDiscount: receiptData.value.receiptTotalBeforeDiscount ?? 0,
        receiptTotalDiscount: receiptData.value.receiptTotalDiscount ?? 0,
        receiptSubTotal: receiptData.value.receiptSubTotal ?? 0,
        receiptTradeDiscount: receiptData.value.receiptTradeDiscount ?? 0
      })
      if (statusCode === status.createSuccess) {
        toast?.success('สำเร็จ', 'สร้างสินค้ารายการสั่งซื้อสำเร็จ')
      } else {
        toast?.error('ไม่สำเร็จ', 'ไม่สามารถสร้างรายการซื้อสินค้าได้')
      }
      await setDefaultReceipt()
      loader?.setLoadingOff()
    }

    onMounted(async () => {
      loader?.setLoadingOn()
      await setDefaultReceipt()
      loader?.setLoadingOff()
    })
    ;(async () => {})()

    const receiptDetailsData = computed(() => {
      const res = receiptData.value.receiptdetails.slice()
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

    watch(
      () => receiptData.value.receiptdetails,
      (newValue, oldValue) => {
        let sum = 0
        let sumDiscount = 0
        newValue?.forEach((e) => {
          e.itemAmount = e.itemPrice * e.itemQty
          sum += e.itemAmount
          e.itemDiscount = (e.itemDiscountPercent / 100) * e.itemAmount
          sumDiscount += e.itemDiscount
          e.itemAmount -= e.itemDiscount
        })
        receiptData.value.receiptTotalBeforeDiscount = sum
        receiptData.value.receiptTotalDiscount = sumDiscount
        receiptData.value.receiptSubTotal =
          receiptData.value.receiptTotalBeforeDiscount - receiptData.value.receiptTotalDiscount
        if (
          receiptData.value.receiptTradeDiscount &&
          receiptData.value.receiptTradeDiscount > receiptData.value.receiptSubTotal
        ) {
          receiptData.value.receiptTradeDiscount = 0
        } else {
          receiptData.value.receiptGrandTotal =
            receiptData.value.receiptSubTotal - (receiptData.value.receiptTradeDiscount ?? 0)
        }
      },
      { deep: true }
    )
    watch(
      () => receiptData.value.receiptTradeDiscount,
      (newValue, oldValue) => {
        if (newValue && newValue >= 0 && newValue <= (receiptData.value.receiptSubTotal ?? 0)) {
          receiptData.value.receiptGrandTotal = (receiptData.value.receiptSubTotal ?? 0) - newValue
        } else {
          receiptData.value.receiptTradeDiscount = 0
          receiptData.value.receiptGrandTotal = 0
        }
      }
    )

    return {
      removeItemInReceipt,
      openModal,
      selectItemInModal,
      saveChange,
      saveReceipt,
      closeModal,
      modalSelectItem,
      receiptDetailsData,
      selectItemModal,
      receiptData,
      titleModal,
      modalOpen,
      itemModal,
      header,
      option,
      confirmDialog,
      openConfirm,
      date
    }
  }
})
</script>

<style scoped>
.select {
  color: rgb(0, 71, 224);
}
li {
  margin: 8px 0px;
}
</style>
