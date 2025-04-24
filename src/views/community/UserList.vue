<template>
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
        <a-radio-group v-model="status">
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="normal" @click="searchnormal">正常</a-radio-button>
        <a-radio-button value="reported" @click="searchreported">被举报</a-radio-button>
        <a-radio-button value="deleted" @click="searchdeleted">已处理：不可见</a-radio-button>
        <a-radio-button value="resolved" @click="searchresolved">已处理：可见</a-radio-button>
        </a-radio-group>
        <a-select v-model="searchKind" style="width: 100px;">
        <a-select-option value="post">帖子名称</a-select-option>
        <a-select-option value="username">用户名</a-select-option>
        <a-select-option value="userid">帖子ID</a-select-option>
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
        :pagination="searchKind === 'post' ? false : { pageSize: pageSize }"
        rowKey="id"
        bordered
        style="margin-top: 10px;"
        :scroll="{ x: '100%' }"
        :columns="columns"
    >
    </a-table>

    <!-- 分页组件 -->
    <a-pagination
        v-if="status === 'all'"
        style="margin-top: 16px; text-align: right;"
        :current="currentPage"
        :total="allcount"
        :pageSize="pageSize"
        @change="handlePageChange"
    />
    </a-card>
</page-header-wrapper>
</template>

<script>
import { getsearchpoststate, getpostcount, getpost, getsearchposttitle, getsearchpostusername, getsearchpostuserId } from '@/api/manage'

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
    dataIndex: 'updateTime',
    key: 'updateTime'
},
{
    title: '帖子创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime'
},
{
    title: '帖子发布用户Id',
    dataIndex: 'userid',
    key: 'userid'
},
{
    title: '帖子发布用户名',
    dataIndex: 'username',
    key: 'username'
},
{
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status'
},
{
    title: '帖子评论数',
    dataIndex: 'ContentCount',
    key: 'ContentCount'
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
    status: 'all',
    extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
    dataSource: [],
    currentPage: 1, // 当前页码
    pageSize: 10, // 每页显示的条数
    allcount: 0, // 总条数
    reportedcount: 0, // 被举报的帖子数
    deletedcount: 0, // 已处理的帖子数
    resolvedcount: 0, // 可见的帖子数
    searchKind: 'post', // 搜索类型
    normalcount: 0, // 正常的帖子数
    searchKeyword: '', // 搜索关键字
    searchData: [], // 搜索结果数据
    columns
}
},
mounted () {
    // 获取词书数据
    this.Getpostcount().then(res => {
    this.allcount = res.data.count
    })
},
computed: {
    getPlaceholder () {
        return this.searchKind === 'post' ? '请输入帖子名称' : this.searchKind === 'username' ? '请输入用户名' : '请输入帖子ID'
    }
},
methods: {
// 获取总帖子数
Getpostcount () {
    return getpostcount().then(res => {
    this.allcount = res.data.count
    })
},
// 获取指定页码的帖子数据
Getpost (page) {
    return getpost(page).then(res => {
    this.dataSource = res.data
    })
},

// 处理页码变化
handlePageChange (page) {
    this.currentPage = page
    this.getpost(page) // 获取对应页码的数据
},

// 搜索功能
handleSearch () {
    // 根据搜索关键字过滤数据
    if (this.searchKind === 'post') {
    getsearchposttitle(this.searchKeyword).then(res => {
        this.dataSource = res.data
    })
    } else if (this.searchKind === 'username') {
    getsearchpostusername(this.searchKeyword).then(res => {
        this.dataSource = res.data.filter(item => item.username.includes(this.searchKeyword))
    })
    } else if (this.searchKind === 'userid') {
    getsearchpostuserId(this.searchKeyword).then(res => {
        this.dataSource = res.data.filter(item => item.id === this.searchKeyword)
    })
    }
},

// 搜索正常状态的帖子
searchnormal () {
    this.status = 'normal'
    getsearchpoststate(this.status).then(res => {
    this.dataSource = res.data
    })
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
