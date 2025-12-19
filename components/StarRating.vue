<template>
  <div class="flex items-center gap-1">
    <button
        v-for="star in 5"
        :key="star"
        type="button"
        @click="selectRating(star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
        class="text-3xl transition-all duration-200 focus:outline-none"
        :class="getStarClass(star)"
        :disabled="readonly"
    >
      ★
    </button>
    <span v-if="showValue && modelValue" class="ml-2 text-sm text-gray-600">
      {{ modelValue }}/5
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const hoverRating = ref(0)

const selectRating = (rating) => {
  if (!props.readonly) {
    emit('update:modelValue', rating)
  }
}

const getStarClass = (star) => {
  const activeRating = hoverRating.value || props.modelValue

  if (props.readonly) {
    return star <= props.modelValue
        ? 'text-yellow-400 cursor-default'
        : 'text-gray-300 cursor-default'
  }

  return star <= activeRating
      ? 'text-yellow-400 hover:text-yellow-500 cursor-pointer transform hover:scale-110'
      : 'text-gray-300 hover:text-yellow-300 cursor-pointer'
}
</script>