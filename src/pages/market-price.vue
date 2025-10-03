<route lang="yaml">
meta:
  title: '買菜囤貨好幫手'
</route>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <!-- Hero Section -->
    <div class="hero min-h-48 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg mb-6">
      <div class="hero-content text-center">
        <div>
          <h1 class="text-4xl font-bold text-primary">市場行情</h1>
          <p class="py-4 text-base text-base-content/70">農產品、漁產品、家禽等即時市場價格資訊</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div role="tablist" class="tabs tabs-lifted tabs-lg mb-6">
      <button role="tab" class="tab tab-active font-semibold text-base">農產品</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">漁產品 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">家禽 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">羊隻 (開發中)</button>
    </div>

    <!-- Farm Produce Component -->
    <FarmProduce />
  </div>
</template>

<script setup>
import FarmProduce from '@/components/market-price/farm-produce/farm-produce.vue'
</script>
