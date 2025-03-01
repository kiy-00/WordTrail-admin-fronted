<template>
  <div class="relative min-h-screen flex items-center justify-center bg-login">
    <!-- 使用 v-show 替代 v-if，并添加 transition -->
    <Transition name="fade">
      <div v-show="!showLoginModal && !showRegisterModal" class="frosted-glass p-8 rounded-xl relative z-10">
        <div class="flex flex-col space-y-4">
          <div>
            <h1 class="text-2xl font-bold text-center mb-4 text-gray-800">WordTrail后台管理系统</h1>
          </div>
          <button
            @click="showLoginModal = true"
            class="px-20 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            登录
          </button>
          <button
            @click="showRegisterModal = true"
            class="px-20 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            注册
          </button>
        </div>
      </div>
    </Transition>

    <!-- 增加 z-index 确保模态框在最上层 -->
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" class="z-50" />
    <RegisterModal v-if="showRegisterModal" @close="showRegisterModal = false" class="z-50" />
  </div>
  <FooterView/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginModal from '../components/LoginModal.vue'
import RegisterModal from '../components/RegisterModal.vue'
import FooterView from '@/components/FooterView.vue'

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
</script>

<style>
.bg-login {
  background-image: url('@/assets/images/login-bg.jpg');
  height: 100vh;  /* 设置高度为视口高度 */
  width: 100vw;  /* 设置宽度为视口宽度 */
  position: fixed;  /* 固定定位 */
  top: 0;
  left: 0;
  z-index: -1;  /* 确保背景在最底层 */
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
