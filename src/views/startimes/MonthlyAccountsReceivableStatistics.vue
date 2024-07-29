<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '975962116145889280',
      key: 'invoicecycnamestr',
      label: '每月应付',

      tableNmae: 'incomeQuery',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
