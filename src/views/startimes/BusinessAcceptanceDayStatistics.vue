<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getToday, getYesterday } from './utils';
  // 业务受理日统计

  const reports = [
    {
      reportId: '978461769428975616',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978510300768452608',
      key: 'payment_day',
      label: '统计日期',
      tableNmae: 'utf8',
    },
    {
      reportId: '978532110524301312',
      key: 'operitemtypenamestr',
      label: '营业项目类型',
      tableNmae: 'utf8',
    },
    {
      reportId: '978532239838887936',
      key: 'operitemenamestr',
      label: '营业项目',
      tableNmae: 'utf8',
    },

    {
      reportId: '978532258792947712',
      key: 'salechannelnamestr',
      label: '受理渠道',
      tableNmae: 'utf8',
    },
    {
      reportId: '978532267219304448',
      key: 'businessnamestr',
      label: '业务名称',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['acceptStartDate', 'acceptEndDate'];
  const defaultSchema = ref({
    acceptStartDate: getYesterday(),
    acceptEndDate: getToday(),
  });
</script>

<template>
  <Page :reports="reports" :timeKeys="timeKeys" :defalutSchema="defaultSchema" />
</template>
