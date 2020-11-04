<template>
  <div>
      <el-card>
           <div class="title">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
                </el-breadcrumb>
          </div>
           <el-radio-group v-model="radio1" size="medium">
            <el-radio-button :label="0" >粉丝列表</el-radio-button>
            <el-radio-button :label="1" >粉丝图像</el-radio-button>
            </el-radio-group>
            <el-row :gutter="10" v-if="radio1===0">
            <el-col :xs="24" :sm="6" :md="6" :lg="4" v-for="(item, index) in fansList" :key="index">
                <el-image style="width: 100px; height: 130px" :src='item.photo'></el-image>
            </el-col>
            </el-row>
        <el-pagination  v-if="radio1===0"
            background
            layout="prev, pager, next"
            :total="total_count"  @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page.sync="queryInfo.page"
      :page-size="queryInfo.per_page">
            </el-pagination>
                <div v-show="radio1" ref="main" style="width: 600px;height:400px;"></div>
      </el-card>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'
import echarts from 'echarts'
export default {
    data () {
        return {
            radio1: 0,
            queryInfo: {
                page: 1,
                per_page: 24
            },
            fansList: [],
            total_count: 0
        }
    },
    methods: {
        async getFansList () {
            const res = await getFans(this.queryInfo)
            this.fansList = res.data.data.results
            this.total_count = res.data.data.total_count
            console.log(res)
        },
        handleSizeChange (newSize) {
            this.queryInfo.per_page = newSize
            this.getFansList()
        },
        handleCurrentChange (newPage) {
            this.queryInfo.newPage = newPage
            this.getFansList()
        }
    },
    created () {
        this.getFansList()
    },
    async mounted () {
      const myChart = echarts.init(this.$refs.main)
      var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
      myChart.setOption(option)
    }
}
</script>

<style lang="less" scoped>
.title{
     border-bottom: solid 1px #e7ecf0;
    padding: 0 0 18px 0;
}
.el-radio-group{
    margin-top: 20px;
}
.el-row{
    margin-top: 20px;
    .el-col{
        margin-top: 10px;
        .el-image{
            border: dashed 1px #e7ecf0;
            padding: 10px;
        }
    }
}
</style>
