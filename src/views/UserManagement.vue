<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">用户管理</h2>

    <!-- 切换标签 -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
        <button
          class="px-6 py-3 mr-5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="userTab === 'reported' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="userTab = 'reported'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>被举报用户</span>
          </div>
        </button>
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="userTab === 'all' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="userTab = 'all'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>全部用户</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 被举报用户列表 -->
    <div v-if="userTab === 'reported'" class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报次数
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最近举报时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in reportedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.reportCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastReportTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.status === '已封禁' ? 'bg-red-100 text-red-800' : (user.status === '审核中' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="showReportDetails(user)"
                  class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 flex items-center space-x-1 text-sm font-medium shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>查看详情</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 全部用户列表 -->
    <div v-if="userTab === 'all'" class="bg-white rounded-lg shadow p-6">
      <p>这里是全部用户的列表</p>
    </div>

    <!-- 举报详情弹窗 -->
    <div v-if="showReportModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">用户举报详情</h3>
            <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">用户ID:</span>
            <span>{{ selectedUser?.id }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">用户名:</span>
            <span>{{ selectedUser?.username }}</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">注册时间:</span>
            <span>{{ selectedUser?.registerTime }}</span>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2">举报记录:</h4>
            <div v-for="(report, index) in selectedUser?.reports" :key="index" class="bg-gray-50 p-4 rounded mb-3">
              <div class="mb-2">
                <span class="font-medium text-gray-700">举报人:</span>
                <span class="ml-2">{{ report.reporterName }}</span>
              </div>
              <div class="mb-2">
                <span class="font-medium text-gray-700">举报时间:</span>
                <span class="ml-2">{{ report.reportTime }}</span>
              </div>
              <div class="mb-2">
                <span class="font-medium text-gray-700">举报原因:</span>
                <span class="ml-2">{{ report.reason }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">举报描述:</span>
                <p class="mt-1 text-gray-600">{{ report.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            @click="rejectReport"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3 focus:outline-none">
            驳回举报
          </button>
          <button
            @click="banUser"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
            封禁用户
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'UserManagementView',
  setup() {
    const userTab = ref('reported')
    const showReportModal = ref(false)
    const selectedUser = ref(null)

    const reportedUsers = reactive([
      {
        id: 'U1001',
        username: '用户A',
        reportCount: 3,
        lastReportTime: '2025-02-24 15:23',
        status: '审核中',
        registerTime: '2023-05-10',
        reports: [
          {
            reporterName: '用户B',
            reportTime: '2025-02-24 15:23',
            reason: '发布垃圾内容',
            description: '该用户频繁发布广告信息，干扰社区正常讨论。'
          },
          {
            reporterName: '用户C',
            reportTime: '2025-02-22 09:45',
            reason: '不当言论',
            description: '在多个帖子下发表攻击性言论，造成不良影响。'
          },
          {
            reporterName: '用户D',
            reportTime: '2025-02-20 13:18',
            reason: '违规行为',
            description: '疑似使用脚本批量发帖，扰乱社区秩序。'
          }
        ]
      },
      {
        id: 'U1002',
        username: '用户E',
        reportCount: 1,
        lastReportTime: '2025-02-23 10:15',
        status: '审核中',
        registerTime: '2024-01-15',
        reports: [
          {
            reporterName: '用户F',
            reportTime: '2025-02-23 10:15',
            reason: '冒充他人',
            description: '使用与知名用户相似的名称和头像，诱导他人点击链接。'
          }
        ]
      },
      {
        id: 'U1003',
        username: '用户G',
        reportCount: 2,
        lastReportTime: '2025-02-22 16:47',
        status: '已封禁',
        registerTime: '2023-08-22',
        reports: [
          {
            reporterName: '用户H',
            reportTime: '2025-02-22 16:47',
            reason: '侵犯隐私',
            description: '在评论中发布他人的私人信息。'
          },
          {
            reporterName: '用户I',
            reportTime: '2025-02-21 14:33',
            reason: '违规内容',
            description: '发布含有敏感内容的帖子。'
          }
        ]
      },
      {
        id: 'U1004',
        username: '用户J',
        reportCount: 1,
        lastReportTime: '2025-02-21 09:30',
        status: '已驳回',
        registerTime: '2024-06-05',
        reports: [
          {
            reporterName: '用户K',
            reportTime: '2025-02-21 09:30',
            reason: '冒犯内容',
            description: '在讨论中使用了可能引起争议的比喻。'
          }
        ]
      }
    ])

    function showReportDetails(user) {
      selectedUser.value = user
      showReportModal.value = true
    }

    function banUser() {
      if (selectedUser.value) {
        selectedUser.value.status = '已封禁'
        showReportModal.value = false
        // 这里可以添加调用API的代码
        alert('用户已封禁')
      }
    }

    function rejectReport() {
      if (selectedUser.value) {
        selectedUser.value.status = '已驳回'
        showReportModal.value = false
        // 这里可以添加调用API的代码
        alert('举报已驳回')
      }
    }

    return {
      userTab,
      showReportModal,
      selectedUser,
      reportedUsers,
      showReportDetails,
      banUser,
      rejectReport
    }
  }
})
</script>
