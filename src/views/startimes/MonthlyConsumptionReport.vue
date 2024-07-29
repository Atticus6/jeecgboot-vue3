<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '977785162464837632',
      key: 'operareaname',
      label: '月消费报表',
      tableNmae: 'operareaid',
    },
  ];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" />
</template>
