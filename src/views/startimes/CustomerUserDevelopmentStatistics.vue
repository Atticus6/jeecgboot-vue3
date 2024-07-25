<template>
  <BasicTable
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :bordered="true"
    :canResize="true"
    :pagination="false"
    :show-table-setting="true"
  >
    <template v-if="inputItems.length !== 0" #headerTop>
      <BasicForm :schemas="schemas" :labelWidth="70" @submit="handleSearch" :actionColOptions="{ span: 24 }" :showResetButton="false" />
    </template>
    <!-- 删除后columns栏不显示 -->
    <template #toolbar> </template>
  </BasicTable>

  <div class="pag">
    <Pagination
      :current="state.pageNo"
      :total="state.count"
      :page-size="state.pageSize"
      how-quick-jumper
      show-size-changer
      size="small"
      :show-total="(total) => `共${total} 条数据`"
      @change="paginationChange"
      :disabled="loading"
  /></div>

  <a-row v-show="showMaps.bar">
    <a-col :span="12">
      <Bar :chart-data="line1" height="40vh" :option="{ title: { text: '客户发展数', left: 'center' } }" />
    </a-col>
    <a-col :span="12">
      <Bar :chart-data="line2" height="40vh" :option="{ title: { text: '用户发展数', left: 'center' } }" />
    </a-col>
  </a-row>

  <!-- 使用 v-show会导致饼图大小错误 -->
  <a-row v-if="showMaps.pie">
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

  // 表格的每条记录
  const items = ref<any[]>([]);
  // 表单项
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

  const showMaps = ref({
    bar: true,
    pie: true,
  });

  const paginationChange = (page: number, pageSize: number) => {
    state.value.pageNo = page;
    state.value.pageSize = pageSize;
    // false 不需要重新获取表单和表头
    getData(false);
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

      // 以noform开头的字段不会参与表单提交
      if (key.startsWith('noform')) {
      } else if (v) {
        state.value[key] = v;
      } else {
        delete state.value[key];
      }
    }

    console.log(state.value);

    getData(false);
  };

  const schemas = computed<FormSchema[]>(() => {
    const taget: FormSchema[] = [];

    // 条件查询
    if (inputItems.value.length !== 0) {
      taget.push({
        field: 'divider-basic',
        component: 'Divider',
        label: '条件选择',
      });
      inputItems.value.forEach((i) => {
        let t = {
          label: i.title,
          colProps: {
            span: 8,
          },
        };

        if (i.defaultValue) {
          t['defaultValue'] = i.defaultValue;
        }

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
            // 时间输入和输入框都为1
            if (i.realType === 'datetime') {
              t = {
                ...t,
                field: i.name,
                component: 'DatePicker',
                // componentProps: {
                //   picker: 'week',
                // },
              } as any;
            } else {
              t = {
                ...t,
                field: i.name,
                component: 'Input',
              } as any;
            }

            break;
        }

        taget.push(t as FormSchema);
      });
    }

    // 统计指标设置
    if (columns.value.length !== 0) {
      taget.push({
        field: 'divider-basic',
        component: 'Divider',
        label: '统计指标设置',
      });
      taget.push({
        field: 'noform-index',
        component: 'CheckboxGroup',
        label: '显示字段',
        colProps: {
          span: 8,
        },
        componentProps: ({ formModel }) => {
          return {
            defaultValue: columns.value.filter((c) => c.dataIndex !== report.value.key).map((c) => c.dataIndex),
            onChange(e: string[]) {
              console.log(1, e);
            },
            options: columns.value
              .filter((c) => c.dataIndex !== report.value.key)
              .map((r) => ({
                label: r.title,
                value: r.dataIndex,
                onChange(e: any) {
                  console.log(2, e);
                },
              })),
          };
        },
      });

      taget.push({
        field: 'noform-grouping',
        component: 'RadioGroup',
        label: '分组维度',
        colProps: {
          span: 8,
        },

        componentProps: ({ formModel }) => {
          formModel['noform-grouping'] = report.value.reportId;
          return {
            onChange(e: any) {
              const t = reports.find((r) => r.reportId === e.target.value);
              if (t) {
                report.value = t;
                getData();
              }
            },
            options: reports.map((r) => ({
              label: r.label,
              value: r.reportId,
            })),
          };
        },
      });
    }

    // 展示图表设置
    if (true) {
      taget.push({
        field: 'divider-basic',
        component: 'Divider',
        label: '展示图表设置',
      });

      taget.push({
        field: 'noform-chart-type',
        component: 'CheckboxGroup',
        label: '图表选择',
        colProps: {
          span: 12,
        },
        componentProps: ({ formModel }) => {
          return {
            defaultValue: Object.keys(showMaps.value),
            onChange(e: string[]) {
              showMaps.value.bar = e.includes('bar');
              showMaps.value.pie = e.includes('pie');
            },
            options: Object.keys(showMaps.value).map((m) => ({
              value: m,
              label: m === 'bar' ? '柱状图' : '圆饼图',
            })),
          };
        },
      });
    }

    return taget;
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

  const getData = async (laodColumnsAndForm = true) => {
    loading.value = true;
    await Promise.all([
      show(report.value.reportId, state.value).then((res) => {
        state.value.total = res.dataList.utf8.total;
        state.value.count = res.dataList.utf8.count;
        items.value = res.dataList.utf8.list;
      }),
      // 获取表头
      laodColumnsAndForm &&
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

      // 获取表单项
      laodColumnsAndForm &&
        getFormItems(report.value.reportId).then((res) => {
          inputItems.value = res.list;

          // 这是查询条件和分页的默认值
          const stateKeys = Object.keys(state.value);
          res.list.forEach((l) => {
            if (l.defaultValue !== '' && !stateKeys.includes(l.name)) {
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
