<template>
  <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
    <div class="card-body p-4">
      <!-- Collapsed View -->
      <div @click="toggleExpand">
        <h3 class="card-title text-lg flex justify-between items-center">
          <span class="text-base">{{ item.cropName }}</span>
          <div class="badge badge-primary">
            <PhCaretDown
              :size="16"
              class="transition-transform"
              :class="{ 'rotate-180': isExpanded }"
            />
          </div>
        </h3>

        <div class="flex items-center gap-2 text-sm text-base-content/70 mb-3">
          <PhMapPin :size="16" />
          {{ item.marketName }}
        </div>

        <div class="flex justify-center my-4">
          <div class="stat bg-primary/10 rounded-lg px-6 py-4">
            <div class="stat-title text-center text-xs">平均價格</div>
            <div class="stat-value text-center text-3xl text-primary">
              {{ item.prices.average.toFixed(1) }}
            </div>
            <div class="stat-desc text-center text-xs mt-1">元/公斤</div>
          </div>
        </div>
      </div>

      <!-- Expanded View -->
      <div v-show="isExpanded" class="mt-4 space-y-3 animate-fadeIn">
        <!-- Price Details -->
        <div class="divider my-2 text-sm">價格詳情</div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-error/10 rounded-lg p-2">
            <div class="text-xs opacity-70">上價</div>
            <div class="text-lg font-bold text-error">
              {{ item.prices.high.toFixed(1) }}
            </div>
          </div>
          <div class="bg-warning/10 rounded-lg p-2">
            <div class="text-xs opacity-70">中價</div>
            <div class="text-lg font-bold text-warning">
              {{ item.prices.middle.toFixed(1) }}
            </div>
          </div>
          <div class="bg-success/10 rounded-lg p-2">
            <div class="text-xs opacity-70">下價</div>
            <div class="text-lg font-bold text-success">
              {{ item.prices.low.toFixed(1) }}
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="divider my-2 text-sm">交易資訊</div>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
            <span class="opacity-70">交易量</span>
            <span class="font-semibold">{{ item.volume.toLocaleString() }} 公斤</span>
          </div>
          <div class="flex justify-between">
            <span class="opacity-70">交易日期</span>
            <span class="font-semibold">{{ item.tradeDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhCaretDown, PhMapPin } from '@phosphor-icons/vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
