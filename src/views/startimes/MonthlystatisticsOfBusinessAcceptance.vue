<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth } from './utils';
  // 业务受理月统计

  const reports = [
    {
      reportId: '978449808221880320',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978509747451674624',
      key: 'payment_month',
      label: '统计月份',
      tableNmae: 'utf8',
    },
    {
      reportId: '978517356510527488',
      key: 'operitemenamestr',
      label: '营业项目',
      tableNmae: 'utf8',
    },
    {
      reportId: '978519916684328960',
      key: 'salechannelnamestr',
      label: '受理渠道',
      tableNmae: 'utf8',
    },
    {
      reportId: '978520871563771904',
      key: 'businessnamestr',
      label: '业务类型',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['acceptStartDate', 'acceptEndDate'];
  const defaultSchema = ref({
    acceptStartDate: getLastMonth(),
  });
</script>

<template>
  <Page :reports="reports" :timeKeys="timeKeys" :defalutSchema="defaultSchema" />
</template>
