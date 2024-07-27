import { defineStore } from 'pinia';
import { getSelectByKey, selectKeys, S } from './modules.data';
import { ref } from 'vue';

type Item = Awaited<ReturnType<typeof getSelectByKey>>;

export const useSelectStore = defineStore('select', () => {
  const selectTypes = ref<Item[]>([]);

  const addSelect = (item: Item) => {
    if (selectTypes.value.find((i) => i.key === item.key)) {
      return;
    }
    selectTypes.value.push(item);
  };

  const getSelectBykey = (key: string) => {
    return selectTypes.value.find((i) => i.key === (key as any));
  };

  const okToFetch = (key: string) => {
    // 是下拉框的key 且 还未加载
    return selectKeys.includes(key as S) && !selectTypes.value.find((i) => i.key === key);
  };

  return {
    selectTypes,
    addSelect,
    okToFetch,
    getSelectBykey,
  };
});
