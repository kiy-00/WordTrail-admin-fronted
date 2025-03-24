<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <h1 class="login-title">管理系统密码找回</h1>
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('user.recover')">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.recover.username.placeholder')"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: $t('user.recover.username.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.recover.password.placeholder')"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.recover.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.recover.newpassword.placeholder')"
              v-decorator="[
                'newpassword',
                {rules: [{ required: true, message: $t('user.recover.newpassword.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <router-link
              :to="{ name: 'login'}"
              class="forge-password"
              style="float: right;"
            >{{ $t('user.login.login') }}</router-link>
          </a-form-item>
          <a-form-item style="margin-top:24px">
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="login-button"
            >{{ $t('user.recover.login') }}</a-button>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </div>
</template>
<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha } from '@/api/login'
export default {
data () {
    return {
    customActiveKey: 'tab1',
    loginBtn: false,
    loginType: 0,
    isLoginError: false,
    form: this.$form.createForm(this),
    state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
    }
    }
},
methods: {
    ...mapActions(['Login']),
    handleUsernameOrEmail (rule, value, callback) {
    const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
    this.loginType = regex.test(value) ? 0 : 1
    callback()
    },
    handleTabClick (key) {
    this.customActiveKey = key
    },
    handleSubmit (e) {
    e.preventDefault()
    const { validateFields } = this.form
    const validateFieldsKey = this.customActiveKey === 'tab1' ? ['username', 'password'] : ['email', 'captcha']
    this.state.loginBtn = true
    validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
        const loginParams = { ...values }
        if (this.customActiveKey === 'tab1') {
            loginParams.password = md5(values.password)
        }
        this.Login(loginParams)
            .then(() => this.loginSuccess())
            .catch(err => this.requestFailed(err))
            .finally(() => {
            this.state.loginBtn = false
            })
        } else {
        this.state.loginBtn = false
        }
    })
    },
    getCaptcha (e) {
    e.preventDefault()
    const { validateFields } = this.form
    validateFields(['email'], { force: true }, (err, values) => {
        if (!err) {
        this.state.smsSendBtn = true
        const interval = setInterval(() => {
            if (this.state.time-- <= 0) {
            this.state.time = 60
            this.state.smsSendBtn = false
            clearInterval(interval)
            }
        }, 1000)
        getSmsCaptcha({ email: values.email }).then(() => {
            this.$notification.success({
            message: '提示',
            description: '验证码已发送，请检查您的邮箱。',
            duration: 8
            })
        }).catch(err => {
            clearInterval(interval)
            this.state.time = 60
            this.state.smsSendBtn = false
            this.requestFailed(err)
        })
        }
    })
    },
    loginSuccess () {
    this.$router.push({ path: '/' })
    setTimeout(() => {
        this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
        })
    }, 1000)
    this.isLoginError = false
    },
    requestFailed (err) {
    this.isLoginError = true
    this.$notification.error({
        message: '错误',
        description: err.message || '请求出现错误，请稍后再试',
        duration: 4
    })
    }
}
}
</script>
<style lang="less" scoped>
    .user-layout-login {
    .login-title {
        text-align: center;
        font-size: 24px;
        margin-bottom: 24px;
    }
    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }
    .forge-password {
        font-size: 14px;
    }
    button.login-button {
        padding: 0 15px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }
    }
</style>
