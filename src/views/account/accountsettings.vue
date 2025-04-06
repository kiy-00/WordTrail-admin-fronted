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
    <a-input v-model="changepassword" :placeholder="$t('account.settings.basic.change-password')" />
  </a-form-item>
    <a-form-item
        :label="$t('account.settings.basic.key')"
        :required="false"
    >
    <a-input v-model="changekey" :placeholder="$t('account.settings.basic.change-key')" />
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
import request from '@/utils/request'
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
      console.log(e.target.files)
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      // 这里写一个上传头像的接口
      request({
        url: '/account/UploadAvatar',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
      })
        .then(res => {
          console.log(res)
          this.avatarUrl = res.data
          storage.set(SHOW_AVATAR, res.data)
          this.$message.success('更换头像成功！')
        })
        .catch(err => {
          console.error('上传头像失败:', err)
          this.$message.error('更换头像失败，请重试！')
        })
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
                this.$message.success('密码重置成功，请使用新密码登录。')
              }
            )
        } catch (error) {
                console.error('密码重置失败:', error)
                this.requestFailed(error)
              } finally {
                this.state.loginBtn = false
              }
    },
    setavatar (url) {
      this.option.img = url
    },
    triggerFileInput () {
      this.$refs.changeAvatarInput.click()
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
