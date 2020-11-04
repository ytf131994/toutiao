<template>
  <div>
    <el-card>
      <div class="title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_wrap">
        <el-col :span="16" class="message">
          <el-form :model="userList" :rules="userRules" ref="ruleForm" label-width="100px">
            <el-form-item label="编号:" >
              {{userList.id}}
            </el-form-item>
            <el-form-item label="手机号:" >
              <span>{{userList.mobile}}</span>
            </el-form-item>
             <el-form-item label="媒体名称:" prop="name">
              <el-input v-model="userList.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:" prop="intro">
              <el-input type="textarea" v-model="userList.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model="userList.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :loading=updateLoading>保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="image">
          <label for="file">
          <el-avatar shape="square" :size="100" fit="cover" v-loading="loading"  :src="userList.photo"></el-avatar>
          <p>点击修改头像</p>
          <input id="file" type="file" ref="file" hidden  @change="fileChange"/>
          </label>
        </el-col>
      </div>
    </el-card>
    <el-dialog
      title="修改头像" @opened='handleOpenImg' @closed="handClosed"
      :visible.sync="dialogVisible"
      width="30%" append-to-body
     >
      <div class="priviewImg_wrap"><img class="priviewImg" ref="priview-img" :src="priviewImg" alt=""></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserMessage } from '@/api/user'
import { updatePhoto, updateUser } from '@/api/setting'
import globalBus from '@/utils/global-bus'
import 'cropperjs/dist/cropper.min.css'
import Cropper from 'cropperjs'
export default {
  data () {
    var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'))
        } else if (!(/^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))) {
            callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
    return {
      userList: {},
      dialogVisible: false,
      priviewImg: '',
      updateLoading: false,
      cropper: null,
      loading: true,
       userRules: {
          name: [
            { required: true, message: '请输入媒体名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请输入媒体介绍', trigger: 'blur' }
          ],
          email: [
             { validator: validateEmail, trigger: 'blur' }
          ]
       }
    }
  },
  methods: {
    async getUser () {
      const res = await getUserMessage()
      this.userList = res.data.data
       this.loading = false
      console.log(res)
    },
    fileChange () {
      const file = this.$refs.file
      console.log(file.files[0])
      const blobData = window.URL.createObjectURL(file.files[0])
      this.priviewImg = blobData
      this.$refs.file.value = ''
      this.dialogVisible = true
    },
    handleOpenImg () {
      const image = this.$refs['priview-img']
      this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'none',
      aspectRatio: 1,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    },
    handClosed () {
      this.cropper.destroy()
    },
     onUpdatePhoto () {
      this.cropper.getCroppedCanvas().toBlob(async file => {
        this.loading = true
        const fd = new FormData()
        fd.append('photo', file)
         await updatePhoto(fd)
        this.dialogVisible = false
        this.userList.photo = window.URL.createObjectURL(file)
        this.$message.success('修改成功')
        this.loading = false
        this.getUser()
        this.loading = false
        globalBus.$emit('userMessage', (this.userList))
      })
    },
    async onSubmit () {
      this.updateLoading = true
      const res = await updateUser(this.userList)
      if (res.status === 201) {
        this.$message.success('保存成功')
        this.updateLoading = false
        this.getUser()
        globalBus.$emit('userMessage', (this.userList))
      }
    }
  },
  created () {
    this.getUser()
  }

}
</script>

<style lang="less" scoped>
.title{
     border-bottom: solid 1px #e7ecf0;
    padding: 0 0 18px 0;
}
.el-input {
  width: 400px;
}
.el-textarea{
  width: 400px;
}
.content_wrap{
  margin-top: 20px;
  .image{
    margin-top: 40px;
  }
}
.priviewImg_wrap{
  .priviewImg{
  display: block;
  max-width: 100%;
  height: 200px;
  }
}
</style>
