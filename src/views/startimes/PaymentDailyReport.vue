<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { getYesterday, getToday } from './utils';
  import { ref } from 'vue';

  // 缴费日报表
  const reports = [
    {
      reportId: '978146687062982656',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978148276964245504',
      key: 'payment_day',
      label: '统计日期',
      tableNmae: 'utf8',
    },
  ];

  const defalutSchema = ref({
    payStartDate: getYesterday(),
    payEndDate: getToday(),
  });

  const timeKeys = ['payStartDate', 'payEndDate'];

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

  const sortFn = (data: any[], reportKey: string) => {
    if (reportKey === 'payment_day') {
      data.sort((a, b) => b.payment_day.localeCompare(a.payment_day));
      return data;
    } else {
      return data;
    }
  };
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :defalutSchema="defalutSchema" :timeKeys="timeKeys" :handleData="handleData" :sortFn="sortFn" />
</template>
