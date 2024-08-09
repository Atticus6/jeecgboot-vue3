<script lang="ts" setup>
  import Page from './components/Page.vue';
  import { ref } from 'vue';
  import { getThisMonth } from './utils';
  import { selects } from './components/modules.data';
  const defalutSchema = ref({
    startcomedt: getThisMonth(),
    endcomedt: getThisMonth(),
  });
  // 库存资源统计

  const reports = [
    {
      reportId: '978825898811539456',
      key: 'stocknamestr',
      label: '仓库名称',
      tableNmae: 'utf8',
    },
  ];

  const timeKeys = ['startcomedt', 'endcomedt'];

  const handleData = (data: any[]): any[] => {
    const stockstatusidOptions = selects.stockstatusid.options;
    const phyresourcestatusidOptions = selects.phyresourcestatusid.options;

    return data.map((d) => {
      return {
        ...d,
        stockstatusid: stockstatusidOptions.find((s) => s.id === d.stockstatusid)?.name || d.stockstatusid,
        phyresourcestatusid: phyresourcestatusidOptions.find((p) => p.id === d.phyresourcestatusid)?.name || d.phyresourcestatusid,
      };
    });
  };
</script>

<template>
  <Page :reports="reports" :mapList="[]" :showSum="false" :timeKeys="timeKeys" :defalutSchema="defalutSchema" :handleData="handleData" />
</template>
