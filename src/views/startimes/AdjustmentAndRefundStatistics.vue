<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth, getThisMonth } from './utils';
  const defalutSchema = ref({
    cycleStartDate: getLastMonth(),
    cycleEndDate: getThisMonth(),
  });
  const reports = [
    {
      reportId: '976708152669847552',
      key: 'invoicecycnamestr',
      label: '调账补退统计',
      tableNmae: 'accountAdjustInfoReport',
    },
  ];

  const handleData = (data: any[]) => {
    console.log(data);

    return data.map((d) => {
      return {
        ...d,
        totalpay: Number(d.totalpay).toFixed(2),
        totalrefund: Math.abs(d.totalrefund).toFixed(2),
      };
    });
  };

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <!-- wlt 该页面接口不同 需要重写 -->
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" :handleData="handleData" />
</template>
