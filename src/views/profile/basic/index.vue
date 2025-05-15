<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 显示传入的 ID -->
      <a-descriptions title="文章详情">
        <a-descriptions-item label="文章ID">{{ id }}</a-descriptions-item>
        <a-descriptions-item label="标题">{{ post.title }}</a-descriptions-item>
        <a-descriptions-item label="内容">
          <div style="white-space: pre-wrap;">{{ post.content }}</div>
        </a-descriptions-item>
        <a-descriptions-item label="作者">{{ post.userId }}</a-descriptions-item>
        <a-descriptions-item label="评论数">{{ post.commentCount }}</a-descriptions-item>
        <a-descriptions-item label="点赞数">{{ post.voteCount }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="post.state === 'normal' ? 'green' : 'red'">{{ post.state }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最后更新时间">{{ formatDate(post.updatedTime) }}</a-descriptions-item>
        <a-descriptions-item label="最后修改人">{{ post.userId }}</a-descriptions-item>
        <a-descriptions-item label="发布时间">{{ formatDate(post.createdTime) }}</a-descriptions-item>
      </a-descriptions>

      <!-- 附件图片 -->
      <div v-if="post.filePaths.length" class="image-list">
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
        </div>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getpostsid } from '@/api/manage'
export default {
  // 通过路由配置 props: true 后可直接以 prop 接收参数
  props: ['id'],
  data () {
    return {
      inputId: this.id || '', // 如果有传入id就使用，否则空
      post: [],
      comments: [],
      hasQueried: false // 是否已经查询过（用于初次判断）
    }
  },
  methods: {
    async fetchData () {
      try {
        getpostsid(this.id).then(res => {
          console.log(res)
          this.post = res.post
          this.comments = res.comment
        })
      } catch (error) {
        console.error('加载数据失败', error)
      }
    },
    formatDate (datetime) {
      const date = new Date(datetime)
      return date.toLocaleString()
    }
  },
  created () {
    this.fetchData()
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
