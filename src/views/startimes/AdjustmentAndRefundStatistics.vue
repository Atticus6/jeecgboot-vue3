<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '976708152669847552',
      key: 'invoicecycnamestr',
      label: '调账补退统计',
      tableNmae: 'accountAdjustInfoReport',
    },
  ];
</script>

<template>
  <!-- wlt 该页面接口不同 需要重写 -->
  <Page :reports="reports" :showColumnSetting="false" />
</template>
