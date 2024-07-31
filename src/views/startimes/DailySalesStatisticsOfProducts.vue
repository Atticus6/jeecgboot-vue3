<script lang="ts" setup>
  import Page from './Page.vue';

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
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" />
</template>
