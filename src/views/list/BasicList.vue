<template>
  <page-header-wrapper content="可以查看所有的词汇">
    <template v-slot:extraContent>
      <div style="width: 155px; margin-top: -20px;">
        <img style="width: 100%" :src="extraImage" />
      </div>
    </template>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="词汇列表">
      <div slot="extra">
        <a-input-search
          v-model="searchKeyword"
          style="margin-left: 16px; width: 272px;"
          placeholder="请输入单词名称"
          @search="handleSearch"
        />
      </div>
      <a-table
        :dataSource="filteredVocabularies"
        :pagination="{ pageSize: 10 }"
        rowKey="id"
        bordered
        style="margin-top: 10px;"
        :scroll="{ x: '100%' }"
      >
        <!-- 单词列 -->
        <a-table-column
          title="单词"
          dataIndex="word"
          key="word"
          width="20%"
        />
        <!-- 音标列 -->
        <a-table-column
          title="音标"
          key="phonetics"
          :customRender="(_, record) => record.phonetics?.map(p => p.ipa).join(', ')"
          width="20%"
        />
        <!-- 词性列 -->
        <a-table-column
          title="词性"
          key="partOfSpeechList"
          :customRender="(_, record) => record.partOfSpeechList?.map(p => p.type).join(', ')"
          width="20%"
        />
        <!-- 释义列 -->
        <a-table-column
          title="释义"
          key="definitions"
          :customRender="(_, record) => record.partOfSpeechList?.flatMap(p => p.definitions).join('; ')"
          width="30%"
        />
        <!-- 标签列 -->
        <a-table-column
          title="标签"
          key="tags"
          :customRender="(_, record) => record.tags?.join(', ')"
          width="10%"
        />
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getAllVocabularies } from '@/api/manage'

export default {
  name: 'VocabularyList',
  data () {
    return {
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      vocabularies: [], // 所有词汇数据
      searchKeyword: '' // 搜索关键字
    }
  },
  computed: {
    // 根据搜索关键字过滤词汇
    filteredVocabularies () {
      if (this.searchKeyword.trim()) {
        return this.vocabularies.filter(item =>
          item.word.includes(this.searchKeyword.trim())
        )
      }
      return this.vocabularies
    }
  },
  mounted () {
    // 获取所有词汇数据
    this.fetchVocabularies()
  },
  methods: {
    // 获取所有词汇数据
    fetchVocabularies () {
      getAllVocabularies()
        .then(res => {
          this.vocabularies = res
          console.log('获取的词汇数据:', this.vocabularies)
        })
        .catch(err => {
          console.error(err)
          this.$message.error('获取词汇失败')
        })
    },
    // 搜索词汇
    handleSearch () {
      console.log('搜索关键字:', this.searchKeyword)
    }
  }
}
</script>

<style lang="less" scoped>
.card-list {
  :deep(.ant-card-body:hover) {
    .ant-card-meta-title > a {
      color: #1890ff;
    }
  }

  :deep(.ant-card-meta-title) {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  :deep(.meta-content) {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    margin-bottom: 1em;
  }
}
</style>
