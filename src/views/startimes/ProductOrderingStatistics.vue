<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getYesterday, getToday } from './utils';
  const defalutSchema = ref({
    createstartdt: getYesterday(),
    createenddt: getToday(),
  });
  const reports = [
    {
      reportId: '976615750844104704',
      key: 'operareanamestr',
      label: '运营区域',

      tableNmae: 'utf8',
    },
    {
      reportId: '976366834009587712',
      key: 'productnamestr',
      label: '产品名称',

      tableNmae: 'utf8',
    },
    {
      reportId: '977781599823020032',
      key: 'productchildtypeid',
      label: '产品类型',

      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['createstartdt', 'createenddt'];
</script>

<template>
  <Page :reports="reports" :timeKeys="timeKeys" :defalutSchema="defalutSchema" />
</template>
