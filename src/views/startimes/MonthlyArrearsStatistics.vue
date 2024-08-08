<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    cycleStartDate: getLastMonth(),
  });
  const reports = [
    {
      reportId: '975976302309621760',
      key: 'invoicecycnamestr',
      label: '每月欠费统计',

      tableNmae: 'arrearageInfoReport',
    },
  ];

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :showColumnSetting="false" :timeKeys :defalutSchema="defalutSchema" />
</template>
