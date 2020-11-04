<template>
  <div class="images_wrap">
    <el-card>
         <div class="title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>素材管理</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
          <div class="radio_warp">
              <div class="radio" >
                <el-radio-group v-model="queryInfo.collect" size="medium" @change="handleChange">
                <el-radio-button :label="null" >全部</el-radio-button>
                <el-radio-button :label="true" >收藏</el-radio-button>
                </el-radio-group>
              </div>
            <div class="button" v-if="!queryInfo.collect">
            <el-button type="success" size="small" @click="dialogVisible = true">上传素材</el-button>
            </div>
            <div v-else></div>
        </div>
        <el-row :gutter="10"  v-loading="loading">
            <el-col :xs="24" :sm="6" :md="6" :lg="4" v-for="item in imagesList.results" :key="item.id">
                <el-image style="width: 150px; height: 100px" :src='item.url'></el-image>
                <div class="icon-wrap"><div class="icon"><i @click="saveImages(item)" :class="!item.is_collected ? 'el-icon-star-off': 'el-icon-star-on'"></i><i class="el-icon-delete" @click="handRemove(item.id)"></i></div></div>
            </el-col>
        </el-row>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total_count" :current-page.sync="queryInfo.page" :page-size="queryInfo.per_page"  @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
            </el-pagination>
    </el-card>
    <el-dialog append-to-body
  title="提示"
  :visible.sync="dialogVisible"
  width="30%">
  <el-upload
  class="upload-demo"
  drag
  :headers="uploadHeaders"
  action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
  name="image"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
  <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleImage">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import { getImages, saveImages, removeImages } from '@/api/images'
export default {
    data () {
        const token = window.sessionStorage.getItem('token')
        return {
            queryInfo: {
                collect: null,
                page: 1,
                per_page: 12
            },
            imagesList: {},
            loading: true,
            total_count: 0,
            dialogVisible: false,
            uploadHeaders: {
                Authorization: 'Bearer ' + token
            }
        }
    },
    methods: {
        async getImages (param) {
            const res = await getImages(param)
            this.imagesList = res.data.data
            this.total_count = res.data.data.total_count
            this.loading = false
            console.log(this.imagesList)
        },
        handleChange () {
            this.loading = true
            this.queryInfo.page = 1
            this.getImages(this.queryInfo)
        },
        handleSizeChange (newSize) {
            this.queryInfo.per_page = newSize
            this.getImages(this.queryInfo)
        },
        handleCurrentChange (newPage) {
            this.queryInfo.page = newPage
            this.getImages(this.queryInfo)
        },
        handleImage () {
             this.getImages(this.queryInfo)
            this.dialogVisible = false
            this.$message.success('上传成功')
        },
        async saveImages (item) {
            await saveImages(item.id, !item.is_collected)
            if (item.is_collected === true) {
                this.$message.success('取消收藏')
                this.getImages(this.queryInfo)
            } else {
                this.$message.success('收藏成功')
                this.getImages(this.queryInfo)
            }
        },
        async handRemove (id) {
           const resd = await this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if (resd !== 'confirm') return this.$message.info('已取消删除')
            const res = await removeImages(id)
            if (res.status === 204) {
                this.$message.success('删除成功')
                this.getImages(this.queryInfo)
            } else {
                this.$message.error('删除失败')
            }
        }
    },
    created () {
        this.queryInfo.page = Number(localStorage.getItem('pagination')) || 1
       this.getImages(this.queryInfo)
    },
    beforeUpdate () {
        localStorage.setItem('pagination', this.queryInfo.page)
    },
    beforeDestroy () {
        localStorage.setItem('pagination', 1)
    }

}
</script>

<style lang="less" scoped>
.title{
     border-bottom: solid 1px #e7ecf0;
    padding: 0 0 18px 0;
}
.el-row{
    margin-top: 20px;
}
  .radio_warp{
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      .radio{
          flex: 1;
      }
  }
  .el-pagination{
      margin-top: 20px;
  }
  .el-col{
      position: relative;
         .icon-wrap{
          position: absolute;
          background-color: rgba(188, 190, 192,.5);
          width: 150px;
          height: 30px;
          bottom: 4px;
          left: 5px;
      }
      .icon{
        display: flex;
        justify-content: space-evenly;
        margin-top: 5px;
      }
  }
</style>
