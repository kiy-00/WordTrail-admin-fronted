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
          <a-radio-button value="en">英语</a-radio-button>
          <a-radio-button value="fr">法语</a-radio-button>
          <a-radio-button value="de">德语</a-radio-button>
        </a-radio-group>
        <a-input-search
          v-model="searchKeyword"
          style="margin-left: 16px; width: 272px;"
          placeholder="请输入词书名称"
          @search="handleSearch"
        />
        <a-button @click="openCreateModal">新建词书</a-button>
      </div>
      <a-table
        :dataSource="filteredPermissions"
        :pagination="{ pageSize: 5 }"
        rowKey="id"
        bordered
        style="margin-top: 10px;"
        :scroll="{ x: '100%' }"
      >
        <!-- id列 -->
        <!-- <a-table-column
          title="ID"
          dataIndex="id"
          key="id"
        /> -->
        <!-- 名称列 -->
        <a-table-column
          title="名称"
          dataIndex="bookName"
          key="bookName"
          width="20%"
        />
        <!-- 语言列 -->
        <a-table-column
          title="语言"
          dataIndex="language"
          key="language"
          :customRender="(text) => languageMap[text] || text"
          width="10%"
        />
        <!-- 描述列 -->
        <a-table-column
          title="描述"
          dataIndex="description"
          key="description"
          width="50%"
        />
        <!-- 单词个数列 -->
        <a-table-column
          title="单词个数"
          dataIndex="wordCount"
          key="wordCount"
          width="10%"
        />
        <!-- 操作列 -->
        <a-table-column title="操作" key="actions" width="10%">
          <template #default="scope">
            <a @click="viewWordBook(scope)">查看词书</a>
            <p></p>
            <a @click="deleteWordBook(scope)">删除词书</a>
          </template>
        </a-table-column>
        <!-- 新建词书按钮 -->
        <!-- <a-table-column
          title="新建词书"
          key="newWordBook"
          width="10%"
        >
          <template v-slot:default>
            <a-button type="primary" class="new-btn">
              新建词书
            </a-button>
          </template>
        </a-table-column> -->
      </a-table>

      <!-- 查看词书的弹窗 -->
      <a-modal
        :visible="viewModalVisible"
        :title="`词书详情 - 名称: ${currentWordBook?.bookName || ''}`"
        width="1000px"
        @cancel="closeViewModal"
        :scroll="{ x: '100%' }"
        :footer="null"
      >
        <p>词书 ID: {{ currentWordBook?.id }}</p>
        <a-table
          :dataSource="currentWorddata"
          rowKey="id"
          bordered
          :pagination="{ pageSize: 5 }"
        >
          <!-- 单词 -->
          <a-table-column
            title="单词"
            dataIndex="word"
            key="word"
            width="20%"
          />

          <!-- 标签 -->
          <a-table-column
            title="标签"
            key="tags"
            :customRender="(_, record) => record.tags?.join(', ')"
            width="10%"
          />

          <!-- 音标 -->
          <a-table-column
            title="音标"
            key="phonetics"
            :customRender="(_, record) => record.phonetics?.map(p => p.ipa).join(', ')"
            width="20%"
          />

          <!-- 词性与释义 -->
          <a-table-column
            title="词性/释义"
            key="partOfSpeechList"
            width="50%"
          >
            <template #default="scope">
              <div v-for="(part, index) in scope.partOfSpeechList" :key="index" style="margin-bottom: 8px;">
                <strong>{{ part.type }}</strong>
                <ul style="margin-left: 1em;">
                  <li v-for="(def, i) in part.definitions" :key="i">{{ def }}</li>
                </ul>
                <div v-if="part.examples?.length">
                  <em>例句：</em>
                  <ul style="margin-left: 1em;">
                    <li v-for="(ex, j) in part.examples" :key="j">
                      {{ ex.sentence }}（{{ ex.translation }}）
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-modal>
      <!-- 新建词书的弹窗 -->
      <a-modal
        title="新建词书"
        :visible="createModalVisible"
        @cancel="closeCreateModal"
        @ok="submitNewWordBook"
        width="800px"
      >
        <a-form layout="vertical">
          <a-form-item label="语言">
            <a-select v-model="newWordBook.language">
              <a-select-option value="en">英语</a-select-option>
              <a-select-option value="de">德语</a-select-option>
              <a-select-option value="fr">法语</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="词书名称">
            <a-input v-model="newWordBook.bookName" />
          </a-form-item>

          <a-form-item label="描述">
            <a-textarea v-model="newWordBook.description" :rows="3" />
          </a-form-item>

          <a-divider>单词列表</a-divider>

          <div v-for="(word, index) in newWordBook.words" :key="index" style="margin-bottom: 24px; border: 1px solid #eee; padding: 16px; border-radius: 8px;">
            <a-space direction="vertical" style="width: 100%">
              <a-form-item :label="`单词 ${index + 1}`">
                <a-input v-model="word.word" />
              </a-form-item>

              <a-form-item label="音标">
                <a-input v-model="word.phonetics[0]" />
              </a-form-item>

              <a-form-item label="词性">
                <a-input v-model="word.partOfSpeechList[0]" />
              </a-form-item>

              <a-form-item label="标签">
                <a-input v-model="word.tags[0]" placeholder="多个标签可逗号分隔" />
              </a-form-item>

              <a-form-item label="近义词">
                <a-input v-model="word.synonyms[0]" />
              </a-form-item>

              <a-form-item label="反义词">
                <a-input v-model="word.antonyms[0]" />
              </a-form-item>

              <a-form-item label="难度">
                <a-input-number v-model="word.difficulty" :min="1" :max="5" />
              </a-form-item>

              <a-button danger type="dashed" block @click="removeWord(index)" v-if="newWordBook.words.length > 1">
                删除该单词
              </a-button>
            </a-space>
          </div>

          <a-button type="dashed" block @click="addWord">
            + 添加单词
          </a-button>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getwordbook, getcurrentwordbook, deletecurrentwordbook, addwordbook } from '@/api/manage'

export default {
  name: 'CardList',
  data () {
    return {
      status: 'all',
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: [],
      viewModalVisible: false,
      searchKeyword: '',
      currentWordBook: null,
      languageMap: {
        en: '英语',
        fr: '法语',
        de: '德语'
      },
      currentWordBookid: null,
      currentWorddata: [],
      createModalVisible: false,
      newWordBook: {
        language: '',
        bookName: '',
        description: '',
        words: [
          {
            word: '',
            phonetics: [''],
            synonyms: [''],
            antonyms: [''],
            partOfSpeechList: [''],
            tags: [''],
            difficulty: 1
          }
        ]
      }
    }
  },
  computed: {
    // 根据状态过滤词书
    filteredPermissions () {
      let filtered = this.dataSource

      // 根据语言过滤
      if (this.status !== 'all') {
        filtered = filtered.filter(item => item.language === this.status)
      }

      // 根据搜索关键字过滤
      if (this.searchKeyword.trim()) {
        filtered = filtered.filter(item =>
          item.bookName.includes(this.searchKeyword.trim())
        )
      }

      return filtered
    }
  },
  mounted () {
    // 获取词书数据
    this.fetchWordBooks()
  },
  methods: {
    handleSearch () {
      console.log('搜索关键字:', this.searchKeyword)
      // 触发重新计算 `filteredPermissions`
    },
    fetchWordBooks () {
      getwordbook()
        .then(res => {
          this.dataSource = res
          console.log('更新后的dataSource:', this.dataSource)
        })
        .catch(err => {
          console.error(err)
          this.$message.error('获取词书失败')
        })
    },
    // 查看词书并获取词书详情数据
    viewWordBook (scope) {
      this.currentWordBook = scope
      this.viewModalVisible = true

      // 调用接口获取当前词书数据
      getcurrentwordbook(scope.id)
        .then(res => {
          this.currentWorddata = res
          console.log('当前词书数据:', this.currentWorddata)
        })
        .catch(err => {
          console.error(err)
          this.$message.error('获取当前词书数据失败')
        })
    },

    // 关闭弹窗
    closeViewModal () {
      this.viewModalVisible = false
      this.currentWordBook = null
      this.currentWorddata = [] // 清空当前词书数据
    },
    deleteWordBook (scope) {
      this.dataSource = this.dataSource.filter(item => item.id !== scope.id)
      // 调用接口获取当前词书数据
      deletecurrentwordbook(scope.id)
      this.$message.success('词书已删除！')
    },
    openCreateModal () {
      this.createModalVisible = true
    },
    closeCreateModal () {
      this.createModalVisible = false
      this.resetNewWordBook()
    },
    resetNewWordBook () {
      this.newWordBook = {
        language: '',
        bookName: '',
        description: '',
        words: [
          {
            word: '',
            phonetics: [''],
            synonyms: [''],
            antonyms: [''],
            partOfSpeechList: [''],
            tags: [''],
            difficulty: 1
          }
        ]
      }
    },
    addWord () {
      this.newWordBook.words.push({
        word: '',
        phonetics: [''],
        synonyms: [''],
        antonyms: [''],
        partOfSpeechList: [''],
        tags: [''],
        difficulty: 1
      })
    },
    removeWord (index) {
      this.newWordBook.words.splice(index, 1)
    },
    submitNewWordBook () {
      console.log('提交的词书:', this.newWordBook)
      addwordbook(this.newWordBook)
        .then(res => {
          console.log('新建词书成功:', res)
          this.fetchWordBooks() // 刷新词书列表
        })
        .catch(err => {
          console.error(err)
          this.$message.error('创建词书失败')
        })
      this.$message.success('词书创建成功')
      this.closeCreateModal()
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
