<template>
  <div>
    <md-table>
      <md-table-toolbar>
        <h1 class="md-title">Bitacora</h1>
      </md-table-toolbar>
      <ag-grid-vue
        style="width: 100%; height: 80vh"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :pagination="true"
        :paginationPageSize="15"
   
      >
      </ag-grid-vue>
    </md-table>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import ActivityLogService from "../../services/ActivityLogs/activityLogs.service";
import moment from "moment";

export default {
  name: "simple-table",
  components: {
    AgGridVue,
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    activityData: [],
    paginatedData: [],
    columnDefs: null,
    rowData: null,
  }),
  methods: {
    async getData() {
      await ActivityLogService.getAll().then((data) => (this.rowData = data));
    },
    updatePagination(page, pageSize, sort, sortOrder) {
      ("pagination has updated", page, pageSize, sort, sortOrder);
      return true;
    },
  },
  computed: {},
  created() {
    this.getData();
  },
  beforeMount() {
    this.columnDefs = [
      {
        headerName: "Fecha",
        field: "dateCreated",
        valueFormatter: dateFormatter,
        filter: true,
       
      },
      { headerName: "Usuario", field: "user", filter: true },
      { headerName: "Mensaje", field: "message", filter: true, flex: 1 },
    ];

    this.getData();
  },
};

window.dateFormatter = (params) => {
  return moment(params.value).format("DD-MM-YYYY - h:mm:ss a");
};
</script>
<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>
