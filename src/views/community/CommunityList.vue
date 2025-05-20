<template>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <page-header-wrapper content="可以查看所有的帖子">
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
        <div slot="extra">
          <a-button @click="searchnormal">正常</a-button>
          <a-button @click="searchreported">被举报</a-button>
          <a-button @click="searchdeleted">已处理：不可见</a-button>
          <a-button @click="searchresolved">已处理：可见</a-button>
          <a-select v-model="searchKind" style="width: 100px;">
            <a-select-option value="post">帖子名称</a-select-option>
            <a-select-option value="userId">用户Id</a-select-option>
          </a-select>
          <a-input-search
            v-model="searchKeyword"
            style="margin-left: 16px; width: 272px;"
            :placeholder="getPlaceholder"
            @search="handleSearch"
          />
        </div>

        <!-- 表格展示帖子数据 -->
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
              <a @click="openReportModal(scope)">删除帖子</a>
              <p></p>
              <a @click="openReportStateModal(scope)">更改状态</a>
              <p></p>
              <a @click="openReportInfoModal(scope)">查看详情</a>
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

        <!-- 自定义删除弹窗 -->
        <a-modal
          :visible="reportModalVisible"
          title="确认删除帖子"
          @ok="handleReportOk"
          @cancel="handleReportCancel"
          okText="确认"
          cancelText="取消"
        >
          <p>是否删除帖子 "{{ currentPost?.title }}"？</p>
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
          <p>是否更改状态 "{{ currentPost?.title }}"？</p>
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
        <!-- 自定义搜索弹窗 -->
        <a-modal
          :visible="reportsearchModalVisible"
          title="搜索"
          @cancel="handleReportSearchCancel"
          :width="'80vw'"
          :footer="null"
        >
          <!-- 表格展示帖子数据 -->
          <a-table
            :dataSource="searchData"
            :pagination="{ pageSize: 5 }"
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
                <a @click="openReportModal(scope)">删除帖子</a>
                <p></p>
                <a @click="openReportStateModal(scope)">更改状态</a>
              </template>
            </a-table-column>
          </a-table>
        </a-modal>
      </div>
    </page-header-wrapper>
  </a-spin>
</template>

<script>
import { getsearchpoststate,
  getpostcount,
  getpost,
  getsearchposttitle,
  getsearchpostuserId,
  deletepost,
  postsetstate
 } from '@/api/manage'

const columns = [
  {
    title: '帖子Id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '帖子标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '帖子更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime'
  },
  {
    title: '帖子创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime'
  },
  {
    title: '帖子内容',
    dataIndex: 'content',
    key: 'content'
  },
  {
    title: '帖子发布用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '帖子发布用户Id',
    dataIndex: 'userId',
    key: 'userId'
  },
  {
    title: '帖子状态',
    dataIndex: 'state',
    key: 'state'
  },
  {
    title: '帖子评论数',
    dataIndex: 'commentCount',
    key: 'commentCount'
  },
  {
    title: '帖子点赞数',
    dataIndex: 'voteCount',
    key: 'voteCount'
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
    this.Getpostcount().then(() => {
      this.totalPages = Math.ceil(this.allcount / this.pageSize)
      console.log(this.totalPages)
      this.Getpost(this.currentPage)
    })
  },
  computed: {
    getPlaceholder () {
      return this.searchKind === 'post' ? '请输入帖子名称' : '请输入用户ID'
    }
  },
  methods: {
    // 获取总帖子数
    Getpostcount () {
      this.loading = true
      return getpostcount().then(res => {
        this.allcount = res.data[0].count
      }).finally(() => {
        this.loading = false
      })
    },

    // 获取指定页码的帖子数据
    Getpost (page) {
      this.loading = true
      getpost(page).then(res => {
        this.dataSource = res.data
      })
      .finally(() => {
        this.loading = false
      })
    },

    // 处理页码变化
    handlePageChange (page) {
      this.currentPage = page
      this.Getpost(page) // 获取对应页码的数据
    },

    // 搜索功能
    handleSearch () {
      this.loading = true
      // 根据搜索关键字过滤数据
      if (this.searchKind === 'post') {
        getsearchposttitle(this.searchKeyword).then(res => {
          this.reportsearchModalVisible = true
          this.searchData = res.data
        }).finally(() => {
          this.loading = false
        })
      } else if (this.searchKind === 'userId') {
        getsearchpostuserId(this.searchKeyword).then(res => {
          this.reportsearchModalVisible = true
          this.searchData = res.data
        }).finally(() => {
          this.loading = false
        })
      }
    },

    // 搜索正常状态的帖子
    searchnormal () {
      this.loading = true
      this.state = 'normal'
      getsearchpoststate(this.state).then(res => {
        this.searchData = res.data
        this.reportsearchModalVisible = true
      }).finally(() => {
        this.loading = false
      })
    },
    // 搜索被举报的帖子
    searchreported () {
      this.loading = true
      this.state = 'reported'
      getsearchpoststate(this.state).then(res => {
        this.searchData = res.data
        this.reportsearchModalVisible = true
      }).finally(() => {
        this.loading = false
      })
    },
    // 搜索已处理的帖子
    searchdeleted () {
      this.loading = true
      this.state = 'deleted'
      getsearchpoststate(this.state).then(res => {
        this.searchData = res.data
        this.reportsearchModalVisible = true
      }).finally(() => {
        this.loading = false
      })
    },
    // 搜索已处理的帖子
    searchresolved () {
      this.loading = true
      this.state = 'resolved'
      getsearchpoststate(this.state).then(res => {
        this.searchData = res.data
        this.reportsearchModalVisible = true
      }).finally(() => {
        this.loading = false
      })
    },

    // 跳转到第一页
    goToFirstPage () {
      this.currentPage = 1
      this.Getpost(this.currentPage)
    },

    // 跳转到上一页
    goToPreviousPage () {
      if (this.currentPage > 1) {
        this.currentPage -= 1
        this.Getpost(this.currentPage)
      }
    },

    // 跳转到下一页
    goToNextPage () {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
        this.Getpost(this.currentPage)
      }
    },

    // 跳转到最后一页
    goToLastPage () {
      this.currentPage = this.totalPages
      this.Getpost(this.currentPage)
    },

    // 处理页码输入框变化
    handlePageInputChange (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.Getpost(this.currentPage)
      } else {
        this.$message.error('请输入有效的页码')
      }
    },
    openReportModal (scope) {
      this.currentPost = scope
      this.reportReason = ''
      this.reportModalVisible = true
    },
    openReportStateModal (scope) {
      this.currentPost = scope
      this.currentstate = scope.state
      this.reportstateModalVisible = true
    },
    openReportInfoModal (scope) {
      const postId = scope.id // 获取帖子 ID
      this.$router.push(`/profile/basic/${postId}`) // 跳转到指定的 URL
    },
    handleReportOk () {
      if (!this.reportReason.trim()) {
        this.$message.warning('请填写删除原因')
        return
      }
      deletepost(this.currentPost.id, this.reportReason).then(res => {
        this.$message.success('删除成功')
        this.reportModalVisible = false
        this.Getpost(this.currentPage) // 刷新帖子列表
      }).catch(err => {
        console.error('删除失败:', err)
        this.$message.error('删除失败，请稍后再试')
      })
    },
    handleReportStateOk () {
      postsetstate(this.currentPost.id, this.currentstate).then(res => {
        this.$message.success('更改成功')
        this.reportstateModalVisible = false
        this.Getpost(this.currentPage) // 刷新帖子列表
      }).catch(err => {
        console.error('更改失败:', err)
        this.$message.error('更改失败，请稍后再试')
      })
    },
    handleReportCancel () {
      console.log('取消删除')
      this.reportModalVisible = false
    },
    handleReportStateCancel () {
      console.log('取消删除')
      this.reportstateModalVisible = false
    },
    handleReportSearchCancel () {
      console.log('取消查询')
      this.reportsearchModalVisible = false
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
