<template>
  <div>
    <table class="dataTable">
      <caption></caption>
      <thead>
        <tr>
          <th v-if="option.rowNumber === undefined || option.rowNumber">No.</th>
          <th :style="col.size ? `width:${col.size}` : ''" v-for="col in column" :key="col.key">
            {{ col.label }}
          </th>
          <th v-if="hasActionSlot">{{ option.actionLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in dataTable" :key="index">
          <td v-if="option.rowNumber === undefined || option.rowNumber">{{ index + 1 }}</td>
          <td v-for="col in column" :key="col.key">
            <div v-if="col.styleCol && col.styleCol.type === 'input:text'">
              <input
                type="text"
                :style="col.styleCol.style"
                v-model="row[col.key]"
                :disabled="col.styleCol.disabled"
              />
            </div>
            <div v-else-if="col.styleCol && col.styleCol.type === 'input:number'">
              <input
                type="number"
                :style="col.styleCol.style"
                v-model="row[col.key]"
                :min="col.styleCol.buttonCustom?.min"
                :max="col.styleCol.buttonCustom?.max"
                :disabled="col.styleCol.disabled"
              />
            </div>
            <div v-else-if="col.styleCol && col.styleCol.type === 'button'">
              <button
                :style="col.styleCol.style"
                @click="$emit('buttonClick', { row, index })"
                :disabled="col.styleCol.disabled"
              >
                {{ row[col.key] }}
              </button>
            </div>
            <div v-else>
              {{ row[col.key] }}
            </div>
          </td>
          <td v-if="hasActionSlot">
            <slot name="action" :data="{ row, index }"></slot>
          </td>
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
export default defineComponent({
  props: {
    column: {
      type: Array as PropType<IColumn[]>
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
    const dataTable = computed(() => {
      return props.data
    })
    const hasActionSlot = computed(() => {
      return !!ctx.slots.action
    })
    const hasSpecialRow = computed(() => {
      return !!ctx.slots.specialRow
    })
    onMounted(() => {})
    return {
      hasSpecialRow,
      dataTable,
      hasActionSlot
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
