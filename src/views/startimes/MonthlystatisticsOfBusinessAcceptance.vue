<script lang="ts" setup>
  import Page from './Page.vue';

  // 业务受理月统计

  const reports = [
    {
      reportId: '976385364197195776',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
