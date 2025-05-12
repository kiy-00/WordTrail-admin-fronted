<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
      <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item
            :label="$t('account.settings.basic.nickname')"
          >
            <a-input :disabled="true" :placeholder="$t(showname)" />
          </a-form-item>
          <a-form-item
            :label="$t('account.settings.basic.password')"
            :required="false"
          >
            <a-input-password v-model="changepassword" :placeholder="$t('account.settings.basic.change-password')" />
          </a-form-item>
          <a-form-item
            :label="$t('account.settings.basic.key')"
            :required="false"
          >
            <a-input-password v-model="changekey" :placeholder="$t('account.settings.basic.change-key')" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleUpdate">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <a-col :span="4" :offset="5">
          <div style="position: relative">
            <a-avatar
              :src="avatarUrl"
              style="width: 128px; height: 128px"
              @mouseenter="changeAvatarButtonShow = true"
            />
            <div
              v-if="changeAvatarButtonShow"
              @mouseleave="changeAvatarButtonShow = false"
              style="position: absolute; top: 0; left: 0; width: 128px; height: 128px; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;"
            >
              <a @click="triggerFileInput" style="color: white; cursor: pointer;">更换头像</a>
              <input
                type="file"
                ref="changeAvatarInput"
                style="display: none"
                @change="updateAvatar"
              />
            </div>
          </div>
        </a-col>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setavatar"/>

  </div>
</template>

<script>
import AvatarModal from './settings/AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { ACCESS_TOKEN, SHOW_NAME, SHOW_AVATAR } from '@/store/mutation-types'
import storage from 'store'
import { uploadavatar } from '@/api/manage' // 导入 getrecover 方法
import { settingsgetrecover } from '@/api/login' // 导入 getrecover 方法
export default {
  mixins: [baseMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      showname: `${storage.get(SHOW_NAME)}`,
      avatarUrl: `${storage.get(SHOW_AVATAR)}`,
      changekey: ``,
      changepassword: ``,
      preview: {},
      loginBtn: false,
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      changeAvatarButtonShow: false
    }
  },
  methods: {
    updateAvatar (e) {
      const file = e.target.files[0]
      if (file) {
        // 校验文件类型和大小
        if (!file.type.startsWith('image/')) {
          this.$message.error('请选择图片文件！')
          return
        }
        if (file.size > 2 * 1024 * 1024) { // 限制文件大小为 2MB
          this.$message.error('图片大小不能超过 2MB！')
          return
        }

        // 创建 FormData 对象
        const formData = new FormData()
        formData.append('file', file)
        formData.append('username', this.showname)
        // 这里可以添加其他需要上传的参数
        console.log('上传的文件:', file)
        console.log('FormData:', formData)
        // 调用上传接口
        uploadavatar(formData)
          .then(res => {
            console.log('上传成功:', res)
            this.avatarUrl = `${res.data.avatarUrl}` // 更新头像 URL
            storage.set(SHOW_AVATAR, res.data.avatarUrl) // 存储到本地
            this.$message.success('头像上传成功！')
            const evt = new StorageEvent('storage', {
              key: SHOW_AVATAR,
              newValue: res.data.avatarUrl
            })
            window.dispatchEvent(evt)
            console.log(evt)
          })
          .catch(err => {
            console.error('上传失败:', err)
            this.$message.error('头像上传失败，请重试！')
          })
      }
    },
    async handleUpdate () {
      try {
          this.loginBtn = true
          await settingsgetrecover({
              account: this.showname,
              key: this.changekey,
              newpassword: this.changepassword
            }, `${storage.get(ACCESS_TOKEN)}`).then(response => {
                console.log(response)
                this.$notification.success({
                  message: '成功',
                  description: '密码重置成功，请使用新密码登录。',
                  duration: 8
                })
              }
            ).catch(error => {
                console.error('密码重置失败:', error)
                this.$notification.error({
                  message: '失败',
                  description: '密码重置失败，请稍后再试。',
                  duration: 8
                })
                this.loginBtn = false
              })
        } catch (error) {
          console.error('密码重置失败:', error)
          this.requestFailed(error)
        } finally {
          this.loginBtn = false
        }
    },
    setavatar (url) {
      this.option.img = url
    },
    triggerFileInput () {
      this.$refs.changeAvatarInput.click()
    },
    previewAvatar (e) {
      const file = e.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.$message.error('请选择图片文件！')
          return
        }
        if (file.size > 2 * 1024 * 1024) {
          this.$message.error('图片大小不能超过 2MB！')
          return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          this.avatarPreview = event.target.result // 设置本地预览的头像 URL
        }
        reader.readAsDataURL(file) // 将文件读取为 Data URL
      }
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
