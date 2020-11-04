<template>
  <div class="img_wrap">
        <div class="img" style="float:left;" @click="handleImg">
          <img ref="img" width="120px" height="120px" :src="value" alt="">
        </div>
        <el-dialog
          title="素材页面" append-to-body
          :visible.sync="dialogVisible"
          width="50%">
           <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="first">
              <div class="radio">
                <el-radio-group v-model="queryInfo.collect" size="medium" @change="handleChange">
                <el-radio-button :label="null" >全部</el-radio-button>
                <el-radio-button :label="true" >收藏</el-radio-button>
                </el-radio-group>
              </div>
              <el-row>
                <el-col :span="6" v-for="(item,index) in imgList" :key="item.id">
                  <el-image style="width: 150px; height: 100px" :src='item.url' @click="ChangeImg(index,item.url)"></el-image>
                  <div class="select_wrap" v-if="selected === index"></div>
                </el-col>
              </el-row>
                <el-pagination
                background
                layout="prev, pager, next"
                :total="total_count" @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.page"
                :page-size="queryInfo.per_page">
              </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="上传图片" name="second">
                  <img @click="$refs.file.click()" ref="priviewImg" class="Img_smallwrap" />
                   <input type="file" ref="file" hidden  @change="fileChange"/>
                </el-tab-pane>
              </el-tabs>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onCoverFrim">确 定</el-button>
          </span>
</el-dialog>
  </div>
</template>
<script>
import { getImages, uploadImages } from '@/api/images'
export default {
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      selected: null,
      imgUrl: '',
      queryInfo: {
        collect: null,
        page: 1,
        per_page: 8
      },
      imgList: [],
      total_count: 0
    }
  },
  methods: {
    handleImg () {
      this.dialogVisible = true
    },
    async getImages () {
      const res = await getImages(this.queryInfo)
      this.imgList = res.data.data.results
      this.total_count = res.data.data.total_count
      console.log(res)
    },
    handleChange () {
      this.getImages()
    },
    handleSizeChange (newSize) {
      this.queryInfo.per_page = newSize
      this.getImages()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getImages()
    },
      fileChange () {
      const file = this.$refs.file
      console.log(file.files[0])
      const blobData = window.URL.createObjectURL(file.files[0])
      this.$refs.priviewImg.src = blobData
    },
    async onCoverFrim () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message.error('请选择图片')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImages(fd)
        this.$refs.img.src = res.data.data.url
        this.dialogVisible = false
        this.$emit('input', res.data.data.url)
        console.log(res)
      } else if (this.activeName === 'first') {
        this.$emit('input', this.imgUrl)
        this.dialogVisible = false
      }
    },
    ChangeImg (index, url) {
      this.selected = index
      this.imgUrl = url
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style lang="less" scoped>
.img_wrap{
    .img{
    width: 120px;
    height: 120px;
    border: dashed 1px #ccc;
    margin-left: 3px;
    }
}
.el-row{
  margin-top: 20px;
  .el-col{
    margin-top: 10px;
    position: relative;
    .select_wrap{
      background: url('../selected.png');
      width: 100px;
      height: 100px;
      position: absolute;
      background-size: cover;
      top: 0;
      left: 20px;
    }
  }
}
.Img_smallwrap{
    width: 150px;
    height: 150px;
    border: dashed 1px #ccc;
    margin-left: 50%;
    transform: translateX(-50%);
}

</style>
