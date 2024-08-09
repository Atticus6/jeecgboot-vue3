<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getYesterday, getToday } from './utils';
  const defalutSchema = ref({
    payStartDate: getYesterday(),
    payEndDate: getToday(),
  });
  // 客户用户缴费日报表
  const reports = [
    {
      reportId: '978151820089966592',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978158428220112896',
      key: 'payment_day',
      label: '统计日期',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['payStartDate', 'payEndDate'];
</script>

<template>
  <Page :reports="reports" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
