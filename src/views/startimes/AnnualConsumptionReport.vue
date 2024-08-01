<script lang="ts" setup>
  import Page from './components/Page.vue';

  const reports = [
    {
      reportId: '977785162464837632',
      key: 'operareaname',
      label: '年消费报表',
      tableNmae: 'annualConsumptionReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" />
</template>
