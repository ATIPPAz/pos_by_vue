<script>
export default {
  props: ['data', 'header', 'action'],
  setup() {
    return {}
  }
}
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th>No.</th>
          <th v-if="header">
            <div v-for="head in header" :key="head">
              {{ head }}
            </div>
          </th>
          <th v-else v-for="head in Object.keys(data[0])" :key="head">
            {{ head }}
          </th>
          <th v-if="action">action</th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr v-for="(row, index) in data" :key="index">
          <td>{{ index + 1 }}</td>
          <td v-for="cell in row" :key="cell">{{ cell }}</td>
          <td v-if="action">
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
  width: 100%;
  border: 1px solid rgb(196, 196, 196);
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  border-spacing: 0;
}
table.dataTable td,
table.dataTable th {
  border-bottom: 1px solid rgb(196, 196, 196);
  padding: 4px;
}
table.dataTable :not(:first-child) {
  border-left: 1px solid rgb(196, 196, 196);
}
/* table.dataTable td:first-child {
  text-align: center;
} */
table.dataTable th {
  text-align: left;
}
table.dataTable tr:last-child > td {
  border-bottom: none;
}
table.dataTable:hover {
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
</style>
