<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="this.currentUser" :class="prefixCls" />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { SHOW_NAME, SHOW_AVATAR } from '@/store/mutation-types'
import storage from 'store'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      updateKey: 0
    }
  },
  computed: {
      currentUser () {
        console.log(this.updateKey)
        return { name: `管理员：${storage.get(SHOW_NAME)}`, avatar: `${storage.get(SHOW_AVATAR)}` }
      },
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    window.addEventListener('storage', this.onStorageChange)
  },
  beforeDestroy () {
    window.removeEventListener('storage', this.onStorageChange)
  },
  methods: {
    onStorageChange (e) {
      if (e.key === SHOW_AVATAR) {
        this.updateKey += 1
      }
    }
  }
}
</script>
