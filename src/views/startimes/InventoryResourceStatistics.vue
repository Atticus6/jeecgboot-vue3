<script lang="ts" setup>
  import Page from './Page.vue';

  // 库存资源统计

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
