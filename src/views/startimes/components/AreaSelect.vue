<script lang="ts" setup>
  import { onMounted, ref, computed, defineModel } from 'vue';
  import { getValidAddresseTree, Address } from './modules.data';
  import type { TreeSelectProps } from 'ant-design-vue';

  const addressData = ref<Address | null>(null);

  const model = defineModel<string>();

  const treeData = computed<TreeSelectProps['treeData']>(() => {
    const getChildren = (children: Address['children']) => {
      if (!children) {
        return [];
      } else {
        return children.map((c) => {
          return {
            label: c.fullName,
            value: c.fullCode,
            children: getChildren(c.children),
          };
        });
      }
    };

    if (!addressData.value) {
      return [];
    } else {
      return [
        {
          label: addressData.value.fullName,
          value: addressData.value.fullCode,
          children: getChildren(addressData.value.children),
        },
      ];
    }
  });

  onMounted(() => {
    getValidAddresseTree().then((res) => {
      addressData.value = res;
    });
  });
</script>
<template>
  <a-tree-select
    v-model:value="model"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    tree-node-filter-prop="label"
  >
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ label }}</template>
    </template>
  </a-tree-select>
</template>
<style scoped></style>
