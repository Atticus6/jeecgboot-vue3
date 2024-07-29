<script lang="tsx" setup>
  import { computed, FunctionalComponent, onMounted, reactive, ref, defineProps } from 'vue';
  import { show, getColumnsByReportId, getFormItems, InputItem, BasicColumn, excludeIndex, getSelectByKey, S } from './modules.data';
  import { BasicTable } from '/@/components/Table';
  import lodash from 'lodash-es';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';

  import { Pagination } from 'ant-design-vue';
  import { useSelectStore } from './store';

  type ReportType = {
    reportId: string;
    key: string;
    label: string;
    tableNmae: string;
  };

  const { reports, mapList } = withDefaults(
    defineProps<{
      reports: ReportType[];
      mapList?: ('pie' | 'bar')[];
    }>(),
    {
      mapList: () => ['pie', 'bar'],
    }
  );

  const report = ref<ReportType>(reports[0]);
  const selectStore = useSelectStore();

  // 表格的每条记录
  const items = ref<any[]>([]);
  // 表单项
  const inputItems = ref<InputItem[]>([]);
  const loading = ref(true);
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
  const formScheam = reactive<any>({});

  // 去除重复的
  const showMaps = ref(lodash.uniq(mapList));

  const paginationChange = (page: number, pageSize: number) => {
    state.value.pageNo = page;
    state.value.pageSize = pageSize;
    // false 不需要重新获取表单和表头
    getData(false);
  };

  const data = computed(() => {
    console.log('data');

    if (items.value.length === 0) {
      return [];
    } else {
      const target = items.value.map((i) => ({
        ...i,
        id: i.jimu_row_id,
      }));

      // const summary: any = {};
      // columns.value.map(c=>{

      // })
      return target;
    }
  });

  const mapsData = computed(() => {
    return columns.value
      .filter((c) => c.dataIndex !== report.value.key)
      .map((c) => ({
        title: c.title,
        data: items.value.map((i) => ({
          name: i[report.value.key],
          value: i[c.dataIndex],
        })),
      }));
  });

  const getData = async (loaddColumnsAndForm = true) => {
    loading.value = true;
    await Promise.all([
      show(report.value.reportId, state.value).then((res) => {
        state.value.total = res.dataList[report.value.tableNmae].total;
        state.value.count = res.dataList[report.value.tableNmae].count;

        items.value = res.dataList[report.value.tableNmae].list;
      }),
      // 获取表头
      loaddColumnsAndForm &&
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
          }),

      // 获取表单项
      loaddColumnsAndForm &&
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
        }),
    ]).finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    getData();
  });

  function submit() {
    inputItems.value.forEach((i) => {
      const k = i.name;
      const v = formScheam[k];
      if (v) {
        state.value[k] = v;
      } else {
        delete state.value[k];
      }
    });

    getData(false);
  }

  const reportChange = (r: ReportType) => {
    report.value = r;
    getData();
  };

  //   部分组件
  const Card: FunctionalComponent = (_props: any, ctx: any) => {
    return <a-card class="shadow-sm hover:shadow-md duration-300 border east-in-out">{ctx.slots.default()}</a-card>;
  };

  const Divider: FunctionalComponent = (_props: any, ctx: any) => {
    return <div class="font-medium text-md md:text-xl">{ctx.slots.default()}</div>;
  };
</script>
<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-1 md:p-2 lg:p-3 flex flex-col gap-2 mt-3">
    <!-- 表单区域 -->
    <Card>
      <div class="flex flex-col gap-1 md:gap-2 lg:gap-4">
        <!-- 条件设置 -->
        <div>
          <Divider>条件设置</Divider>
          <a-form
            noStyle
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-2"
            @submit="submit"
          >
            <a-form-item v-for="(item, i) in inputItems" :key="i" :name="item.name" noStyle>
              <div class="flex items-center">
                <div class="w-30 md:w-25 line-clamp-1">{{ item.title }}:</div>
                <a-select v-if="selectStore.getSelectBykey(item.name)" v-model:value="formScheam[item.name]" allowClear>
                  <a-select-option v-for="(option, j) in selectStore.getSelectBykey(item.name)!.list" :key="j" :value="option.id">{{
                    option.name
                  }}</a-select-option>
                </a-select>

                <a-date-picker
                  v-else-if="item.type === 'date'"
                  v-model:value="formScheam[item.name]"
                  class="w-full"
                  allowClear
                  :valueFormat="item.format || 'YYYY-MM-DD'"
                  :picker="item.realType"
                />
                <a-input v-else v-model:value="formScheam[item.name]" allowClear />
              </div>
            </a-form-item>

            <a-form-item noStyle>
              <div class="flex items-center"><a-button type="primary" html-type="submit">查询</a-button></div>
            </a-form-item>
          </a-form>
        </div>
        <!-- 系统指标设置 -->
        <div>
          <Divider>系统指标设置</Divider>
          <div class="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between">
            <div class="flex">
              指标选择:
              <a-checkbox-group v-model:value="showColumnIdx">
                <a-checkbox v-for="(c, i) in columns" :key="i" :value="c.dataIndex">{{ c.title }}</a-checkbox>
              </a-checkbox-group>
            </div>
            <div v-if="reports.length >= 2">
              分组维度选择:
              <a-radio-group :value="report.reportId">
                <a-radio v-for="(item, i) in reports" :key="i" :value="item.reportId" @click="reportChange(item)">{{ item.label }}</a-radio>
              </a-radio-group>
            </div>
          </div>
        </div>

        <!-- 展示图标设置 -->
        <div>
          <Divider>展示图标设置</Divider>

          图表类型选择:
          <a-checkbox-group
            v-model:value="showMaps"
            :options="[
              { label: '柱形图', value: 'pie' },
              { label: '圆饼图', value: 'bar' },
            ]"
          />
        </div>
      </div>
    </Card>

    <!-- 表区域 -->
    <Card v-show="showColumnIdx.length !== 0">
      <BasicTable
        :columns="columns.filter((c) => showColumnIdx.includes(c.dataIndex))"
        :data-source="data"
        :loading="loading"
        :bordered="true"
        :canResize="true"
        :pagination="false"
      />

      <div class="flex justify-end mr-6">
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
    </Card>

    <!--  图区域 -->
    <template v-if="mapList.length !== 0">
      <div v-show="data.length !== 0" class="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2 lg:gap-3">
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
    </template>
  </div>
</template>
