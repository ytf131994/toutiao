<template>
  <div class="logiFrom">
      <el-form :model="user" :rules="userRules" ref="from" class="userFrom">
        <el-form-item >
            <img src="./logo_index.png" width="50%" alt="">
        </el-form-item>
        <el-form-item prop="mobile">
            <el-input v-model="user.mobile"  placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
            <el-input v-model="user.code"  placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
             <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
         <el-form-item>
            <el-button class="btn" :loading=loading type="primary" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
import { Login } from '@/api/user'
export default {
    data () {
          var validateMobile = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入手机号'))
            } else if (!(/^1[34578]\d{9}$/.test(value))) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        var validateCode = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入验证码'))
            }
            if (value.length === 6) {
                callback()
            } else {
                callback(new Error('请正确的验证码'))
            }
        }
        return {
            user: {
                mobile: '13911111111',
                code: '246810'
            },
            checked: false,
            userRules: {
                mobile: [
                     { validator: validateMobile, trigger: 'blur' }
                ],
                 code: [
                     { validator: validateCode, trigger: 'blur' }
                ]

            },
            loading: false
        }
    },
    methods: {
        onLogin () {
           const user = this.user
           this.loading = true
            this.$refs.from.validate(async valid => {
                if (!valid) {
                    this.loading = false
                    return
                }
                if (this.checked === false) {
                    this.$message.error('请勾选用户协议')
                    this.loading = false
                    return
                }
                const res = await Login(user)
                if (res.status !== 201) {
                    this.$message.error('手机号或验证码错误')
                    this.loading = false
                } else {
                    this.$message.success('登录成功')
                    this.loading = false
                    const token = res.data.data.token
                    window.sessionStorage.setItem('token', token)
                    this.$router.push('/')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.logiFrom{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
   .userFrom{
       background-color: #fff;
       min-width: 300px;
       padding: 40px;
       text-align: center;
       .btn{
           width: 100%;
       }
   }
}
</style>
