<script lang="ts" setup>
  import Page from './Page.vue';

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
</script>

<template>
  <Page :reports="reports" :to-fixed-num="2" />
</template>
