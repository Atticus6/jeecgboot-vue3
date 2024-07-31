<script lang="ts" setup>
  import Page from './Page.vue';

  // 业务受理日统计

  const reports = [
    {
      reportId: '978461769428975616',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
