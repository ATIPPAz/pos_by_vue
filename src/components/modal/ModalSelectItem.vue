<template>
  <ModalDialog :open="open" @update:open="closeModal(-1)">
    <template #header>
      <p class="modal-title">เลือกสินค้า</p>
    </template>
    <template #body>
      <div v-if="allItems.length > 0" style="max-height: 150px; overflow-y: auto">
        <ul>
          <li
            v-for="(item, index) in allItems"
            :key="index"
            style="cursor: pointer"
            @click="selectItemInModal(index)"
            :class="selectedIndex === index ? { select: true, 'font-bold': true } : {}"
          >
            {{ item.itemName }}
          </li>
        </ul>
      </div>
      <div v-else>Nodata</div>
      <hr />
      <div style="padding: 0px 16px" v-if="itemSelect">
        <h1>item detail</h1>
        <p class="font-bold">รหัสสินค้า</p>
        <p>{{ itemSelect.itemCode }}</p>
        <br />
        <p class="font-bold">ชื่อสินค้า</p>
        <p>{{ itemSelect.itemName }}</p>
        <br />
        <p class="font-bold">ราคา</p>
        <p>{{ itemSelect.itemPrice }}</p>
      </div>
      <div v-else>No Item Selected</div>
    </template>
    <template #footer>
      <button @click="closeModal(-1)" class="gray" style="margin-right: 8px">close</button>
      <button @click="closeModal(itemSelect?.itemId)" class="blue">Select this item</button>
    </template>
  </ModalDialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import ModalDialog from '@/components/modal/ModalDialog.vue'
import type { IModalSelectItemOption } from '@/interface/modal/modalSelectItem'
import type { PropType } from 'vue'
import type { Item } from '@/interface/item'
import { computed } from 'vue'

export default defineComponent({
  components: { ModalDialog },
  props: {
    allItems: {
      type: Array as PropType<Item[]>,
      required: true
    }
    // option: { type: Object as PropType<IModalSelectItemOption>, required: true }
  },

  setup(props) {
    const open = ref(false)
    const selectedIndex = ref<number>(-1)
    let res: ((value: number | undefined | PromiseLike<number | undefined>) => void) | null

    const itemSelect = computed(() => {
      return selectedIndex.value >= 0 ? props.allItems[selectedIndex.value] : undefined
    })
    function selectItemInModal(itemIndex: number) {
      selectedIndex.value = itemIndex
    }
    function getItemSelectResult(itemId?: number) {
      open.value = true
      selectedIndex.value = props.allItems.findIndex((e) => e.itemId === itemId)
      return new Promise<number | undefined>((resolve) => {
        res = resolve
      })
    }
    function closeModal(itemId?: number) {
      selectedIndex.value = -1
      open.value = false
      if (res) {
        res(itemId)
        res = null
      }
    }
    return {
      selectItemInModal,
      itemSelect,
      getItemSelectResult,
      closeModal,
      selectedIndex,
      open
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
