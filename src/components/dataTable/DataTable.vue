<template>
  <div>
    <table class="dataTable">
      <!-- <caption></caption> -->
      <thead>
        <tr>
          <!-- <th v-if="option.rowNumber === undefined || option.rowNumber">No.</th> -->
          <!-- a = {width:30px} -->
          <th :style="col.style || {}" v-for="col in columnInfos" :key="col.key">
            {{ col.label }}
          </th>
          <!-- <th v-if="hasActionSlot">{{ option.actionLabel }}</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in dataTable" :key="index">
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
          <!-- <td v-if="option.rowNumber === undefined || option.rowNumber">{{ index + 1 }}</td> -->
          <!-- <td v-for="col in columnInfos" :key="col.key">
            <div v-if="col.styleCol && col.styleCol.type === 'input:text'">
              <input
                type="text"
                :style="!!col.styleCol.style ? { ...col.styleCol.style } : ''"
                :class="col.styleCol.class"
                v-model="row[col.key]"
                :disabled="col.styleCol.disabled"
              />
            </div>
            <div v-else-if="col.styleCol && col.styleCol.type === 'input:number'">
              <input
                type="number"
                v-model="row[col.key]"
                :style="!!col.styleCol.style ? { ...col.styleCol.style } : ''"
                :class="col.styleCol.class"
                :min="col.styleCol.inputNumberProps?.min"
                :max="col.styleCol.inputNumberProps?.max"
                :disabled="col.styleCol.disabled"
              />
            </div>
            <div v-else-if="col.styleCol && col.styleCol.type === 'button'">
              <button
                @click="$emit('buttonClick', { data: row, index })"
                :disabled="col.styleCol.disabled"
                :class="col.styleCol.class"
                :style="!!col.styleCol.style ? { ...col.styleCol.style } : ''"
              >
                {{ row[col.key] }}
              </button>
            </div>
            <div v-else>
              {{ row[col.key] }}
            </div>
          </td>
          <td v-if="hasActionSlot">
            <slot name="action" :data="{ data: row, index }"></slot>
          </td> -->
        </tr>
        <slot name="specialRow"></slot>
        <tr v-show="!hasSpecialRow && dataTable.length <= 0">
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
import type { IColumn, TableOption } from '@/interface/dataTable.interface'

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
    const hasSpecialRow = computed(() => {
      return !!ctx.slots.specialRow
    })
    onMounted(() => {})
    return {
      hasSpecialRow,
      dataTable,
      idRowAction,
      idRowNumber,
      hasActionSlot,
      columnInfos
    }
  }
})
</script>

<style scope>
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
