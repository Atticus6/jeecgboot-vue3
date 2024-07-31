<script lang="ts" setup>
  import Page from './Page.vue';

  // 产品销售月统计

  const reports = [
    {
      reportId: '978465824020709376',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
