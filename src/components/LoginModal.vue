<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- 添加单独的背景遮罩 -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <!-- 确保内容在遮罩上层 -->
    <div class="frosted-glass rounded-lg p-6 w-96 relative z-50">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">登录</h2>

      <!-- 问题，为什么这里写w-full会超出边界 -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            class="w-92% px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
        </div>

        <div>
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            class="w-92% px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
        </div>

        <button
          type="submit"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out"
        >
          登录
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const emit = defineEmits(['close'])

const handleLogin = () => {
  // 测试阶段：直接模拟登录成功
  console.log('测试登录成功')
  // 关闭登录窗口
  emit('close')
  // 跳转到主页面或仪表板
  router.push('/dashboard')
}
</script>
