<template>
  <page-header-wrapper content="可以查看所有的词书">
    <template v-slot:extraContent>
      <div style="width: 155px; margin-top: -20px;">
        <img style="width: 100%" :src="extraImage" />
      </div>
    </template>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="标准列表">
      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="english">英语</a-radio-button>
          <a-radio-button value="france">法语</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>
      <a-table
        :dataSource="dataSource"
        rowKey="id"
        bordered
        style="margin-top: 10px;"
      >
        <!-- 名称列 -->
        <a-table-column
          title="名称"
          dataIndex="title"
          key="title"
        />
        <!-- 语言列 -->
        <a-table-column
          title="语言"
          dataIndex="language"
          key="language"
        />
        <!-- 单词个数列 -->
        <a-table-column
          title="单词个数"
          dataIndex="wordCount"
          key="wordCount"
        />
        <!-- 操作列 -->
        <a-table-column
          title="操作"
          key="actions"
        >
          <template #default="{ record }">
            <div slot="actions">
              <a @click="viewWordBook(record)">查看词书</a>
            </div>
            <div slot="actions">
              <a @click="deleteWordBook(record.id)">删除词书</a>
            </div>
          </template>
        </a-table-column>
      </a-table>

      <!-- 查看词书的弹窗 -->
      <a-modal
        :visible="viewModalVisible"
        :title="currentWordBook?.title || '词书详情'"
        width="600px"
        @cancel="closeViewModal"
      >
        <a-list
          :dataSource="currentWordBook?.words || []"
          bordered
          :renderItem="renderWordItem"
        >
        </a-list>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'CardList',
  data () {
    return {
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: [
        {
          id: 1,
          title: '英语词书',
          language: '英语',
          wordCount: 100,
          words: [
            { word: 'apple', meaning: '苹果', synonyms: ['fruit'] },
            { word: 'banana', meaning: '香蕉', synonyms: ['fruit'] }
          ]
        },
        {
          id: 2,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 3,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 4,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 5,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 6,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 7,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 8,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 9,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 10,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        },
        {
          id: 11,
          title: '法语词书',
          language: '法语',
          wordCount: 80,
          words: [
            { word: 'bonjour', meaning: '你好', synonyms: ['salutation'] },
            { word: 'merci', meaning: '谢谢', synonyms: ['gratitude'] }
          ]
        }
      ],
      viewModalVisible: false,
      currentWordBook: null
    }
  },
  methods: {
    // 查看词书
    viewWordBook (record) {
      this.currentWordBook = record
      this.viewModalVisible = true
    },
    // 关闭查看弹窗
    closeViewModal () {
      this.viewModalVisible = false
      this.currentWordBook = null
    },
    // 删除词书
    deleteWordBook (id) {
      this.dataSource = this.dataSource.filter((item) => item.id !== id)
      this.$message.success('词书已删除！')
    },
    // 渲染单词列表项
    renderWordItem (item) {
      return (
        <a-list-item>
          <a-list-item-meta
            title={item.word}
            description={`词义: ${item.meaning}, 近义词: ${item.synonyms.join(', ')}`}
          />
        </a-list-item>
      )
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
