<template>
  <div>
    <el-card class="box-card">
       <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="ruleForm" :model="queryInfo" label-width="100px">
          <el-form-item label="状态：">
          <el-radio-group v-model="queryInfo.status" >
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="queryInfo.channel_id" placeholder="请选择">
            <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="日期：" required class="time-wrap">
           <el-date-picker
              v-model="data"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isCheck" @click="submitForm">筛选</el-button>
        </el-form-item>
    </el-form>
    </el-card>
    <div class="article_warp">
         <el-card>
          <div class="article_title">根据筛选条件共查询到{{total_count}}条数据</div>
            <el-table
          :data="articleList"
          stripe  v-loading="loading"
          style="width: 100%">
          <el-table-column
            label="封面"
            width="200">
            <template slot-scope="scope">
              <img v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="" width="100px" height="100px" >
              <img v-else src="./404.png" width="100px" height="100px" >
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="200">
          </el-table-column>
          <el-table-column
            label="状态"
            width="180"
            >
            <template slot-scope="scope">
                 <el-tag :type="articleStatus[scope.row.status].type" >{{articleStatus[scope.row.status].text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布日期"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeArticle(scope.row.id)">删除</el-button>
           <el-button type="primary" size="mini" @click="$router.push('/publish?id='+scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total_count" :current-page.sync="queryInfo.page" :page-size="queryInfo.per_page"  @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </el-card>
    </div>
  </div>
</template>
<script>
import { getArticles, getChannels, removeArticle } from '@/api/article'
const moment = require('moment')
export default {
  data () {
    return {
      data: [],
        queryInfo: {
          status: null,
          channel_id: null,
          begin_pubdate: null,
          end_pubdate: null,
          page: 1,
          per_page: 10
        },
        isCheck: false,
        loading: true,
        total_count: 0,
        channels: [],
        articleList: [],
        articleStatus: [
          {
            status: 0,
            text: '草稿',
            type: 'danger'
          },
           {
            status: 1,
            text: '待审核',
            type: ''
          },
           {
            status: 2,
            text: '审核通过',
            type: 'success'
          },
           {
            status: 3,
            text: '审核失败',
            type: 'warning'
          },
           {
            status: 4,
            text: '已删除',
            type: 'info'
          }
        ]
    }
  },
  created () {
    this.queryInfo.page = Number(localStorage.getItem('page')) || 1
    this.getList(this.queryInfo)
    this.getChannels()
  },
   beforeUpdate () {
        localStorage.setItem('page', this.queryInfo.page)
    },
    beforeDestroy () {
        localStorage.setItem('page', 1)
    },
  methods: {
    async getList (param) {
      this.loading = true
      this.isCheck = true
     const res = await getArticles(param)
     this.total_count = res.data.data.total_count
     this.articleList = res.data.data.results
     this.loading = false
     this.isCheck = false
     console.log(this.articleList)
    },
    async getChannels () {
      const res = await getChannels()
      this.channels = res.data.data.channels
      console.log(this.channels)
    },
    handleSizeChange (newSize) {
      this.queryInfo.per_page = newSize
      this.getList(this.queryInfo)
    },
    handleCurrentChange (newPage) {
       this.queryInfo.page = newPage
       this.getList(this.queryInfo)
    },
    submitForm () {
      this.$refs.ruleForm.validate(vaild => {
        if (this.queryInfo.begin_pubdate && this.queryInfo.end_pubdate) {
          this.queryInfo.begin_pubdate = moment(this.data[0]).format('YYYY-MM-DD')
          this.queryInfo.end_pubdate = moment(this.data[1]).format('YYYY-MM-DD')
        } else {
           this.queryInfo.begin_pubdate = null
           this.queryInfo.end_pubdate = null
        }
        this.queryInfo.page = 1
         console.log(this.queryInfo)
         this.getList(this.queryInfo)
      })
    },
    async removeArticle (id) {
      console.log(id.toString())
      const resd = await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         if (resd !== 'confirm') return this.$message.info('已取消删除')
         const res = removeArticle(id.toString())
         if (res.status !== 204) {
           this.$message.error('删除失败')
         } else {
           this.$message.success('删除成功')
           this.queryInfo.page = this.page
           this.getList(this.queryInfo)
         }
    }
  }

}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  border-bottom: solid 1px #e7ecf0;
  padding: 15px 0;
}
.line{
}
.time-wrap{
  .time1{
    float: left;
    padding: 0 5px;
  }
}
.article_warp{
  margin-top: 20px;
  .article_title{
    font-size: 22px;
    border-bottom: solid 1px #e7ecf0;
    padding: 0 0 15px 0;
  }
  .pagination{
    margin-top: 10px;
  }
}

</style>
