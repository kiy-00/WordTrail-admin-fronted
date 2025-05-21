<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>管理员 | WordTrail</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="帖子总数" :value="postcount" />
        </div>
        <div class="stat-item">
          <a-statistic title="用户总数" :value="userscount"/>
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="进行中的项目"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra" href="/community/list">被举报帖子</a>
            <a-table
              :dataSource="searchData"
              :pageSize="5"
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
                width="25px"
              />
            </a-table>
          </a-card>

        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card
            title="快速开始 / 便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a href="/community/userlist">
                <a-icon type="team" />
                <span>用户列表</span>
              </a>
              <a href="/community/list">
                <a-icon type="file-text" />
                <span>帖子列表</span>
              </a>
              <a href="/list/card">
                <a-icon type="file-text" />
                <span>词书列表</span>
              </a>
              <a href="/profile/basic">
                <a-icon type="project" />
                <span>帖子查找</span>
              </a>
              <a href="/account/accountsettings">
                <a-icon type="user" />
                <span>个人信息</span>
              </a>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'
import { SHOW_AVATAR, SHOW_NAME } from '@/store/mutation-types'
import storage from 'store'
import {
  getuserscount,
  getpostcount,
  getsearchpoststate
 } from '@/api/manage'

const DataSet = require('@antv/data-set')

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
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '用户Id',
    dataIndex: 'userId',
    key: 'userId'
  },
  {
    title: '帖子状态',
    dataIndex: 'state',
    key: 'state'
  }
]
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar
  },
  data () {
    return {
      post: [],
      postcount: 0,
      userscount: 0,
      timeFix: timeFix(),
      avatar: '',
      name: '',
      searchData: [],
      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],
      columns,
      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [
        {
          dataKey: 'score',
          min: 0,
          max: 80
        }
      ],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.name,
      welcome: state => state.user.welcome
    }),
    currentUser () {
      return {
        name: `${storage.get(SHOW_NAME)}`,
        avatar: `${storage.get(SHOW_AVATAR)}`
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.name = `${storage.get(SHOW_NAME)}`
    this.avatar = this.userInfo.avatar
    this.getcount()
    this.getuserscount()
    this.searchreported()
  },
  mounted () {
    this.getProjects()
    this.getActivity()
    this.getTeams()
    this.initRadar()
  },
  methods: {
    searchreported () {
      this.loading = true
      getsearchpoststate('reported').then(res => {
        console.log(res)
        this.searchData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    getcount () {
      getpostcount().then(res => {
        this.postcount = res.data[0].count
      })
    },
    getuserscount () {
      getuserscount().then(res => {
        this.userscount = res.count
      })
    },
    getProjects () {
      this.$http.get('/list/search/projects').then(res => {
        this.projects = res.result && res.result.data
        this.loading = false
      })
    },
    getActivity () {
      this.$http.get('/workplace/activity').then(res => {
        this.activities = res.result
      })
    },
    getTeams () {
      this.$http.get('/workplace/teams').then(res => {
        this.teams = res.result
      })
    },
    initRadar () {
      this.radarLoading = true

      this.$http.get('/workplace/radar').then(res => {
        const dv = new DataSet.View().source(res.result)
        dv.transform({
          type: 'fold',
          fields: ['个人', '团队', '部门'],
          key: 'user',
          value: 'score'
        })

        this.radarData = dv.rows
        this.radarLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
