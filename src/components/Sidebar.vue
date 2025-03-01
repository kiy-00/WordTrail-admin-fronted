<template>
  <div class="fixed top-0 left-0 w-64 bg-gray-800 h-screen overflow-y-auto">
    <div class="flex items-center justify-center h-16 bg-gray-900 text-white">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>
    <ul class="text-white">
      <li
        v-for="item in menuItems"
        :key="item.name"
        class="p-4 hover:bg-gray-700 cursor-pointer"
        :class="{ 'bg-gray-700': activeSection === item.value }"
        @click="handleMenuClick(item.value)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    activeSection: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      menuItems: [
        { name: '仪表盘', value: 'dashboard' },
        { name: '用户管理', value: 'users' },
        { name: '帖子管理', value: 'posts' },
        { name: '评论管理', value: 'comments' },
        { name: '词书管理', value: 'wordbooks' }
      ]
    }
  },
  methods: {
    handleMenuClick(sectionName) {
      this.$emit('update-section', sectionName)
    }
  }
}
</script>

<script setup>
// 如果使用 <script setup> 的方式，可以这样写
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-section'])

const menuItems = [
  { name: '仪表盘', value: 'dashboard' },
  { name: '用户管理', value: 'users' },
  { name: '帖子管理', value: 'posts' },
  { name: '评论管理', value: 'comments' },
  { name: '词书管理', value: 'wordbooks' }
]

function handleMenuClick(sectionName) {
  emit('update-section', sectionName)
}
</script>
