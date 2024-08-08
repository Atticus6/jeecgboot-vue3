<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getYesterday } from './utils';
  const reports = [
    {
      reportId: '976385364197195776',
      key: 'operareanamestr',
      label: '运营区域',
      tableNmae: 'utf8',
    },
    {
      reportId: '976365521519591424',
      key: 'productnamestr',
      label: '产品名称',
      tableNmae: 'utf8',
    },
  ];
  const timeKeys = ['createstartdt', 'createenddt'];
  const defalutSchema = ref({
    createstartdt: getYesterday(),
  });
  console.log(defalutSchema);
</script>

<template>
  <Page :reports="reports" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
