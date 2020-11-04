<template>
  <div>
      <el-card>
          <div class="title">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>评论管理</el-breadcrumb-item>
                </el-breadcrumb>
          </div>
          <el-table
            :data="articleList"
            stripe v-loading="loading"
            style="width: 100%">
            <el-table-column
            prop="title"
            label="标题"
            width="180">
            </el-table-column>
            <el-table-column
            prop="total_comment_count"
            label="总评论数"
            width="180">
            </el-table-column>
            <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数">
            </el-table-column>
            <el-table-column
            prop="comment_status"
            label="状态">
             <template slot-scope="scope">
                 {{scope.row.comment_status ? '正常' : '关闭'}}
            </template>
            </el-table-column>
            <el-table-column
            label="操作">
            <template slot-scope="scope">
             <el-button type="success" size="mini" v-if="scope.row.comment_status" @click="commentType(scope.row.id, !scope.row.comment_status)">关闭评论</el-button>
             <el-button type="danger" size="mini" v-else @click="commentType(scope.row.id, !scope.row.comment_status)">打开评论</el-button>
             </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"  @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page.sync="queryInfo.page" :page-size="queryInfo.per_page"
            :total="total_count">
        </el-pagination>
      </el-card>
  </div>
</template>
<script>
import { getArticles } from '@/api/article'
import { updateCommentType } from '@/api/comment'
export default {
    data () {
        return {
            queryInfo: {
                response_type: 'comment',
                page: 1,
                per_page: 10
            },
            articleList: [],
            total_count: 0,
            loading: true
        }
    },
    methods: {
        async getArticles () {
            this.loading = true
            const res = await getArticles(this.queryInfo)
            this.loading = false
            this.total_count = res.data.data.total_count
            this.articleList = res.data.data.results
            console.log(this.articleList)
        },
        handleSizeChange (newSize) {
            this.queryInfo.per_page = newSize
            this.getArticles()
        },
        handleCurrentChange (newPage) {
             this.queryInfo.page = newPage
            this.getArticles()
        },
        async commentType (id, type) {
            const res = await updateCommentType(id.toString(), type)
            console.log(res)
            this.getArticles()
        }
    },
    created () {
        this.getArticles()
    }

}
</script>

<style lang="less" scoped>
.title{
     border-bottom: solid 1px #e7ecf0;
    padding: 0 0 18px 0;
}
</style>
