<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th :style="col.style || {}" v-for="col in columnInfos" :key="col.key">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          style="cursor: pointer"
          @click="$emit('update:selectIndexRow', index)"
          v-for="(row, index) in dataTable"
          :key="index"
          :class="
            selectIndexRow >= 0
              ? selectIndexRow === index
                ? { 'f-blue': true }
                : { 'f-black': true }
              : {}
          "
        >
          <slot :name="`row-${index}`">
            <td v-for="col in columnInfos" :key="col.key">
              <template v-if="col.key === idRowNumber">
                {{ index + 1 }}
              </template>
              <template v-else-if="col.key === idRowAction">
                <slot :name="`cell-${idRowAction}`" :data="row" :index="index" />
              </template>
              <template v-else>
                <slot :name="`cell-${col.key}`" :data="row" :index="index" />
              </template>
            </td>
          </slot>
        </tr>
       <tr v-show="dataTable.length <= 0">
          
	  <th :colspan="column?.length ? column.length + 2 : 99">
            <div style="font-size: 48px; font-weight: bold; color: #adadad">No data</div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { IColumn, TableOption } from '@/interface/dataTable'
const idRowNumber = 'idRowNumber'
const idRowAction = 'idRowAction'
export default defineComponent({
  props: {
    column: {
      type: Array as PropType<IColumn[]>,
      required: true,
      default: () => []
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    selectIndexRow: {
      type: Number,
      default: -1
    },
    option: {
      type: Object as PropType<TableOption>,
      default: () => {
        return {
          pagination: 10,
          rowNumber: true,
          actionLabel: 'action'
        }
      }
    }
  },
  emits: {
    'update:selectIndexRow'(value: any) {
      return true
    }
  },
  setup(props, ctx) {
    const columnInfos = computed(() => {
      const columnInfos: IColumn[] = []
      if (props.option.rowNumber || props.option.rowNumber === undefined) {
        columnInfos.push({ key: idRowNumber, label: 'No.' })
      }
      for (const col of props.column) {
        columnInfos.push(col)
      }
      if (hasActionSlot.value) {
        columnInfos.push({ key: idRowAction, label: props.option.actionLabel ?? 'action' })
      }
      return columnInfos
    })

    const dataTable = computed(() => {
      return props.data
    })
    const hasActionSlot = computed(() => {
      return !!ctx.slots['cell-idRowAction']
    })

    return {
      dataTable,
      idRowAction,
      idRowNumber,
      hasActionSlot,
      columnInfos
    }
  }
})
</script>

<style scoped>
table.dataTable {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
table.dataTable thead tr {
  background-color: #cf0000;
  color: #ffffff;
  text-align: left;
}

table.dataTable th,
table.dataTable td {
  padding: 12px 15px;
}
table.dataTable tbody tr {
  border-bottom: 1px solid #dddddd;
}

table.dataTable tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
table.dataTable tbody tr:nth-of-type(even):hover {
  background-color: #d3d3d3;
}
table.dataTable tbody tr:hover {
  background-color: #eeeeee;
}
table.dataTable tbody tr:last-of-type {
  border-bottom: 2px solid #cf0000;
}

table.dataTable tbody tr.active-row {
  font-weight: bold;
  color: #cf0000;
}
</style>
