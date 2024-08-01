<script lang="ts" setup>
  import Page from './components/Page.vue';

  const reports = [
    {
      reportId: '977782879769411584',
      key: 'operareaname',
      label: '月消费报表',
      tableNmae: 'monthlyConsumptionReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" />
</template>
