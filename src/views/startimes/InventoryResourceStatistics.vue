<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getThisMonth } from './utils';
  const defalutSchema = ref({
    startcomedt: getThisMonth(),
    endcomedt: getThisMonth(),
  });
  // 库存资源统计

  const reports = [
    {
      reportId: '978825898811539456',
      key: 'stocknamestr',
      label: '仓库名称',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['startcomedt', 'endcomedt'];
</script>

<template>
  <Page :reports="reports" :mapList="[]" :showSum="false" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
