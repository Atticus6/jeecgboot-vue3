<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getYesterday, getToday } from './utils';
  const defalutSchema = ref({
    startDate: getYesterday(),
    endDate: getToday(),
  });
  // 产品销售日统计

  const reports = [
    {
      reportId: '978466409734291456',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978510362047234048',
      key: 'productnamestr',
      label: '产品名称',
      tableNmae: 'utf8',
    },
    {
      reportId: '978528884487962624',
      key: 'payment_day',
      label: '统计日期',
      tableNmae: 'utf8',
    },
    {
      reportId: '978529036934135808',
      key: 'salechannelnamestr',
      label: '受理渠道',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['startDate', 'endDate'];

  const handleData = (data: any[]) => {
    console.log(data);

    return data.map((d) => {
      return {
        ...d,
        sum_factfee: Number(d.sum_factfee).toFixed(2),
      };
    });
  };
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" :timeKeys="timeKeys" :defalutSchema="defalutSchema" :handleData="handleData" />
</template>
