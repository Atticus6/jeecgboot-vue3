<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  const defalutSchema = ref({
    statisticalmonth: getLastMonth(),
  });
  const reports = [
    {
      reportId: '977782879769411584',
      key: 'operareaname',
      label: '月消费报表',
      tableNmae: 'monthlyConsumptionReport',
    },
  ];
  const timeKeys = ['statisticalmonth'];
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
