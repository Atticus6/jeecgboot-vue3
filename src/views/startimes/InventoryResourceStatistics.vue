<script lang="ts" setup>
  import Page from './Page.vue';

  // 库存资源统计

  const reports = [
    {
      reportId: '978825898811539456',
      key: 'stocknamestr',
      label: '仓库名称',
      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" :mapList="[]" :showSum="false" />
</template>
