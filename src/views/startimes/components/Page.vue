<script lang="tsx" setup>
  import { computed, FunctionalComponent, onMounted, reactive, ref, defineProps } from 'vue';
  import { show, getColumnsByReportId, getFormItems, InputItem, BasicColumn, excludeIndex, getSelectByKey, S } from './modules.data';
  import { BasicTable } from '/@/components/Table';
  import lodash from 'lodash-es';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';
  import { useMediaQuery } from '@vueuse/core';
  import { SettingOutlined, ColumnHeightOutlined, PrinterOutlined } from '@ant-design/icons-vue';
  import { Pagination } from 'ant-design-vue';
  import printJS from 'print-js';
  import AreaSelect from './AreaSelect.vue';
  import { useSelectStore } from './store';
  import dayjs, { Dayjs } from 'dayjs';

  type ReportType = {
    reportId: string;
    key: string;
    label: string;
    tableNmae: string;
  };

  const { reports, mapList, showColumnSetting, toFixedNum, showSum, defalutSchema, timeKeys, handleData } = withDefaults(
    defineProps<{
      reports: ReportType[];
      mapList?: ('pie' | 'bar')[];
      showColumnSetting?: boolean;
      toFixedNum?: number;
      showSum?: boolean;
      defalutSchema?: any;
      timeKeys?: string[];
      // 对返回的结果进进行处理函数
      handleData?: <T = any>(data: T) => T;
    }>(),
    {
      // 展示的图标
      mapList: () => ['pie', 'bar'],
      showColumnSetting: true,
      toFixedNum: 0,
      showSum: true,
      defalutSchema: {},
      timeKeys: () => [],
      handleData: (data: any) => data,
    }
  );

  const tableSizeList = [
    {
      label: '紧密',
      value: 'small',
    },
    { label: '默认', value: 'middle' },
    { label: '宽松', value: 'large' },
  ] as const;
  const tableSize = ref<(typeof tableSizeList)[number]>(tableSizeList[0]);
  const isPC = useMediaQuery('(min-width: 768px)');
  const report = ref<ReportType>(reports[0]);
  const selectStore = useSelectStore();
  const rootDiv = ref<HTMLDivElement>(null);
  // 表格的每条记录
  const items = ref<any[]>([]);
  // 表单项
  const inputItems = ref<InputItem[]>([]);
  const loading = ref(false);
  const columns = ref<BasicColumn[]>([]);
  const showColumnIdx = ref<string[]>([]);
  // 分页
  const state = ref<any>({
    pageNo: 1,
    pageSize: 10,
    // 总共的页数
    total: 0,
    // 总共的条数
    count: 0,
  });

  // 查询条件
  const formScheam = reactive<any>({ ...defalutSchema });

  // 去除重复的
  const showMaps = ref(lodash.uniq(mapList));
  const showIndexColumn = ref(true);
  const paginationChange = (page: number, pageSize: number) => {
    state.value.pageNo = page;
    state.value.pageSize = pageSize;
    // false 不需要重新获取表单和表头
    getData(false);
  };

  const data = computed(() => {
    console.log(' computed data');

    if (loading.value || items.value.length === 0) {
      return [];
    } else {
      const summary: any = { id: '-1' };

      columns.value.forEach((c) => {
        if (c.dataIndex === report.value.key) {
          summary[c.dataIndex] = '合计';
        } else if (showSum) {
          summary[c.dataIndex] = items.value
            .reduce(function (prev, cur) {
              const sum = (prev + parseFloat(cur[c.dataIndex])) as number;
              return sum;
            }, 0)
            .toFixed(toFixedNum);
        }
      });

      const target = items.value.map((i) => ({
        ...i,
        id: i.jimu_row_id,
      }));

      if (showSum) target.push(summary);

      return target;
    }
  });

  const mapsData = computed(() => {
    console.log(' computed mapsData');
    return columns.value
      .filter((c) => c.dataIndex !== report.value.key)
      .map((c) => ({
        title: c.title,
        data: items.value.map((i) => ({
          name: i[report.value.key],
          value: Math.abs(i[c.dataIndex]),
        })),
      }));
  });

  const getData = async (loaddColumnsAndForm = true) => {
    console.log('getData');

    if (loading.value) {
      return;
    }

    // 获取表头
    const getClounmn = () =>
      getColumnsByReportId(report.value.reportId)
        .then((res) => res.filter((i) => !excludeIndex.includes(i.title)))
        .then((res) => {
          columns.value = res.map((i) => {
            return {
              title: i.fieldText,
              dataIndex: i.title,
            };
          });

          showColumnIdx.value = res.map((i) => i.title);
        });

    // 获取表单项
    const getFormData = () =>
      getFormItems(report.value.reportId).then(async (res) => {
        // 这是查询条件和分页的默认值
        const stateKeys = Object.keys(state.value);
        res.list.forEach((l) => {
          if (l.defaultValue !== '' && !stateKeys.includes(l.name)) {
            state.value[l.name] = l.defaultValue;
          }
        });

        // 下拉框获取选项存放在selectStore中
        const willfetchKeys: string[] = [];
        res.list.forEach((l) => {
          if (selectStore.okToFetch(l.name)) {
            willfetchKeys.push(l.name);
          }
        });

        if (willfetchKeys.length !== 0) {
          await Promise.all(
            willfetchKeys.map((w) => {
              return getSelectByKey(w as S).then((r) => {
                selectStore.addSelect(r);
              });
            })
          );
        }

        inputItems.value = res.list;
      });

    loading.value = true;
    await Promise.all([
      // 获取表格数据
      show(report.value.reportId, { ...state.value, ...formScheam }).then((res) => {
        state.value.total = res.dataList[report.value.tableNmae].total;
        state.value.count = res.dataList[report.value.tableNmae].count;

        items.value = handleData(res.dataList[report.value.tableNmae].list);
      }),
      // 获取表头
      loaddColumnsAndForm && getClounmn(),
      // 获取表单项
      loaddColumnsAndForm && getFormData(),
    ]).finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    getData();
  });

  function submit() {
    console.log('submit');

    // inputItems.value.forEach((i) => {
    //   const k = i.name;
    //   const v = formScheam[k];
    //   if (v) {
    //     state.value[k] = v;
    //   } else {
    //     delete state.value[k];
    //   }
    // });

    getData(false);
  }

  const reportChange = (r: ReportType) => {
    console.log('reportChange');

    report.value = r;
    getData();
  };

  function jsonPrint() {
    printJS({
      printable: data.value,
      properties: columns.value.filter((c) => showColumnIdx.value.includes(c.dataIndex)).map((c) => ({ field: c.dataIndex, displayName: c.title })),
      type: 'json',
    });
  }
  // select 搜索
  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const disabledDates = computed(() => {
    const obj = {} as any;

    timeKeys.forEach((t, i) => {
      if (i === 0) {
        obj[t] = (current: Dayjs) => {
          const endkey = timeKeys[1];
          if (endkey) {
            const endTime = formScheam[endkey];
            if (endTime) {
              return (current && current > dayjs().endOf('day')) || current > dayjs(endTime).endOf('day');
            } else {
              return current && current > dayjs().endOf('day');
            }
          }

          return current && current > dayjs().endOf('day');
        };
      } else if (i === 1) {
        obj[t] = (current: Dayjs) => {
          const startTime = formScheam[timeKeys[0]];

          if (startTime) {
            return (current && current > dayjs().endOf('day')) || current < dayjs(startTime).endOf('day');
          } else {
            return current && current > dayjs().endOf('day');
          }
        };
      }
    });

    return obj;
  });

  //   部分组件
  const Card: FunctionalComponent = (_props: any, ctx: any) => {
    return (
      <a-card class="shadow-sm hover:shadow-md duration-500  border east-in-out " size="small">
        {ctx.slots.default()}
      </a-card>
    );
  };

  const Divider: FunctionalComponent = (_props: any, ctx: any) => {
    return <div class="font-medium text-md md:text-xl mb-2">{ctx.slots.default()}</div>;
  };
</script>
<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-1 md:p-2 lg:p-3 flex flex-col gap-2 mt-1" ref="rootDiv">
    <!-- 表单区域 -->
    <Card class="px-2 py-1 md:px-4 md:py-2">
      <div class="flex flex-col gap-1 md:gap-2 lg:gap-4">
        <!-- 条件设置 -->
        <div>
          <Divider>条件设置</Divider>
          <a-form
            noStyle
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-2"
            @submit="submit"
          >
            <a-form-item v-for="(item, i) in inputItems.filter((i) => i.name !== 'addresscode')" :key="i" :name="item.name" noStyle>
              <div class="flex items-center">
                <div class="w-30 md:w-26">{{ item.title }}:</div>

                <a-select
                  v-if="selectStore.getSelectBykey(item.name)"
                  v-model:value="formScheam[item.name]"
                  allowClear
                  :placeholder="isPC && `请选择${item.title}`"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(option, j) in selectStore.getSelectBykey(item.name)!.list"
                    :key="j"
                    :value="option.id"
                    :label="option.name"
                    >{{ option.name }}</a-select-option
                  >
                </a-select>

                <a-date-picker
                  v-else-if="item.type === 'date'"
                  v-model:value="formScheam[item.name]"
                  class="w-full"
                  :disabled-date="disabledDates[item.name]"
                  allowClear
                  :valueFormat="item.format || 'YYYY-MM-DD'"
                  :picker="item.realType === 'datetime' ? 'date' : item.realType"
                />
                <a-input v-else v-model:value="formScheam[item.name]" allowClear :placeholder="isPC ? `请输入${item.title}` : ''" />
              </div>
            </a-form-item>

            <a-form-item class="flex items-center" v-if="inputItems.find((i) => i.name === 'addresscode')" noStyle>
              <div class="flex items-center">
                <div class="w-30 md:w-26">地址编码:</div>
                <AreaSelect v-model="formScheam['addresscode']" />
              </div>
            </a-form-item>

            <!-- <div class="flex items-center" v-if="inputItems.find((i) => i.name === 'addresscode')">
              <div class="w-20">地址编码:</div>
              <AreaSelect v-model="formScheam['addresscode']" />
            </div> -->

            <a-form-item noStyle>
              <div class="flex items-center"> <a-button type="primary" html-type="submit">查询</a-button></div>
            </a-form-item>
          </a-form>
        </div>
        <!-- 系统指标设置 -->
        <div v-if="showColumnSetting && reports.length >= 2">
          <Divider>系统指标设置</Divider>
          <div>
            分组维度选择:
            <a-radio-group :value="report.reportId">
              <a-radio v-for="(item, i) in reports" :key="i" :value="item.reportId" @click="reportChange(item)">{{ item.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </Card>

    <!-- 表区域 -->
    <Card>
      <div class="flex gap-2">
        <!--  列展示设置 -->
        <a-popover title="设置列" placement="bottomLeft" trigger="hover">
          <template #content>
            <a-checkbox v-model:checked="showIndexColumn">序号</a-checkbox> <br />
            <a-checkbox-group v-model:value="showColumnIdx">
              <div class="flex flex-col">
                <a-checkbox v-for="(c, i) in columns" v-show="i !== 0" :key="i" :value="c.dataIndex">{{ c.title }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </template>
          <a-button type="ghost" shape="circle" size="small">
            <SettingOutlined />
          </a-button>
        </a-popover>

        <!-- 密度设置 -->
        <a-dropdown>
          <ColumnHeightOutlined />
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="i in tableSizeList" :key="i.value" @click="tableSize = i"> {{ i.label }} </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button type="ghost" shape="circle" size="small" @click="jsonPrint">
          <PrinterOutlined />
        </a-button>
      </div>

      <BasicTable
        id="table"
        :columns="columns.filter((c) => showColumnIdx.includes(c.dataIndex))"
        :data-source="data"
        :loading="loading"
        :size="tableSize.value"
        bordered
        canResize
        :pagination="false"
        :striped="true"
        :showIndexColumn="showIndexColumn"
      />

      <!-- 分页 -->
      <div class="flex justify-end mr-6">
        <Pagination
          class="flex gap-1"
          :current="state.pageNo"
          :total="state.count"
          :page-size="state.pageSize"
          :how-quick-jumper="true"
          :show-size-changer="true"
          size="small"
          :show-total="(total) => `共${total} 条数据`"
          :page-size-options="['5', '10', '20', '30', '40', '50']"
          @change="paginationChange"
          :disabled="loading"
        />
      </div>
    </Card>

    <!--  图区域 -->
    <template v-if="mapList.length !== 0 && data.length !== 0">
      <Card>
        <!-- 展示图标设置 -->
        <div>
          <Divider>展示图标设置</Divider>

          图表类型选择:
          <a-checkbox-group
            v-model:value="showMaps"
            :options="[
              { label: '柱形图', value: 'bar' },
              { label: '圆饼图', value: 'pie' },
            ]"
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-3 lg:gap-5">
          <template v-if="showMaps.includes('bar')">
            <Card v-for="(d, i) in mapsData" :key="i">
              <Bar :chart-data="d.data" height="40vh" :option="{ title: { text: d.title, left: 'center' } }"
            /></Card>
          </template>

          <template v-if="showMaps.includes('pie')">
            <Card v-for="(d, i) in mapsData" :key="i">
              <Pie :chart-data="d.data" height="40vh" :option="{ title: { text: d.title, left: 'center' } }"
            /></Card>
          </template>
        </div>
      </Card>
    </template>
  </div>
</template>
