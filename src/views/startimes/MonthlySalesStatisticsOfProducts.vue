<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getLastMonth, getThisMonth } from './utils';
  const defalutSchema = ref({
    startDate: getLastMonth(),
    endDate: getThisMonth(),
  });
  // 产品销售月统计

  const reports = [
    {
      reportId: '978465824020709376',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '978510326290792448',
      key: 'productnamestr',
      label: '产品名称',
      tableNmae: 'utf8',
    },
    {
      reportId: '978527207043186688',
      key: 'payment_mounth',
      label: '统计月份',
      tableNmae: 'utf8',
    },
    {
      reportId: '978527344796712960',
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
