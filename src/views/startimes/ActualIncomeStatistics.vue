<script lang="ts" setup>
  import Page from './components/Page.vue';

  const reports = [
    {
      reportId: '977775105450786816',
      key: 'invoicecycnamestr',
      label: '实际收入统计',
      tableNmae: 'realIncomeReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" />
</template>
