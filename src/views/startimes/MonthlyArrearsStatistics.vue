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
      reportId: '975976302309621760',
      key: 'invoicecycnamestr',
      label: '每月欠费统计',

      tableNmae: 'arrearageInfoReport',
    },
  ];

  const handleData = (data: any[]) => {
    console.log(data);

    return data.map((d) => {
      return {
        ...d,
        summoney: Number(d.summoney).toFixed(2),
      };
    });
  };

  const timeKeys = ['cycleStartDate', 'cycleEndDate'];
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :showColumnSetting="false" :timeKeys :defalutSchema="defalutSchema" :handleData="handleData" />
</template>
