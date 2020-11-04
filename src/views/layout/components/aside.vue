<template>
<el-menu
      :default-active="$route.path"
      background-color="#001e34"
      text-color="#fff"
      router
      collapse-transition
      :collapse="isCollapse"
      active-text-color="#ffd04b">
       <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
       <el-menu-item index="/article">
        <i class="el-icon-menu"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
       <el-menu-item index="/images">
        <i class="iconfont iconimage"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
       <el-menu-item index="/publish">
        <i class="iconfont iconpublish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-menu"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-setting"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/setting">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
</template>
<script>
export default {
    data () {
      return {
      }
    },
    props: {
      isCollapse: Boolean
    },
    methods: {
    }
}
</script>
<style lang="less">
.el-menu{
  height: 100%;
  .el-menu-item{
    .iconfont{
    margin-right: 10px;
    padding-left: 5px;
  }
  }
}
</style>
