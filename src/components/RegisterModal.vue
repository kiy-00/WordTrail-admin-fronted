<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="frosted-glass rounded-lg p-6 w-96 relative z-50">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">注册</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
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

        <div>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="确认密码"
            class="w-92% px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
        </div>

        <button
          type="submit"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out"
        >
          注册
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('两次密码输入不一致')
    return
  }
  console.log('Register attempt:', {
    username: username.value,
    password: password.value
  })
}

defineEmits(['close'])
</script>
