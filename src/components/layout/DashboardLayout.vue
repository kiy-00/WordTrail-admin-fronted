<template>
  <div class="flex bg-gray-100 min-h-screen">
    <!-- 侧边栏 -->
    <Sidebar :activeSection="activeSection" @update-section="updateActiveSection" />

    <!-- 主内容区 -->
    <div class="ml-64 flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'DashboardLayout',
  components: {
    Sidebar
  },
  props: {
    activeSection: {
      type: String,
      required: true
    }
  },
  methods: {
    updateActiveSection(sectionName) {
      this.$emit('update-section', sectionName)
    }
  }
}
</script>

<script setup>
// 如果使用 <script setup> 的方式，可以这样写
import { defineProps, defineEmits } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-section'])

function updateActiveSection(sectionName) {
  emit('update-section', sectionName)
}
</script>
