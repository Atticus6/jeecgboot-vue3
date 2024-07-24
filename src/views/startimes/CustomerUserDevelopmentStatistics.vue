<template>
  <BasicTable :columns="columns" :data-source="data" :loading="loading" :pagination="false" :bordered="true" :canResize="true">
    <template v-if="inputItems.length !== 0" #headerTop>
      <BasicForm :schemas="schemas" :labelWidth="70" @submit="handleSearch" :showResetButton="false" />
    </template>
    <template #toolbar>
      <div></div>
    </template>
  </BasicTable>

  <div class="pag">
    <Pagination
      :current="state.pageNo"
      :total="state.count"
      :page-size="state.pageSize"
      how-quick-jumper
      show-size-changer
      :show-total="(total) => `共 ${total} 条数据`"
      @change="paginationChange"
  /></div>

  <a-row>
    <a-col :span="12">
      <Bar :chart-data="line1" height="40vh" :option="{ title: { text: '客户发展数', left: 'center' } }" />
    </a-col>
    <a-col :span="12">
      <Bar :chart-data="line2" height="40vh" :option="{ title: { text: '用户发展数', left: 'center' } }" />
    </a-col>
  </a-row>

  <a-row>
    <a-col :span="12">
      <Pie :chart-data="line1" height="40vh" :option="{ title: { text: '客户发展数', left: 'center' } }" />
    </a-col>
    <a-col :span="12">
      <Pie :chart-data="line2" height="40vh" :option="{ title: { text: '用户发展数', left: 'center' } }" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { show, getColumnsByReportId, getFormItems, InputItem, BasicColumn, InputMode, excludeIndex } from './modules.data';
  import { BasicTable } from '/@/components/Table';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';
  import { BasicForm, FormSchema } from '/@/components/Form/index';
  import { Pagination } from 'ant-design-vue';

  // import FormItem from './components/FormItem.vue';

  // const reportId = '975558342579404800';

  const reports = [
    {
      reportId: '975558342579404800',
      key: 'operareanamestr',
      label: '运行区域',
    },
    {
      reportId: '975657508840226816',
      key: 'productnamestr',
      label: '产品名称',
    },
  ];

  const report = ref<(typeof reports)[number]>(reports[0]);

  const items = ref<any[]>([]);
  const inputItems = ref<InputItem[]>([]);
  const loading = ref(true);
  const columns = ref<BasicColumn[]>([]);

  // 分页查询条件等
  const state = ref<any>({
    pageNo: 1,
    pageSize: 10,
    // 总共的页数
    total: 0,
    // 总共的条数
    count: 0,
  });

  const paginationChange = (page: number, pageSize: number) => {
    state.value.pageNo = page;
    state.value.pageSize = pageSize;
    getData();
  };

  const data = computed(() => {
    if (items.value.length === 0) {
      return [];
    } else {
      return items.value.map((i) => ({
        ...i,
        id: i.jimu_row_id,
      }));
    }
  });

  const handleSearch = (values: any) => {
    if (loading.value) {
      return;
    }

    for (const key in values) {
      const v = values[key];
      if (v) {
        state.value[key] = v;
      } else {
        delete state.value[key];
      }
    }

    console.log(state.value);

    getData();
  };

  const schemas = computed<FormSchema[]>(() => {
    if (inputItems.value.length === 0) {
      return [];
    } else {
      return inputItems.value.map((i) => {
        let t = {
          label: i.title,
          colProps: {
            span: 6,
          },
        };

        switch (i.mode) {
          // 下拉框
          case InputMode.SELECT:
            t = {
              ...t,
              field: i.name,
              component: 'Select',
              componentProps: {
                options: i.dictList!.map((s, idx) => {
                  return {
                    key: idx,
                    label: s.text,
                    value: s.value,
                  };
                }),
              },
            } as any;
            break;

          // 默认是输入框
          default:
            t = {
              ...t,
              field: i.name,
              component: 'Input',
            } as any;
            break;
        }

        return t as FormSchema;
      });
    }
  });

  const line1 = computed(() => {
    if (items.value.length === 0 || columns.value.length === 0) {
      return [];
    } else {
      return items.value.map((i) => {
        return {
          value: i.customer_count,
          name: i[report.value.key],
        };
      });
    }
  });

  const line2 = computed(() => {
    if (items.value.length === 0 || columns.value.length === 0) {
      return [];
    } else {
      return items.value.map((i) => {
        return {
          value: i.subscriber_count,
          name: i[report.value.key],
        };
      });
    }
  });

  const getData = async () => {
    loading.value = true;
    await Promise.all([
      show(report.value.reportId, state.value).then((res) => {
        state.value.total = res.dataList.utf8.total;
        state.value.count = res.dataList.utf8.count;
        items.value = res.dataList.utf8.list;
      }),
      getColumnsByReportId(report.value.reportId).then((res) => {
        columns.value = res
          .filter((i) => !excludeIndex.includes(i.title))
          .map((i) => {
            return {
              title: i.fieldText,
              dataIndex: i.title,
            };
          });
      }),
      getFormItems(report.value.reportId).then((res) => {
        inputItems.value = res.list;

        // 这是查询条件和分页的默认值
        res.list.forEach((l) => {
          if (l.defaultValue !== '' && !Object.keys(state.value).includes(l.name)) {
            state.value[l.name] = l.defaultValue;
          }
        });
      }),
    ]).finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    getData();
  });
</script>

<style lang="less" scoped>
  // .input {
  //   display: flex;
  // }

  .pag {
    display: flex;
    flex-direction: row-reverse;
    margin-right: 30px;
  }
</style>
