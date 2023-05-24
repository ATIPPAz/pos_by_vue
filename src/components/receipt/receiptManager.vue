<template>
  <MainPage :title="title">
    <template #content>
      <div style="margin-bottom: 14px">
        <label for="receiptCode">เลขที่เอกสาร:</label> <br />
        <input type="text" name="" id="receiptCode" disabled :value="receiptData.receiptCode" />
        <br />
        <label for="">วันที่</label> <br />
        <input type="text" name="" id="dateNow" disabled :value="receiptData.receiptDate" />
      </div>
      <DataTable
        :column="header"
        :data="receiptDetailsData"
        :option="option"
        @buttonClick="openModelFunction"
      >
        <template #action="data" v-if="!isView">
          <button @click="removeItemInReceipt(data.data)">ลบ</button>
        </template>
        <template #specialRow v-if="!isView">
          <tr>
            <td>{{ (receiptDetailsData?.length ?? 0) + 1 }}</td>
            <td><button @click="openModelFunction()">เลือกสินค้า</button></td>
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
          <caption></caption>
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
        <button id="savePos" class="blue" v-show="!isView">บันทึก</button>
      </div>
      <ModelDialog
        :title="titleModel"
        @onSave="saveChange"
        :open="openModel"
        @onClose="openModel = false"
      >
        <template #content>
          <ul v-if="itemModel.length > 0">
            <li
              v-for="item in itemModel"
              :key="item.itemId"
              style="cursor: pointer"
              @click="selectItemInModal(item)"
              :class="selectItemModel && selectItemModel.itemId === item.itemId ? 'select' : ''"
            >
              {{ item.itemName }}
            </li>
          </ul>
          <div v-else>Nodata</div>
          <hr />
          <div v-if="selectItemModel !== null">
            <h1>item detail</h1>
            <p>รหัสสินค้า</p>
            <br />
            {{ selectItemModel.itemCode }}
            <br />
            <p>ชื่อสินค้า</p>
            <br />
            <p>{{ selectItemModel.itemName }}</p>
            <br />
            <p>ราคา</p>
            <br />
            <p>{{ selectItemModel.itemPrice }}</p>
          </div>
          <div v-else>No Item Selected</div>
        </template>
      </ModelDialog>
    </template>
  </MainPage>
</template>

<script lang="ts">
import MainPage from '@/components/mainFrame/MainFrame.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import ModelDialog from '@/components/model/ModelDialog.vue'
import { useRoute } from 'vue-router'
import { useReceiptApi, useItemApi } from '@/composables/api'
import { ref, computed, watch, defineComponent } from 'vue'
import type { Item } from '@/interface/item.interface'
import type { Receipt } from '@/interface/receipt.interface'
import type { IColumn, TableOption, ButtonClick } from '@/interface/dataTable.interface'

export default defineComponent({
  components: { MainPage, DataTable, ModelDialog },
  props: {
    title: {
      type: String,
      require: true
    },
    isView: {
      type: Boolean,
      require: true
    }
  },

  setup(props) {
    const route = useRoute()
    const receiptId = ref(-1)
    let itemSelectIndex = ref(-1)
    const date = ref<string>(formatDateForDisplay(new Date()))
    const receiptCode = ref<string>('TXXXX')
    const openModel = ref(false)
    const option = ref<TableOption>({ actionLabel: 'ดำเนินการ' })
    const titleModel = ref('เลือกสินค้า')
    const itemModel = ref<Item[]>([])
    const selectItemModel = ref<Item | null>(null)
    const header = ref<IColumn[]>([
      {
        key: 'itemCode',
        label: 'รหัสสินค้า',
        styleCol: {
          type: `${!props.isView ? 'button' : ''}`
        }
      },
      { key: 'itemName', label: 'ชื่อสินค้า' },
      { key: 'unitName', label: 'หน่วย' },
      {
        key: 'itemQty',
        label: 'จำนวน',
        styleCol: {
          type: `${!props.isView ? 'input:number' : ''}`
        }
      },
      { key: 'itemPrice', label: 'ราคา' },
      {
        key: 'itemDiscountPercent',
        label: 'ราคาส่วนลด (%)',
        styleCol: {
          type: `${!props.isView ? 'input:number' : ''}`,
          buttonCustom: {
            min: 0,
            max: 100
          }
        }
      },
      { key: 'itemDiscount', label: 'ส่วนลด (บาท)' },
      { key: 'itemAmount', label: 'รวมเงิน' }
    ])
    const receiptData = ref<Receipt>({
      receiptCode: receiptCode.value,
      receiptDate: date.value,
      receiptGrandTotal: 0,
      receiptTotalDiscount: 0,
      receiptSubTotal: 0,
      receiptTotalBeforeDiscount: 0,
      receiptTradeDiscount: 0,
      receiptdetails: []
    })

    function formatDateForBackend(dateString: string): string {
      const date = dateString.split('/')
      return `${date[2]}-${date[1]}-${date[0]}`
    }
    async function openModelFunction(emitData: ButtonClick | null = null) {
      titleModel.value = 'เพิ่มสินค้า'
      itemSelectIndex.value = -1
      if (emitData !== null) {
        titleModel.value = 'แก้ไขสินค้า'
        selectItemModel.value = emitData.row
        itemSelectIndex.value = emitData.index
      }
      itemModel.value = (await useItemApi().getItem()).data ?? []
      openModel.value = true
    }
    async function saveChange() {
      const selectedItem = {
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
      openModel.value = false
      selectItemModel.value = null
    }

    function selectItemInModal(item: Item) {
      if (selectItemModel.value === null || selectItemModel.value.itemId !== item.itemId) {
        selectItemModel.value = item
      }
    }
    function removeItemInReceipt(data: any) {
      if (receiptData.value.receiptdetails) {
        receiptData.value.receiptdetails.splice(data.index, 1)
      }
    }
    function formatDateForDisplay(date: Date): string {
      const dayNo = (date.getDate() + '').padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${dayNo}/${month}/${year}`
    }

    if (props.isView) {
      header.value.pop()
      receiptId.value = parseInt(route.params.receiptId.toString())
      ;(async () => {
        const { data } = await useReceiptApi().getOneReceipt(receiptId.value)
        receiptData.value = data as Receipt
        receiptData.value.receiptDate = formatDateForDisplay(
          new Date(receiptData.value.receiptDate)
        )
      })()
    }
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
          receiptData.value.receiptGrandTotal =
            receiptData.value.receiptTotalBeforeDiscount -
            (receiptData.value.receiptTradeDiscount ?? 0)
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
          }
        }
      )
    }

    return {
      removeItemInReceipt,
      openModelFunction,
      selectItemInModal,
      saveChange,
      receiptDetailsData,
      selectItemModel,
      receiptCode,
      receiptData,
      titleModel,
      openModel,
      itemModel,
      header,
      option,
      date
    }
  }
})
</script>

<style scoped>
.select {
  color: rgb(0, 71, 224);
}
</style>
