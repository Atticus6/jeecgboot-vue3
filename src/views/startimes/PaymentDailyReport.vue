<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { getYesterday } from './utils';
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
  });

  const timeKeys = ['payStartDate', 'payEndDate'];
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :defalutSchema="defalutSchema" :timeKeys="timeKeys" />
</template>
