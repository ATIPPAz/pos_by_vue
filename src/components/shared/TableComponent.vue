<script lang="ts">
import { computed, onMounted } from 'vue'
export default {
  props: ['data', 'header'],
  setup(props, ctx) {
    const hasHeader = computed(() => {
      return !!props.header
    })
    const hasData = computed(() => {
      return !!props.data
    })
    const getKeyObject = computed(() => {
      return Object.keys(props.data.length > 0 ? props.data[0] : { id: 1 })
    })
    const hasAction = computed(() => {
      return !!ctx.slots.action
    })
    onMounted(() => {})
    return {
      hasHeader,
      hasData,
      getKeyObject,
      hasAction
    }
  }
}
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr v-if="hasHeader">
          <th v-show="!!header" v-for="_head in header" :key="_head">
            {{ _head }}
          </th>
        </tr>
        <tr v-else>
          <th>No.</th>
          <th v-show="data" v-for="head in getKeyObject" :key="head">
            {{ head }}
          </th>
          <th v-if="hasAction">action</th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr v-for="(row, index) in data" :key="index">
          <td>{{ index + 1 }}</td>
          <td v-for="cell in row" :key="cell">{{ cell }}</td>
          <td v-if="hasAction">
            <slot name="action" :data="row"></slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <th colspan="2">
            <div
              style="
                display: flex;
                font-size: 48px;
                font-weight: bold;
                margin: auto;
                color: #adadad;
              "
            >
              No data
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
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
