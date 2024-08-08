<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    cycleStartDate: getLastMonth(),
  });
  const reports = [
    {
      reportId: '976708152669847552',
      key: 'invoicecycnamestr',
      label: '调账补退统计',
      tableNmae: 'accountAdjustInfoReport',
    },
  ];

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <!-- wlt 该页面接口不同 需要重写 -->
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
