<script lang="ts" setup>
  import { defineProps, withDefaults } from 'vue';
  withDefaults(
    defineProps<{
      size?: 'sm' | 'md' | 'lg';
      title?: string;
    }>(),
    {
      size: 'sm',
    }
  );
</script>
<template>
  <a-card class="shadow-sm hover:shadow-md duration-300 border east-in-out">
    <slot></slot>
  </a-card>
</template>
