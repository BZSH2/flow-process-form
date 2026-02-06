<script setup lang="ts">
import { setLang } from '@/i18n'
import { langDict } from '@/config';

function changeLang(code: string) {
  setLang(code)
}
</script>

<template>
  <div>
    <ElButton type="primary">{{ $t('测试') }}</ElButton>
    <div>{{ $t('哈哈哈哈') }}</div>
    <Icon name="aixin" />
    <h1>{{ $t('你好, 这是一个测试') }}</h1>
    <div class="ai-dice1" v-for="item in langDict" :key="item.code" @click="changeLang(item.code)">{{ item.name }}</div>
  </div>
</template>

<style scoped></style>
