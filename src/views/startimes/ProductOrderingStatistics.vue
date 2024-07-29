<script lang="ts" setup>
  import Page from './Page.vue';

  const reports = [
    {
      reportId: '976366834009587712',
      key: 'productnamestr',
      label: '产品名称',

      tableNmae: 'utf8',
    },
    {
      reportId: '976615750844104704',
      key: 'operareanamestr',
      label: '运营区域',

      tableNmae: 'utf8',
    },
  ];
</script>

<template>
  <Page :reports="reports" />
</template>
