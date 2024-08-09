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
      reportId: '977775105450786816',
      key: 'invoicecycnamestr',
      label: '实际收入统计',
      tableNmae: 'realIncomeReport',
    },
  ];
  const timeKeys = ['cycleStartDate', 'cycleEndDate'];

  const handleData = (data: any[]) => {
    console.log(data);

    return data.map((d) => {
      return {
        ...d,
        summoney: Number(d.summoney).toFixed(2),
      };
    });
  };
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" :handleData="handleData" />
</template>
