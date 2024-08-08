<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    cycleStartDate: getLastMonth(),
  });
  const reports = [
    {
      reportId: '977716431445377024',
      key: 'invoicecycnamestr',
      label: '运营区域',
      tableNmae: 'oneTimeIncomeReport',
    },
  ];

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
