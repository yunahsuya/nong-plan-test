<template>
  <div class="card bg-base-100 shadow-lg mb-6">
    <div class="card-body">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="form-control flex-1">
          <label class="label">
            <span class="label-text font-semibold text-sm">搜尋作物</span>
          </label>
          <input
            :value="modelValue"
            type="text"
            placeholder="輸入作物名稱，例如：甘藍、番茄..."
            class="input input-bordered w-full text-base"
            @input="$emit('update:modelValue', $event.target.value)"
            @keyup.enter="$emit('search')"
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-sm">快速操作</span>
          </label>
          <div class="flex gap-2">
            <button class="btn btn-primary text-sm" @click="$emit('search')">
              <PhMagnifyingGlass :size="20" />
              搜尋
            </button>
            <button class="btn btn-secondary text-sm" @click="$emit('show-all')">
              <PhListBullets :size="20" />
              顯示全部
            </button>
            <button class="btn btn-ghost text-sm" @click="$emit('refresh')">
              <PhArrowClockwise :size="20" />
              刷新
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhMagnifyingGlass, PhListBullets, PhArrowClockwise } from '@phosphor-icons/vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue', 'search', 'show-all', 'refresh'])
</script>
