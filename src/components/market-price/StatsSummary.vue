<template>
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-8 w-8 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <div class="stat-title">平均價格</div>
      <div class="stat-value text-primary">NT$ {{ statistics.avgPrice?.toFixed(2) }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-8 w-8 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          ></path>
        </svg>
      </div>
      <div class="stat-title">價格區間</div>
      <div class="stat-value text-secondary">
        {{ statistics.minPrice?.toFixed(2) }} ~ {{ statistics.maxPrice?.toFixed(2) }}
      </div>
      <div class="stat-desc">價差: NT$ {{ statistics.priceDiff?.toFixed(2) }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-8 w-8 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          ></path>
        </svg>
      </div>
      <div class="stat-title">總交易量</div>
      <div class="stat-value text-accent">{{ statistics.totalVolume?.toLocaleString() }}</div>
      <div class="stat-desc">公斤</div>
    </div>

    <div class="stat">
      <div class="stat-title">最高價市場</div>
      <div class="stat-value text-sm">{{ statistics.maxPriceMarket }}</div>
      <div class="stat-desc">NT$ {{ statistics.maxPrice?.toFixed(2) }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  statistics: {
    type: Object,
    required: true,
  },
})
</script>
