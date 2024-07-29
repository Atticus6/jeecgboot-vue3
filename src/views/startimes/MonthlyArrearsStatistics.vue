<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '975976302309621760',
      key: 'invoicecycnamestr',
      label: '每月欠费统计',

      tableNmae: 'arrearageInfoReport',
    },
  ];
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :showColumnSetting="false" />
</template>
