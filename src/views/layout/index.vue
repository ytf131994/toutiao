<template>
    <el-container class="layout-container">
      <el-aside :width="isCollapse ? 'auto' : '200px'">
        <app-aside :isCollapse=isCollapse></app-aside>
      </el-aside>
      <el-container>
        <el-header>
           <div class="header">
            <div class="title"><i :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="checkAside"></i>头条后台管理系统</div>
              <div class="name_wrap">
                  <div class="image"> <img :src='user.photo' alt=""></div>
                  <div class="name">
                      <el-dropdown>
                            <span class="el-dropdown-link">
                                {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown" split-button>
                            <el-dropdown-item @click.native="handleSetting">设置</el-dropdown-item>
                            <el-dropdown-item @click.native="signOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </div>
              </div>
            </div>
        </el-header>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserMessage } from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
  data () {
    return {
      token: '',
      user: {},
      isCollapse: false
    }
  },
  components: {
    AppAside
  },
  methods: {
    async getUserMessage () {
      this.token = window.sessionStorage.getItem('token')
      const res = await getUserMessage(this.token)
      this.user = res.data.data
      console.log(res)
    },
    signOut () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    checkAside () {
      this.isCollapse = !this.isCollapse
    },
    handleSetting () {
     this.$router.push('/setting')
    }
  },
  created () {
    this.getUserMessage()
    globalBus.$on('userMessage', (data) => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  }
}
</script>
<style lang="less" scoped>
  .layout-container{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  .el-header{
    background-color: #ffffff;
    .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
        color: #0c0301;
        font-size: 24px;
        letter-spacing: 5px;
        font-family: Arial, Helvetica, sans-serif;
    }
    .name_wrap{
       display: flex;
       align-items: center;
       .image{
          img{
            border-radius: 50%;
            width: 50px;
            height: 50px;
            padding: 0 10px;
          }
       }
    }
}

  }
  .el-aside {
    background-color: #001e34;
  }
    .el-main {
    background-color: #E9EEF3;
  }

</style>
