<template>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <page-header-wrapper content="可以查看所有的用户">
      <template v-slot:extraContent>
        <div style="width: 155px; margin-top: -20px;">
          <img style="width: 100%" :src="extraImage" />
        </div>
      </template>
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="标准列表"
      >

        <!-- 表格展示用户数据 -->
        <a-table
          :dataSource="dataSource"
          :pagination="false"
          rowKey="id"
          bordered
          style="margin-top: 10px;"
          :scroll="{ x: '100%' }"
        >
          <a-table-column
            v-for="column in columns"
            :key="column.key"
            :title="column.title"
            :dataIndex="column.dataIndex"
          />
          <!-- 添加“操作”列 -->
          <a-table-column title="操作" key="actions" width="10%">
            <template #default="scope">
              <!-- 帖子列表的操作按钮 -->
              <a @click="openReportStateModal(scope)">更改状态</a>
            </template>
          </a-table-column>
        </a-table>
        <!-- 自定义分页放在表格下面 -->
        <div style="margin-top: 16px; text-align: right; display: flex; justify-content: flex-end; align-items: center;">
          <!-- 跳转到第一页 -->
          <a-button @click="goToFirstPage" :disabled="currentPage === 1" style="margin-right: 8px;">
            第一页
          </a-button>

          <!-- 跳转到上一页 -->
          <a-button @click="goToPreviousPage" :disabled="currentPage === 1" style="margin-right: 8px;">
            上一页
          </a-button>

          <!-- 当前页码输入框 -->
          <span>
            <a-input-number
              v-model="currentPage"
              :min="1"
              :max="totalPages"
              @change="handlePageInputChange"
              style="width: 60px; margin-right: 8px;"
            />
            / {{ totalPages }}
          </span>

          <!-- 跳转到下一页 -->
          <a-button @click="goToNextPage" :disabled="currentPage === totalPages" style="margin-right: 8px;">
            下一页
          </a-button>

          <!-- 跳转到最后一页 -->
          <a-button @click="goToLastPage" :disabled="currentPage === totalPages">
            最后一页
          </a-button>
        </div>
      </a-card>
      <div>

        <!-- 自定义更改状态弹窗 -->
        <a-modal
          :visible="reportstateModalVisible"
          title="确认更改状态"
          @ok="handleReportStateOk"
          @cancel="handleReportStateCancel"
          okText="确认"
          cancelText="取消"
        >
          <p>是否更改状态 "{{ currentPost?.username }}"？</p>
          <p>当前状态 "{{ currentPost?.state }}"</p>
          <a-form-item label="状态">
            <a-select v-model="currentstate" style="width: 100%">
              <a-select-option value="normal">正常</a-select-option>
              <a-select-option value="reported">被举报</a-select-option>
              <a-select-option value="resolved">已处理：可见</a-select-option>
              <a-select-option value="deleted">已处理：不可见</a-select-option>
            </a-select>
          </a-form-item>
        </a-modal>
      </div>
    </page-header-wrapper>
  </a-spin>
</template>

<script>
import {
  getuserscount,
  getuser,
  postusersetstate
 } from '@/api/manage'

const columns = [
      {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '帖子数',
        dataIndex: 'postCount',
        key: 'postCount'
      },
      {
        title: '评论数',
        dataIndex: 'commentCount',
        key: 'commentCount'
      },
      {
        title: '点赞数',
        dataIndex: 'likeCount',
        key: 'likeCount'
      },
      {
        title: '踩数',
        dataIndex: 'dislikeCount',
        key: 'dislikeCount'
      },
      {
        title: '收藏数',
        dataIndex: 'favoriteCount',
        key: 'favoriteCount'
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state'
      }
]

export default {
  name: 'CommunityList',
  data () {
    return {
      state: 'all',
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的条数
      allcount: 0, // 总条数
      totalPages: 0, // 总页数
      searchKind: 'post', // 搜索类型
      searchKeyword: '', // 搜索关键字
      searchData: [], // 搜索结果数据
      nowchoice: 'all', // 当前选择的状态
      reportModalVisible: false,
      reportReason: '',
      reportstateModalVisible: false,
      currentstate: 'normal', // 当前选择的状态
      currentPost: null, // 被举报的帖子对象
      loading: false,
      reportsearchModalVisible: false,
      columns
    }
  },
  mounted () {
    // 获取总帖子数并计算总页数
    this.Getusercount().then(() => {
      this.totalPages = Math.ceil(this.allcount / this.pageSize)
      console.log(this.totalPages)
      this.Getuser(this.currentPage)
    })
  },
  methods: {
    // 获取总用户数
    Getusercount () {
      this.loading = true
      return getuserscount().then(res => {
        console.log(res)
        this.allcount = res.count
      }).finally(() => {
        this.loading = false
      })
    },

    // 获取指定页码的帖子数据
    Getuser (page) {
      this.loading = true
      getuser(page).then(res => {
        this.dataSource = res.data
      })
      .finally(() => {
        this.loading = false
      })
    },

    openReportStateModal (scope) {
      this.currentPost = scope
      this.currentstate = scope.state
      this.reportstateModalVisible = true
    },
    // 处理页码变化
    handlePageChange (page) {
      this.currentPage = page
      this.Getuser(page) // 获取对应页码的数据
    },

    // 跳转到第一页
    goToFirstPage () {
      this.currentPage = 1
      this.Getuser(this.currentPage)
    },

    // 跳转到上一页
    goToPreviousPage () {
      if (this.currentPage > 1) {
        this.currentPage -= 1
        this.Getuser(this.currentPage)
      }
    },

    // 跳转到下一页
    goToNextPage () {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
        this.Getuser(this.currentPage)
      }
    },

    // 跳转到最后一页
    goToLastPage () {
      this.currentPage = this.totalPages
      this.Getuser(this.currentPage)
    },

    // 处理页码输入框变化
    handlePageInputChange (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.Getuser(this.currentPage)
      } else {
        this.$message.error('请输入有效的页码')
      }
    },
    handleReportStateOk () {
      postusersetstate(this.currentPost.id, this.currentstate).then(res => {
        this.$message.success('更改成功')
        this.reportstateModalVisible = false
        this.Getuser(this.currentPage) // 刷新帖子列表
      }).catch(err => {
        console.error('更改失败:', err)
        this.$message.error('更改失败，请稍后再试')
      })
    },
    handleReportStateCancel () {
      console.log('取消删除')
      this.reportstateModalVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .card-list {
    :deep(.ant-card-body:hover) {
      .ant-card-meta-title>a {
        color: @primary-color;
      }
    }

    :deep(.ant-card-meta-title) {
      margin-bottom: 12px;

      &>a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0,0,0,.85);
      }
    }

    :deep(.meta-content) {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-box-orient: vertical;

      margin-bottom: 1em;
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

</style>
