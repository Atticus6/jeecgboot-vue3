<script lang="ts" setup>
  import { computed, onMounted, ref, watchEffect } from 'vue';
  import { getValidAddresseTree } from './modules.data';

  const selectedData = ref<any>({});
  const addressData = ref<Awaited<ReturnType<typeof getValidAddresseTree>> | null>(null);

  const emit = defineEmits(['update:modelValue']);

  const cityOptions = computed(() => {
    if (!addressData.value) {
      return [];
    } else {
      return [
        {
          value: addressData.value.fullCode,
          label: addressData.value.fullName,
        },
      ];
    }
  });

  const areaOptions = computed(() => {
    if (selectedData.value['city'] && addressData.value?.children) {
      return addressData.value.children.map((a) => ({
        value: a.fullCode,
        label: a.fullName,
      }));
    } else {
      return [];
    }
  });

  const streetOptions = computed(() => {
    if (!selectedData.value['area'] || addressData.value === null) return [];

    const area = addressData.value.children!.find((a) => a.fullCode === selectedData.value['area']);

    if (area && area.children) {
      return area.children.map((a) => ({
        value: a.fullCode,
        label: a.fullName,
      }));
    } else {
      return [];
    }
  });

  watchEffect(() => {
    if (!selectedData.value['city'] && selectedData.value['area']) {
      delete selectedData.value['area'];
    }
    if (!selectedData.value['area'] && selectedData.value['street']) {
      delete selectedData.value['street'];
    }

    const res = selectedData.value['street'] || selectedData.value['area'] || selectedData.value['city'] || '';

    emit('update:modelValue', res);
  });

  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  onMounted(() => {
    getValidAddresseTree().then((res) => {
      addressData.value = res;
    });
  });
</script>
<template>
  <div class="flex-grow flex justify-between gap-3">
    <a-select v-model:value="selectedData.city" class="w-full" :options="cityOptions" allowClear show-search :filter-option="filterOption" />
    <a-select v-model:value="selectedData.area" class="w-full" :options="areaOptions" allowClear show-search :filter-option="filterOption" />
    <a-select v-model:value="selectedData.street" class="w-full" :options="streetOptions" allowClear show-search :filter-option="filterOption" />
  </div>
</template>
<style scoped></style>
