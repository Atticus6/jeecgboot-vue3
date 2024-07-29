<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '977785162464837632',
      key: 'operareaid',
      label: '年消费报表',
      tableNmae: 'annualConsumptionReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" />
</template>
