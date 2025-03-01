<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">词书管理</h2>

    <!-- 切换标签 -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
        <button
          class="px-6 py-3 mr-5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="wordbookTab === 'pending' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="wordbookTab = 'pending'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>待审核词书</span>
          </div>
        </button>
        <button
          class="px-6 py-3 mr-5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="wordbookTab === 'all' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="wordbookTab = 'all'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>全部词书</span>
          </div>
        </button>
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
          :class="wordbookTab === 'create' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          @click="wordbookTab = 'create'"
        >
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>创建词书</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 待审核词书列表 -->
    <div v-if="wordbookTab === 'pending'" class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词书ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词书名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建者
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词条数量
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
            <tr v-for="wordbook in pendingWordbooks" :key="wordbook.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ wordbook.id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ wordbook.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.creator }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.createTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.wordCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="wordbook.status === '已拒绝' ? 'bg-red-100 text-red-800' : (wordbook.status === '待审核' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')">
                  {{ wordbook.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="viewWordbookDetails(wordbook)"
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

    <!-- 全部词书列表 -->
    <div v-if="wordbookTab === 'all'" class="bg-white rounded-lg shadow p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词书ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词书名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建者
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                词条数量
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
            <tr v-for="wordbook in allWordbooks" :key="wordbook.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ wordbook.id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ wordbook.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.creator }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.createTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ wordbook.wordCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="wordbook.status === '已拒绝' ? 'bg-red-100 text-red-800' : (wordbook.status === '待审核' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')">
                  {{ wordbook.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="viewWordbookDetails(wordbook)"
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

    <!-- 创建词书表单 -->
    <div v-if="wordbookTab === 'create'" class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="createWordbook">
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">词书名称</label>
          <input type="text" id="title" v-model="newWordbook.title" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">词书描述</label>
          <textarea id="description" v-model="newWordbook.description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div class="mb-6">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <select id="category" v-model="newWordbook.category" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="english">英语</option>
            <option value="japanese">日语</option>
            <option value="french">法语</option>
            <option value="german">德语</option>
            <option value="spanish">西班牙语</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">词条列表</label>
          <div class="border border-gray-300 rounded-md p-4 space-y-4">
            <div v-for="(word, index) in newWordbook.words" :key="index" class="flex items-start space-x-4">
              <div class="flex-1">
                <input type="text" v-model="word.term" placeholder="词条" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2">
                <input type="text" v-model="word.definition" placeholder="释义" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2">
                <input type="text" v-model="word.example" placeholder="例句（可选）" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              </div>
              <button
                type="button"
                @click="removeWord(index)"
                class="mt-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addWord"
              class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              添加词条
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
            创建词书
          </button>
        </div>
      </form>
    </div>

    <!-- 词书详情弹窗 -->
    <div v-if="showWordbookModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">词书详情</h3>
            <button @click="showWordbookModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center">
            <span class="font-medium text-gray-700 w-24">词书ID:</span>
            <span>{{ selectedWordbook?.id }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">词书名称:</span>
            <span>{{ selectedWordbook?.title }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">创建者:</span>
            <span>{{ selectedWordbook?.creator }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">创建时间:</span>
            <span>{{ selectedWordbook?.createTime }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">分类:</span>
            <span>{{ selectedWordbook?.category }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700 w-24">词书描述:</span>
            <div class="mt-2 p-4 bg-gray-50 rounded">
              {{ selectedWordbook?.description }}
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2">词条列表:</h4>
            <div class="bg-gray-50 p-4 rounded">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">词条</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">释义</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">例句</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(word, index) in selectedWordbook?.words" :key="index">
                    <td class="px-4 py-2 text-sm">{{ word.term }}</td>
                    <td class="px-4 py-2 text-sm">{{ word.definition }}</td>
                    <td class="px-4 py-2 text-sm">{{ word.example }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="selectedWordbook?.status === '待审核'" class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            @click="rejectWordbook"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3 focus:outline-none">
            拒绝
          </button>
          <button
            @click="approveWordbook"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
            通过
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'WordbookManagementView',
  setup() {
    const wordbookTab = ref('pending')
    const showWordbookModal = ref(false)
    const selectedWordbook = ref(null)

    const newWordbook = reactive({
      title: '',
      description: '',
      category: 'english',
      words: [
        { term: '', definition: '', example: '' }
      ]
    })

    const pendingWordbooks = reactive([
      {
        id: 'W4001',
        title: '日常英语口语500句',
        creator: '用户V',
        createTime: '2025-02-18 10:30',
        wordCount: 500,
        category: '英语',
        status: '待审核',
        description: '本词书收集了日常生活中最常用的500句英语口语，适合初学者和想提高口语能力的学习者。每句都配有中文翻译和例句。',
        words: [
          { term: 'How are you doing?', definition: '你好吗？', example: 'How are you doing today? I haven\'t seen you for a while.' },
          { term: 'I appreciate it.', definition: '我很感激。', example: 'Thanks for your help. I really appreciate it.' },
          { term: 'I\'ll get back to you.', definition: '我会回复你的。', example: 'I need some time to think about it. I\'ll get back to you tomorrow.' }
        ]
      },
      {
        id: 'W4002',
        title: '商务日语入门',
        creator: '用户W',
        createTime: '2025-02-20 15:45',
        wordCount: 200,
        category: '日语',
        status: '待审核',
        description: '适合初学日语的商务人士，包含了商务场合中最常用的日语词汇和短语。',
        words: [
          { term: 'お疲れ様です', definition: '辛苦了，表示感谢他人工作的用语', example: '一日お疲れ様です。(今天辛苦了。)' },
          { term: '失礼します', definition: '打扰了，进入他人办公室或结束谈话时使用', example: '少々失礼します。(打扰一下。)' },
          { term: '申し訳ございません', definition: '非常抱歉，正式的道歉用语', example: '遅れて申し訳ございません。(很抱歉迟到了。)' }
        ]
      }
    ])

    const allWordbooks = reactive([
      {
        id: 'W4001',
        title: '日常英语口语500句',
        creator: '用户V',
        createTime: '2025-02-18 10:30',
        wordCount: 500,
        category: '英语',
        status: '待审核',
        description: '本词书收集了日常生活中最常用的500句英语口语，适合初学者和想提高口语能力的学习者。每句都配有中文翻译和例句。',
        words: [
          { term: 'How are you doing?', definition: '你好吗？', example: 'How are you doing today? I haven\'t seen you for a while.' },
          { term: 'I appreciate it.', definition: '我很感激。', example: 'Thanks for your help. I really appreciate it.' },
          { term: 'I\'ll get back to you.', definition: '我会回复你的。', example: 'I need some time to think about it. I\'ll get back to you tomorrow.' }
        ]
      },
      {
        id: 'W4002',
        title: '商务日语入门',
        creator: '用户W',
        createTime: '2025-02-20 15:45',
        wordCount: 200,
        category: '日语',
        status: '待审核',
        description: '适合初学日语的商务人士，包含了商务场合中最常用的日语词汇和短语。',
        words: [
          { term: 'お疲れ様です', definition: '辛苦了，表示感谢他人工作的用语', example: '一日お疲れ様です。(今天辛苦了。)' },
          { term: '失礼します', definition: '打扰了，进入他人办公室或结束谈话时使用', example: '少々失礼します。(打扰一下。)' },
          { term: '申し訳ございません', definition: '非常抱歉，正式的道歉用语', example: '遅れて申し訳ございません。(很抱歉迟到了。)' }
        ]
      },
      {
        id: 'W4003',
        title: '法语旅游常用词汇',
        creator: '用户X',
        createTime: '2025-02-15 09:20',
        wordCount: 150,
        category: '法语',
        status: '已通过',
        description: '收集了旅游法国时最常用的词汇和短语，包括问路、订房、点餐等场景。',
        words: [
          { term: 'Bonjour', definition: '你好', example: 'Bonjour, comment allez-vous? (你好，你好吗？)' },
          { term: 'Merci', definition: '谢谢', example: 'Merci beaucoup pour votre aide. (非常感谢你的帮助。)' },
          { term: 'Excusez-moi', definition: '对不起，打扰一下', example: 'Excusez-moi, où est la station de métro? (对不起，地铁站在哪里？)' }
        ]
      },
      {
        id: 'W4004',
        title: '德语初级语法词汇',
        creator: '用户Y',
        createTime: '2025-02-10 14:15',
        wordCount: 300,
        category: '德语',
        status: '已拒绝',
        description: '专门为德语初学者准备的语法词汇集，按照难度从易到难排序。',
        words: [
          { term: 'der, die, das', definition: '定冠词：阳性、阴性、中性', example: 'Der Mann ist groß. (这个男人很高。)' },
          { term: 'sein', definition: '是', example: 'Ich bin Student. (我是学生。)' },
          { term: 'haben', definition: '有', example: 'Ich habe ein Buch. (我有一本书。)' }
        ]
      }
    ])

    function viewWordbookDetails(wordbook) {
      selectedWordbook.value = wordbook
      showWordbookModal.value = true
    }

    function approveWordbook() {
      if (selectedWordbook.value) {
        selectedWordbook.value.status = '已通过'
        showWordbookModal.value = false
        // 这里可以添加调用API的代码
        alert('词书已通过')
      }
    }

    function rejectWordbook() {
      if (selectedWordbook.value) {
        selectedWordbook.value.status = '已拒绝'
        showWordbookModal.value = false
        // 这里可以添加调用API的代码
        alert('词书已拒绝')
      }
    }

    function addWord() {
      newWordbook.words.push({ term: '', definition: '', example: '' })
    }

    function removeWord(index) {
      newWordbook.words.splice(index, 1)
      if (newWordbook.words.length === 0) {
        addWord()
      }
    }

    function createWordbook() {
      // 这里可以添加表单验证逻辑

      // 模拟添加新词书
      const wordbook = {
        id: 'W' + (4004 + Math.floor(Math.random() * 1000)),
        title: newWordbook.title,
        creator: '管理员',
        createTime: new Date().toLocaleString(),
        wordCount: newWordbook.words.length,
        category: newWordbook.category,
        status: '已通过',
        description: newWordbook.description,
        words: [...newWordbook.words]
      }

      allWordbooks.push(wordbook)

      // 重置表单
      newWordbook.title = ''
      newWordbook.description = ''
      newWordbook.category = 'english'
      newWordbook.words = [{ term: '', definition: '', example: '' }]

      alert('词书创建成功')
      wordbookTab.value = 'all'
    }

    return {
      wordbookTab,
      showWordbookModal,
      selectedWordbook,
      newWordbook,
      pendingWordbooks,
      allWordbooks,
      viewWordbookDetails,
      approveWordbook,
      rejectWordbook,
      addWord,
      removeWord,
      createWordbook
    }
  }
})
</script>
