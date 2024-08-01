<script lang="ts" setup>
  import Page from './components/Page.vue';

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
  <Page :reports="reports" :to-fixed-num="2" :show-column-setting="false" />
</template>
