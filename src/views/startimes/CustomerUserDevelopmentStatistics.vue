<template>
  <BasicTable :columns="columns" :data-source="data" :pagination="false" :loading="loading" :bordered="true" :canResize="true">
    <template v-if="inputItems.length !== 0" #headerTop>
      <BasicForm :schemas="schemas" :labelWidth="70" @submit="handleSearch" :showResetButton="false" />
    </template>
    <template #toolbar>
      <div>333</div>
    </template>
  </BasicTable>
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
  import { show, getColumnsByReportId, getFormItems, InputItem, BasicColumn, InputMode } from './modules.data';
  import { BasicTable } from '/@/components/Table';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';
  import { BasicForm, FormSchema, ApiSelect, JAreaLinkage } from '/@/components/Form/index';

  // import FormItem from './components/FormItem.vue';
  interface Item {
    operareanamestr: string;
    jimu_row_id: string;
    subscriber_count: string;
    pagehelper_row_id: string;
    customer_count: string;
  }
  const reportId = '975558342579404800';
  const items = ref<Item[]>([]);
  const inputItems = ref<InputItem[]>([]);
  const loading = ref(true);
  const columns = ref<BasicColumn[]>([]);

  // 分页查询条件等
  const state = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });

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
          name: i.operareanamestr,
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
          name: i.operareanamestr,
        };
      });
    }
  });

  const getData = async () => {
    loading.value = true;
    await Promise.all([
      show<Item>(reportId, state.value).then((res) => {
        console.log('show', JSON.parse(res.jsonStr));

        items.value = res.dataList.utf8.list;
      }),
      getColumnsByReportId(reportId).then((res) => {
        columns.value = res.map((i) => {
          return {
            title: i.fieldText,
            dataIndex: i.title,
          };
        });
      }),
      getFormItems(reportId).then((res) => {
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
</style>
