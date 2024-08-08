<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    cycleStartDate: getLastMonth(),
  });
  const reports = [
    {
      reportId: '975962116145889280',
      key: 'invoicecycnamestr',
      label: '每月应付',

      tableNmae: 'incomeQuery',
    },
  ];

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :show-column-setting="false" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
