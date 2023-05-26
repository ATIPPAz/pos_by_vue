<template>
  <main>
    <div style="margin-bottom: 14px">
      <label for="receiptCode">เลขที่เอกสาร:</label> <br />
      <input type="text" name="" id="receiptCode" disabled :value="receiptData.receiptCode" />
      <br />
      <label for="">วันที่</label> <br />
      <input type="text" name="" id="dateNow" disabled :value="receiptData.receiptDate" />
    </div>
    <DataTable :column="header" :data="receiptDetailsData" :option="option">
      <template #cell-itemCode="data">
        <button v-if="!isView" class="gray" @click="openModal(data)">
          {{ data.data.itemCode }}
        </button>
        <template v-else>
          {{ data.data.itemCode }}
        </template>
      </template>
      <template #cell-itemName="{ data }">
        {{ data.itemName }}
      </template>
      <template #cell-unitName="{ data }">
        {{ data.unitName }}
      </template>
      <template #cell-itemQty="{ data }">
        <input v-if="!isView" :disabled="isView" type="number" min="0" v-model="data.itemQty" />
        <template v-else>{{ data.itemQty }}</template>
      </template>
      <template #cell-itemPrice="{ data }">
        {{ data.itemPrice }}
      </template>
      <template #cell-itemDiscountPercent="{ data }">
        <input
          v-if="!isView"
          :disabled="isView"
          type="number"
          min="0"
          max="100"
          style="width: 95%"
          v-model="data.itemDiscountPercent"
        />
        <template v-else>
          {{ data.itemDiscountPercent }}
        </template>
      </template>
      <template #cell-itemDiscount="{ data }">
        <input
          v-if="!isView"
          :disabled="isView"
          type="number"
          min="0"
          v-model="data.itemDiscount"
        />
        <template v-else>
          {{ data.itemDiscount }}
        </template>
      </template>
      <template #cell-itemAmount="{ data }">
        {{ data.itemAmount }}
      </template>

      <template #cell-idRowAction="data" v-if="!isView">
        <button @click="removeItemInReceipt(data)" class="red">ลบ</button>
      </template>
      <template #specialRow v-if="!isView">
        <tr>
          <td>{{ (receiptDetailsData?.length ?? 0) + 1 }}</td>
          <td><button @click="openModal()" class="blue">เลือกสินค้า</button></td>
          <td></td>
          <td></td>
          <td><input disabled value="0" /></td>
          <td>0</td>
          <td><input disabled value="0" /></td>
          <td><input disabled value="0" /></td>
          <td>0</td>
          <td><button disabled>ลบ</button></td>
        </tr>
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
                :disabled="isView"
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
    <div style="margin-top: 14px" class="j-end">
      <button @click="saveReceipt" class="blue" v-show="!isView">บันทึก</button>
    </div>
    <ModelDialog :open="modalOpen">
      <template #header>
        <span class="close" @click="closeModel"> &times; </span>
        <p class="modal-title">{{ titleModal }}</p>
      </template>
      <template #body>
        <div v-if="itemModel.length > 0" style="max-height: 150px; overflow-y: auto">
          <ul>
            <li
              v-for="item in itemModel"
              :key="item.itemId"
              style="cursor: pointer"
              @click="selectItemInModal(item)"
              :class="
                selectItemModel && selectItemModel.itemId === item.itemId ? 'select font-bold' : ''
              "
            >
              {{ item.itemName }}
            </li>
          </ul>
        </div>
        <div v-else>Nodata</div>
        <hr />
        <div style="padding: 0px 16px" v-if="selectItemModel !== null">
          <h1>item detail</h1>
          <p class="font-bold">รหัสสินค้า</p>
          <p>{{ selectItemModel.itemCode }}</p>
          <br />
          <p class="font-bold">ชื่อสินค้า</p>
          <p>{{ selectItemModel.itemName }}</p>
          <br />
          <p class="font-bold">ราคา</p>
          <p>{{ selectItemModel.itemPrice }}</p>
        </div>
        <div v-else>No Item Selected</div>
      </template>
      <template #footer>
        <button @click="closeModel" class="gray" style="margin-right: 8px">close</button>
        <button @click="saveChange" class="blue">Select this item</button>
      </template>
    </ModelDialog>
    <ConfirmModal ref="confirmDialog" :open="openConfirm" />
  </main>
</template>

<script lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue'
import ModelDialog from '@/components/modal/ModalDialog.vue'
import { useRoute } from 'vue-router'
import { useReceiptApi, useItemApi } from '@/composables/api'
import { ref, computed, watch, defineComponent } from 'vue'
import type { Item } from '@/interface/item.interface'
import type { Receipt } from '@/interface/receipt.interface'
import type { IColumn, TableOption } from '@/interface/dataTable.interface'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

import { inject } from 'vue'
import { loaderPluginSymbol } from '@/plugins/loading'
import { onMounted } from 'vue'
import { statusCode as status } from '@/interface/api'
import { toastPluginSymbol } from '@/plugins/toast'
export default defineComponent({
  components: { DataTable, ModelDialog, ConfirmModal },
  props: {
    isView: {
      type: Boolean,
      require: true
    }
  },

  setup(props) {
    const confirmDialog = ref<any>(null)
    const openConfirm = ref(false)
    const loader = inject(loaderPluginSymbol)
    const toast = inject(toastPluginSymbol)
    const route = useRoute()
    const receiptId = ref(-1)
    let itemSelectIndex = ref(-1)
    const date = ref<string>()
    const modalOpen = ref(false)
    const option = ref<TableOption>({ actionLabel: 'ดำเนินการ' })
    const titleModal = ref('เลือกสินค้า')
    const itemModel = ref<Item[]>([])
    const selectItemModel = ref<Item | null>(null)
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
      return (await useReceiptApi().getPrefix()).data
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
    async function openModal(emitData: any = null) {
      loader?.setLoadingOn()
      titleModal.value = 'เพิ่มสินค้า'
      itemSelectIndex.value = -1
      if (emitData !== null) {
        titleModal.value = 'แก้ไขสินค้า'
        selectItemModel.value = emitData.data
        itemSelectIndex.value = emitData.index
      }
      itemModel.value = (await useItemApi().getItem()).data ?? []
      modalOpen.value = true
      loader?.setLoadingOff()
    }
    function saveChange() {
      const selectedItem = {
        unitId: selectItemModel.value?.unitId ?? 0,
        unitName: selectItemModel.value?.unitName ?? '',
        itemId: selectItemModel.value?.itemId ?? 0,
        itemCode: selectItemModel.value?.itemCode ?? '',
        itemName: selectItemModel.value?.itemName ?? '',
        itemPrice: selectItemModel.value?.itemPrice ?? 0,
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
      selectItemModel.value = null
    }

    function selectItemInModal(item: Item) {
      if (selectItemModel.value === null || selectItemModel.value.itemId !== item.itemId) {
        selectItemModel.value = item
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
    function closeModel() {
      modalOpen.value = false
      selectItemModel.value = null
    }
    async function saveReceipt() {
      if (receiptData.value.receiptDate) {
        receiptData.value.receiptDate = formatDateForBackend(receiptData.value.receiptDate)
      }
      delete receiptData.value.receiptCode
      loader?.setLoadingOn()
      const { statusCode } = await useReceiptApi().createReceipt(receiptData.value)
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
      if (props.isView) {
        receiptId.value = parseInt(route.params.receiptId.toString())
        const { data, statusCode } = await useReceiptApi().getOneReceipt(receiptId.value)
        if (statusCode === status.error) {
          toast?.error('เกิดข้อผิดพลาด', 'เซิฟเวอร์มีปัญหา')
        }
        receiptData.value = data as Receipt
        if (receiptData.value.receiptDate) {
          receiptData.value.receiptDate = formatDateForDisplay(
            new Date(receiptData.value.receiptDate)
          )
        }
      }
      loader?.setLoadingOff()
    })
    ;(async () => {})()

    const receiptDetailsData = computed(() => {
      return receiptData.value.receiptdetails
    })

    if (!props.isView) {
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
            receiptData.value.receiptGrandTotal =
              (receiptData.value.receiptSubTotal ?? 0) - newValue
          } else {
            receiptData.value.receiptTradeDiscount = 0
            receiptData.value.receiptGrandTotal = 0
          }
        }
      )
    }

    return {
      removeItemInReceipt,
      openModal,
      selectItemInModal,
      saveChange,
      saveReceipt,
      closeModel,
      receiptDetailsData,
      selectItemModel,
      receiptData,
      titleModal,
      modalOpen,
      itemModel,
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
