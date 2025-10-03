<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow mb-6 w-full">
    <div class="stat">
      <div class="stat-figure text-primary">
        <PhPlant :size="32" />
      </div>
      <div class="stat-title">作物種類</div>
      <div class="stat-value text-primary">{{ cropCount }}</div>
      <div class="stat-desc">{{ currentCrop || '所有作物' }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <PhCurrencyCircleDollar :size="32" />
      </div>
      <div class="stat-title">平均價格</div>
      <div class="stat-value text-secondary">NT$ {{ averagePrice }}</div>
      <div class="stat-desc">每公斤</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-accent">
        <PhStorefront :size="32" />
      </div>
      <div class="stat-title">市場數</div>
      <div class="stat-value text-accent">{{ marketCount }}</div>
      <div class="stat-desc">個市場有交易</div>
    </div>
  </div>
</template>

<script setup>
import { PhPlant, PhCurrencyCircleDollar, PhStorefront } from '@phosphor-icons/vue'

defineProps({
  cropCount: {
    type: Number,
    default: 0,
  },
  averagePrice: {
    type: String,
    default: '0.00',
  },
  marketCount: {
    type: Number,
    default: 0,
  },
  currentCrop: {
    type: String,
    default: '',
  },
})
</script>
