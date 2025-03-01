<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">评论管理</h2>

    <!-- 切换标签 -->
<div class="mb-6">
  <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
    <button
      class="px-6 py-3 mr-5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
      :class="commentTab === 'reported' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
      @click="commentTab = 'reported'"
    >
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>被举报评论</span>
      </div>
    </button>
    <button
      class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
      :class="commentTab === 'all' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
      @click="commentTab = 'all'"
    >
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span>全部评论</span>
      </div>
    </button>
  </div>
</div>

    <!-- 被举报评论列表 -->
    <div v-if="commentTab === 'reported'" class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                评论ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属帖子
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                评论者
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                评论内容
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布时间
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
            <tr v-for="comment in reportedComments" :key="comment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ comment.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ comment.postTitle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ comment.author }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ comment.content }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ comment.publishTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="comment.status === '已删除' ? 'bg-red-100 text-red-800' : (comment.status === '审核中' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')">
                  {{ comment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="showCommentDetails(comment)"
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

    <!-- 全部评论列表 -->
    <div v-if="commentTab === 'all'" class="bg-white rounded-lg shadow p-6">
      <p>这里是全部评论的列表</p>
    </div>

    <!-- 评论详情弹窗 -->
    <div v-if="showCommentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">评论举报详情</h3>
            <button @click="showCommentModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">评论ID:</span>
            <span>{{ selectedComment?.id }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">所属帖子:</span>
            <span>{{ selectedComment?.postTitle }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">评论者:</span>
            <span>{{ selectedComment?.author }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">发布时间:</span>
            <span>{{ selectedComment?.publishTime }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">评论内容:</span>
            <div class="mt-2 p-4 bg-gray-50 rounded">
              {{ selectedComment?.content }}
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2">举报记录:</h4>
            <div v-for="(report, index) in selectedComment?.reports" :key="index" class="bg-gray-50 p-4 rounded mb-3">
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
            @click="deleteComment"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
            删除评论
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'CommentManagementView',
  setup() {
    const commentTab = ref('reported')
    const showCommentModal = ref(false)
    const selectedComment = ref(null)

    const reportedComments = reactive([
      {
        id: 'C3001',
        postTitle: '如何快速提高英语口语水平？',
        author: '用户L',
        content: '这种方法根本不管用，我试过了，纯属浪费时间。建议大家不要尝试，简直是智商税。',
        publishTime: '2025-02-16 11:45',
        status: '审核中',
        reports: [
          {
            reporterName: '用户M',
            reportTime: '2025-02-23 09:30',
            reason: '恶意评论',
            description: '这条评论没有提供任何建设性意见，纯粹是为了贬低原帖作者。'
          }
        ]
      },
      {
        id: 'C3002',
        postTitle: '分享我的留学经验和建议',
        author: '用户N',
        content: '楼主根本没出过国吧？说的这些都是错的，我在英国读了三年书，完全不是这样的。大家别被骗了。',
        publishTime: '2025-02-19 14:20',
        status: '审核中',
        reports: [
          {
            reporterName: '用户O',
            reportTime: '2025-02-22 16:15',
            reason: '人身攻击',
            description: '评论者质疑原帖作者的经历，并使用了轻蔑的语气进行攻击。'
          },
          {
            reporterName: '用户P',
            reportTime: '2025-02-21 10:40',
            reason: '不实信息',
            description: '评论者自称有留学经验，但其言论与实际情况不符。'
          }
        ]
      },
      {
        id: 'C3003',
        postTitle: '学习日语最好的教材推荐',
        author: '用户Q',
        content: '要学就学X语，日语有什么好学的？X国才是未来。楼主思想有问题吧？',
        publishTime: '2025-02-20 19:35',
        status: '已删除',
        reports: [
          {
            reporterName: '用户R',
            reportTime: '2025-02-22 08:25',
            reason: '政治敏感',
            description: '评论带有明显的政治倾向，可能引起不必要的争论。'
          },
          {
            reporterName: '用户S',
            reportTime: '2025-02-21 21:10',
            reason: '言语攻击',
            description: '对楼主进行了不必要的人格攻击。'
          }
        ]
      },
      {
        id: 'C3004',
        postTitle: '德语学习小组招募成员',
        author: '用户T',
        content: '上次参加了这个小组，感觉就是在浪费时间，组织者水平一般，还爱装懂。不推荐加入。',
        publishTime: '2025-02-20 09:15',
        status: '已驳回',
        reports: [
          {
            reporterName: '用户U',
            reportTime: '2025-02-21 15:40',
            reason: '不实评价',
            description: '该用户从未参加过我们的学习小组，这是恶意抹黑。'
          }
        ]
      }
    ])

    function showCommentDetails(comment) {
      selectedComment.value = comment
      showCommentModal.value = true
    }

    function deleteComment() {
      if (selectedComment.value) {
        selectedComment.value.status = '已删除'
        showCommentModal.value = false
        // 这里可以添加调用API的代码
        alert('评论已删除')
      }
    }

    function rejectReport() {
      if (selectedComment.value) {
        selectedComment.value.status = '已驳回'
        showCommentModal.value = false
        // 这里可以添加调用API的代码
        alert('举报已驳回')
      }
    }

    return {
      commentTab,
      showCommentModal,
      selectedComment,
      reportedComments,
      showCommentDetails,
      deleteComment,
      rejectReport
    }
  }
})
</script>
