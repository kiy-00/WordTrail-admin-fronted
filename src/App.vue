<template>
  <DashboardLayout :activeSection="activeSection" @update-section="updateActiveSection">
    <component :is="currentView" />
  </DashboardLayout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserManagement from '@/views/UserManagement.vue'
import PostManagement from '@/views/PostManagement.vue'
import CommentManagement from '@/views/CommentManagement.vue'
import WordbookManagement from '@/views/WordbookManagement.vue'

export default defineComponent({
  name: 'App',
  components: {
    DashboardLayout,
    Dashboard,
    UserManagement,
    PostManagement,
    CommentManagement,
    WordbookManagement
  },
  setup() {
    const activeSection = ref('dashboard')

    const currentView = computed(() => {
      switch (activeSection.value) {
        case 'dashboard':
          return Dashboard
        case 'users':
          return UserManagement
        case 'posts':
          return PostManagement
        case 'comments':
          return CommentManagement
        case 'wordbooks':
          return WordbookManagement
        default:
          return Dashboard
      }
    })

    function updateActiveSection(sectionName) {
      activeSection.value = sectionName
    }

    return {
      activeSection,
      currentView,
      updateActiveSection
    }
  }
})
</script>
