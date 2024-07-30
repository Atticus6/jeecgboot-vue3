<script lang="ts" setup>
  import Page from './Page.vue';

  // 缴费月报表
  const reports = [
    {
      reportId: '977816581664751616',
      key: 'operareanamestr',
      label: '运莒区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978142246385565696',
      key: 'payment_month',
      label: '统计月份',
      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
