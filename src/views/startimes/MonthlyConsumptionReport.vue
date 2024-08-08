<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    statisticalmonth: getLastMonth(),
  });
  const reports = [
    {
      reportId: '977782879769411584',
      key: 'operareaname',
      label: '月消费报表',
      tableNmae: 'monthlyConsumptionReport',
    },
  ];
  const timeKeys = ['statisticalmonth'];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
