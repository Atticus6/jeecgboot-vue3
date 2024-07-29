<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '977716431445377024',
      key: 'invoicecycnamestr',
      label: '运营区域',
      tableNmae: 'oneTimeIncomeReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
