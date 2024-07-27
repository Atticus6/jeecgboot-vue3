<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { show, getColumnsByReportId, getFormItems, InputItem, BasicColumn, excludeIndex, getSelectByKey, S } from './modules.data';
  import { BasicTable } from '/@/components/Table';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';

  import { Pagination } from 'ant-design-vue';
  import { useSelectStore } from './store';
  import { Container, STCard, Divider } from './components/index';
  const selectStore = useSelectStore();

  const reports = [
    {
      reportId: '976366834009587712',
      key: 'productnamestr',
      label: '产品名称',
    },
    {
      reportId: '976615750844104704',
      key: 'operareanamestr',
      label: '运营区域',
    },
  ];

  const report = ref<(typeof reports)[number]>(reports[0]);

  // 表格的每条记录
  const items = ref<any[]>([]);
  // 表单项
  const inputItems = ref<InputItem[]>([]);
  const loading = ref(true);
  const columns = ref<BasicColumn[]>([]);
  const showColumnIdx = ref<string[]>([]);
  // 分页查询条件等
  const state = ref<any>({
    pageNo: 1,
    pageSize: 10,
    // 总共的页数
    total: 0,
    // 总共的条数
    count: 0,
  });

  const formScheam = reactive<any>({});

  const showMaps = ref(['pie', 'bar']);

  const paginationChange = (page: number, pageSize: number) => {
    console.log('paginationChange');

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
      return items.value.map((i) => ({
        ...i,
        id: i.jimu_row_id,
      }));
    }
  });

  const line1 = computed(() => {
    console.log('line1');

    if (items.value.length === 0 || columns.value.length === 0) {
      return [];
    } else {
      return items.value.map((i) => {
        return {
          value: i.order_sub_count,
          name: i[report.value.key],
        };
      });
    }
  });

  const line2 = computed(() => {
    console.log('line2');
    if (items.value.length === 0 || columns.value.length === 0) {
      return [];
    } else {
      return items.value.map((i) => {
        return {
          value: i.order_count,
          name: i[report.value.key],
        };
      });
    }
  });

  const getData = async (loaddColumnsAndForm = true) => {
    loading.value = true;
    await Promise.all([
      show(report.value.reportId, state.value).then((res) => {
        state.value.total = res.dataList.utf8.total;
        state.value.count = res.dataList.utf8.count;
        items.value = res.dataList.utf8.list;
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
          inputItems.value = res.list;

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
        }),
    ]).finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    console.log('onMounted');

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
    console.log('submit');

    getData(false);
  }

  const reportChange = (r: (typeof reports)[number]) => {
    console.log('reportChange');

    report.value = r;
    getData();
  };
</script>
<template>
  <Container>
    <!-- 表单区域 -->
    <STCard>
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
            <div>
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
    </STCard>

    <!-- 表区域 -->
    <STCard v-show="showColumnIdx.length !== 0">
      <BasicTable
        :columns="columns.filter((c) => showColumnIdx.includes(c.dataIndex))"
        :data-source="data"
        :loading="loading"
        :bordered="true"
        :canResize="true"
        :pagination="false"
      >
        <!-- <template v-if="inputItems.length !== 0" #headerTop>
          <BasicForm :schemas="schemas" :labelWidth="70" @submit="handleSearch" :actionColOptions="{ span: 24 }" :showResetButton="false" />
        </template> -->
        <!-- 删除后columns栏不显示 -->
        <!-- <template #toolbar> </template> -->
      </BasicTable>

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
    </STCard>

    <!--  图区域 -->
    <div v-show="data.length !== 0" class="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2 lg:gap-3">
      <STCard v-if="showMaps.includes('bar')">
        <Bar :chart-data="line1" height="40vh" :option="{ title: { text: '订购用户数', left: 'center' } }"
      /></STCard>
      <STCard v-if="showMaps.includes('bar')">
        <Bar :chart-data="line2" height="40vh" :option="{ title: { text: '订购次数', left: 'center' } }"
      /></STCard>
      <STCard v-show="showMaps.includes('pie')">
        <Pie :chart-data="line1" height="40vh" :option="{ title: { text: '订购用户数', left: 'center' } }"
      /></STCard>
      <STCard v-show="showMaps.includes('pie')">
        <Pie :chart-data="line2" height="40vh" :option="{ title: { text: '订购次数', left: 'center' } }"
      /></STCard>
    </div>
  </Container>
</template>

<style lang="less" scoped></style>
