<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">帖子管理</h2>

    <!-- 切换标签 -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
        <button
          class="px-6 py-3 mr-5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="postTab === 'reported' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="postTab = 'reported'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>被举报帖子</span>
          </div>
        </button>
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="postTab === 'all' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="postTab = 'all'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>全部帖子</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 被举报帖子列表 -->
    <div v-if="postTab === 'reported'" class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                帖子ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作者
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报次数
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
            <tr v-for="post in reportedPosts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ post.id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ post.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ post.author }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ post.publishTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ post.reportCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="post.status === '已删除' ? 'bg-red-100 text-red-800' : (post.status === '审核中' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')">
                  {{ post.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="showPostDetails(post)"
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

    <!-- 全部帖子列表 -->
    <div v-if="postTab === 'all'" class="bg-white rounded-lg shadow p-6">
      <p>这里是全部帖子的列表</p>
    </div>

    <!-- 帖子详情弹窗 -->
    <div v-if="showPostModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">帖子举报详情</h3>
            <button @click="showPostModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">帖子ID:</span>
            <span>{{ selectedPost?.id }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">标题:</span>
            <span>{{ selectedPost?.title }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">作者:</span>
            <span>{{ selectedPost?.author }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">发布时间:</span>
            <span>{{ selectedPost?.publishTime }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">帖子内容:</span>
            <div class="mt-2 p-4 bg-gray-50 rounded">
              {{ selectedPost?.content }}
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2">举报记录:</h4>
            <div v-for="(report, index) in selectedPost?.reports" :key="index" class="bg-gray-50 p-4 rounded mb-3">
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
            @click="deletePost"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
            删除帖子
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'PostManagementView',
  setup() {
    const postTab = ref('reported')
    const showPostModal = ref(false)
    const selectedPost = ref(null)

    const reportedPosts = reactive([
      {
        id: 'P2001',
        title: '如何快速提高英语口语水平？',
        author: '用户A',
        publishTime: '2025-02-15 10:30',
        reportCount: 2,
        status: '审核中',
        content: '我一直在学习英语，但是口语始终无法提高。请问有什么好的方法可以快速提高英语口语水平？我已经尝试了看英语电影和听英语歌曲，但效果不明显。',
        reports: [
          {
            reporterName: '用户B',
            reportTime: '2025-02-22 14:20',
            reason: '广告内容',
            description: '该帖子实际上是在推广某英语培训机构，隐藏了商业推广内容。'
          },
          {
            reporterName: '用户C',
            reportTime: '2025-02-21 09:15',
            reason: '重复发帖',
            description: '该用户在多个板块重复发布相同内容，疑似刷屏。'
          }
        ]
      },
      {
        id: 'P2002',
        title: '分享我的留学经验和建议',
        author: '用户D',
        publishTime: '2025-02-18 16:45',
        reportCount: 1,
        status: '审核中',
        content: '最近收到了英国某大学的录取通知书，想分享一下我的申请经验和一些建议，希望对准备出国留学的同学有所帮助。首先，要提前准备语言考试...',
        reports: [
          {
            reporterName: '用户E',
            reportTime: '2025-02-23 11:30',
            reason: '虚假信息',
            description: '该帖子中提到的某些大学申请条件与官方要求不符，可能误导其他用户。'
          }
        ]
      },
      {
        id: 'P2003',
        title: '学习日语最好的教材推荐',
        author: '用户F',
        publishTime: '2025-02-20 08:25',
        reportCount: 3,
        status: '已删除',
        content: '我想开始学习日语，请问有哪些比较好的入门教材推荐？最好是适合自学的，因为我没有报培训班的打算。希望能推荐一些循序渐进的学习资料。',
        reports: [
          {
            reporterName: '用户G',
            reportTime: '2025-02-24 10:20',
            reason: '不当链接',
            description: '帖子中包含一些指向盗版资源的链接。'
          },
          {
            reporterName: '用户H',
            reportTime: '2025-02-23 15:40',
            reason: '版权问题',
            description: '提供了一些侵犯版权的电子书下载方式。'
          },
          {
            reporterName: '用户I',
            reportTime: '2025-02-22 19:10',
            reason: '违规内容',
            description: '帖子中包含一些违反社区规则的内容。'
          }
        ]
      },
      {
        id: 'P2004',
        title: '德语学习小组招募成员',
        author: '用户J',
        publishTime: '2025-02-19 14:10',
        reportCount: 1,
        status: '已驊回',
        content: '我们是一个刚成立的德语学习小组，目前有5名成员，都是德语初学者。我们计划每周六下午在线上进行学习交流，欢迎有兴趣的朋友加入！',
        reports: [
          {
            reporterName: '用户K',
            reportTime: '2025-02-21 17:25',
            reason: '私下交易',
            description: '疑似在招募付费学习小组成员，但没有在帖子中明确说明。'
          }
        ]
      }
    ])

    function showPostDetails(post) {
      selectedPost.value = post
      showPostModal.value = true
    }

    function deletePost() {
      if (selectedPost.value) {
        selectedPost.value.status = '已删除'
        showPostModal.value = false
        // 这里可以添加调用API的代码
        alert('帖子已删除')
      }
    }

    function rejectReport() {
      if (selectedPost.value) {
        selectedPost.value.status = '已驳回'
        showPostModal.value = false
        // 这里可以添加调用API的代码
        alert('举报已驳回')
      }
    }

    return {
      postTab,
      showPostModal,
      selectedPost,
      reportedPosts,
      showPostDetails,
      deletePost,
      rejectReport
    }
  }
})
</script>
