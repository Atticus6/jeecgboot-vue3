<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';

  const defaultSchema = ref({
    statisticalyear: new Date().getFullYear() + '',
  });

  const reports = [
    {
      reportId: '977785162464837632',
      key: 'operareaname',
      label: '年消费报表',
      tableNmae: 'annualConsumptionReport',
    },
  ];

  const timeKeys = ['statisticalyear'];
</script>

<template>
  <Page :reports="reports" :showColumnSetting="false" :toFixedNum="2" :timeKeys="timeKeys" :defalutSchema="defaultSchema" />
</template>
