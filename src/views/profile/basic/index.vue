<template>
  <div>
    <!-- 页面头部 -->
    <page-header-wrapper v-if="inputId!=''">
      <a-card :bordered="false">
        <!-- 显示传入的 ID -->
        <a-button @click="openReportModal(scope)" style="margin: 0 10px 10px 0;">删除帖子</a-button>
        <a-button @click="openReportStateModal(scope)" style="margin: 0 10px 10px 0;">更改状态</a-button>
        <a-button @click="checkAI()" style="margin: 0 10px 10px 0;">AI辅助审核</a-button>
        <a v-if="AIstate!==''" :style="{ color: AIstate === '正常' ? 'green' : 'red' }">
          AI认为: {{ AIstate }}
        </a>
        <a-descriptions title="文章详情">
          <a-descriptions-item label="文章ID">{{ id }}</a-descriptions-item>
          <a-descriptions-item label="标题">{{ post.title }}</a-descriptions-item>
          <a-descriptions-item label="作者">{{ post.userId }}</a-descriptions-item>
          <a-descriptions-item label="评论数">{{ post.commentCount }}</a-descriptions-item>
          <a-descriptions-item label="点赞数">{{ post.voteCount }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="post.state === 'reported' ? 'red' : 'green'">{{ post.state }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="最后更新时间">{{ formatDate(post.updatedTime) }}</a-descriptions-item>
          <a-descriptions-item label="最后修改人">{{ post.userId }}</a-descriptions-item>
          <a-descriptions-item label="发布时间">{{ formatDate(post.createdTime) }}</a-descriptions-item>
        </a-descriptions>

        <!-- 附件图片 -->
        <div v-if="post.filePaths.length" class="image-list">
          <div>内容:</div>
          <div style="white-space: pre-wrap;">{{ post.content }}</div>
          <div v-for="(url, index) in post.filePaths" :key="index" class="image-item">
            <img :src="url" alt="attachment" style="max-width: 100%; margin-bottom: 16px;" />
          </div>
        </div>
        <a-divider />

        <!-- 评论区 -->
        <div class="comment-section">
          <h3>评论 ({{ comments.length }})</h3>
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <p><strong>{{ comment.id || '匿名' }}:</strong> {{ comment.content }}</p>
            <p class="time">{{ formatDate(comment.createdTime) }}</p>
            <p v-if="comment.state==='reported'" style="color: red;" ><strong>被举报</strong></p>
            <a-button @click="onReport(comment)">举报</a-button>
          </div>
        </div>
        <!-- 举报弹窗 -->
        <a-modal
          title="举报评论"
          :visible="reportModalVisible"
          @ok="handleReportOk"
          @cancel="handleReportCancel"
          okText="提交"
          cancelText="取消"
        >
          <a-textarea
            v-model="reportReason"
            placeholder="请输入举报理由"
            :autoSize="{ minRows: 3, maxRows: 5 }"
          />
        </a-modal>
        <!-- 自定义删除弹窗 -->
        <a-modal
          :visible="reportpostModalVisible"
          title="确认删除帖子"
          @ok="handleReportpostOk"
          @cancel="handleReportpostCancel"
          okText="确认"
          cancelText="取消"
        >
          <p>是否删除帖子 "{{ post.title }}"？</p>
          <a-textarea
            v-model="reportReason"
            placeholder="请输入删除原因"
            :autoSize="{ minRows: 3, maxRows: 5 }"
          />
        </a-modal>
        <!-- 自定义更改状态弹窗 -->
        <a-modal
          :visible="reportstateModalVisible"
          title="确认更改状态"
          @ok="handleReportStateOk"
          @cancel="handleReportStateCancel"
          okText="确认"
          cancelText="取消"
        >
          <p>是否更改状态 "{{ post.title }}"？</p>
          <p>当前状态 "{{ post.state }}"</p>
          <a-form-item label="状态">
            <a-select v-model="currentstate" style="width: 100%">
              <a-select-option value="normal">正常</a-select-option>
              <a-select-option value="reported">被举报</a-select-option>
              <a-select-option value="resolved">已处理：可见</a-select-option>
              <a-select-option value="deleted">已处理：不可见</a-select-option>
            </a-select>
          </a-form-item>
        </a-modal>
      </a-card>
    </page-header-wrapper>
    <div v-else>
      <page-header-wrapper>
        <h2>请输入想要查询的帖子ID：</h2>
        <a-input
          type="text"
          v-model="inputId"
          placeholder="在此输入 ID"
          style="width: 80%; margin:0px 16px 16px 0px;"
        />
        <a-button @click="onConfirm">确定</a-button>
      </page-header-wrapper>
    </div>
  </div>
</template>

<script>
import { getpostsid, deletepostidcomment, deletepost, postsetstate,
  postAIcheck
 } from '@/api/manage'
export default {
  // 通过路由配置 props: true 后可直接以 prop 接收参数
  props: {
    id: {
      type: String,
      default: '' // 如果父组件没传，就默认为空字符串
    }
  },
  data () {
    return {
      inputId: this.id || '', // 如果有传入id就使用，否则空
      post: [],
      AIstate: '',
      comments: [],
      hasQueried: false, // 是否已经查询过（用于初次判断）
      reportModalVisible: false, // 控制举报弹窗显示
      reportReason: '', // 举报理由
      reportCommentId: null,
      reportstateModalVisible: false, // 控制更改状态弹窗显示
      currentstate: '', // 当前状态
      reportStateReason: '', // 更改状态理由
      reportpostModalVisible: false // 控制删除帖子弹窗显示
    }
  },
  methods: {
      async fetchData () {
        try {
          getpostsid(this.inputId).then(res => {
            if (res.code === 500) {
              this.$message.error('帖子不存在或已被删除')
              this.post = []
              this.comments = []
              return
            }
            console.log(res)
            this.$router.push(`/profile/basic/${this.inputId}`) // 跳转到指定的 URL
            this.post = res.post
            this.comments = res.comment
          })
        } catch (error) {
          this.$message.error('加载数据失败')
          console.error('加载数据失败', error)
        }
      },
      formatDate (datetime) {
        const date = new Date(datetime)
        return date.toLocaleString()
      },
    onConfirm () {
        if (!this.inputId.trim()) {
          // 如果用户没输入，简单提示一下
          alert('请输入有效的 ID')
          return
        }
        this.fetchData()
    },
  onReport (comment) {
    this.reportCommentId = comment.id
    this.reportReason = ''
    this.reportModalVisible = true
  },
  openReportpostModal () {
    this.reportReason = ''
    this.reportpostModalVisible = true
  },
  openReportStateModal () {
    this.currentstate = this.post.state
    this.reportstateModalVisible = true
  },
  handleReportpostOk () {
    if (!this.reportReason.trim()) {
      this.$message.warning('请填写删除原因')
      return
    }
    deletepost(this.inputId, this.reportReason).then(res => {
      this.$message.success('删除成功')
      this.reportpostModalVisible = false
    }).catch(err => {
      console.error('删除失败:', err)
      this.$message.error('删除失败，请稍后再试')
    })
  },
  checkAI () {
    this.$message.loading('AI审核中，请稍后...')
    postAIcheck(this.post.content).then(res => {
      console.log('AI审核结果:', res)
      this.AIstate = res
      this.$message.success('AI审核完成')
    }).catch(err => {
      console.error('AI审核失败:', err)
      this.$message.error('AI审核失败，请稍后再试')
    })
  },
  handleReportStateOk () {
    postsetstate(this.inputId, this.currentstate).then(res => {
      this.$message.success('更改成功')
      this.post.state = this.currentstate
      this.reportstateModalVisible = false
    }).catch(err => {
      console.error('更改失败:', err)
      this.$message.error('更改失败，请稍后再试')
    })
  },
  handleReportpostCancel () {
    console.log('取消删除')
    this.reportpostModalVisible = false
  },
  handleReportStateCancel () {
    console.log('取消删除')
    this.reportstateModalVisible = false
  },
  handleReportOk () {
    if (!this.reportReason.trim()) {
      this.$message.warning('请填写举报理由')
      return
    }
    deletepostidcomment(this.reportCommentId, this.reportReason).then(res => {
      console.log(res)
      this.$message.success('举报成功，感谢您的反馈')
      this.reportModalVisible = false
    }).catch(() => {
      this.$message.error('举报失败，请稍后再试')
    })
  },
  handleReportCancel () {
    this.reportModalVisible = false
  }
  },
  created () {
    if (this.id !== '') {
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.image-item { flex: 1 1 200px; }
.comment-section { margin-top: 24px; }
.comment { padding: 12px; border-bottom: 1px solid #f0f0f0; }
.comment .time { color: #888; font-size: 12px; }
</style>
