<script lang="ts" setup>
  import Page from './Page.vue';

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
</script>

<template>
  <Page :reports="reports" />
</template>
