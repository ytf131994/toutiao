<template>
  <div class="publish_wrap">
       <el-card>
          <div class="title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        <el-form :model="publishFrom" :rules="putRules" ref="publishFrom" label-width="100px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="publishFrom.title"></el-input>
            </el-form-item>
             <el-form-item label="内容" prop="content">
                <el-tiptap v-model="publishFrom.content" height="300"  placeholder="请输入内容" :extensions="extensions" />
            </el-form-item>
              <el-form-item label="封面">
                <el-radio-group v-model="publishFrom.cover.type">
                <el-radio :label="1">单图</el-radio>
                <el-radio :label="3">三图</el-radio>
                <el-radio :label="0">无图</el-radio>
                <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
                <template v-if="publishFrom.cover.type>0">
                <upload-cover v-model="publishFrom.cover.images[index-1]" v-for="(index, item) in publishFrom.cover.type" :key="item"></upload-cover>
                </template>
            </el-form-item>
            <el-form-item label="频道">
                <el-select placeholder="请选择频道" v-model="publishFrom.channel_id">
                <el-option v-for="item in channelsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="onSubmit(false)">{{ $route.query.id ? '保存' : '发布文章' }}</el-button>
                <el-button @click="onSubmit(true)">存入草稿</el-button>
            </el-form-item>
        </el-form>
      </el-card>
  </div>
</template>
<script>
import { getChannels, publish, targetArticle, putArticle } from '@/api/article'
import uploadCover from './component/upload-cover'
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  TodoItem,
  TodoList,
  TextColor,
  TextHighlight
} from 'element-tiptap'
export default {
    data () {
        return {
            publishFrom: {
                title: '',
                content: '',
                cover: {
                    type: 0,
                    images: []
                },
                channel_id: null
            },
             extensions: [
                new Doc(),
                new Text(),
                new Paragraph(),
                new Heading({ level: 5 }),
                new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
                new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
                new Italic(),
                new Strike(),
                new ListItem(),
                new BulletList(),
                new OrderedList(),
                new Image(),
                new TodoItem(),
                new TodoList(),
                new TextHighlight(),
                new TextColor()
            ],
            loading: true,
            publishRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                content: [
                     { required: true, message: '请输入内容', trigger: 'blur' }
                     ]
            },
            putRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                content: [
                     { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },
            channelsList: [],
            id: ''
        }
    },
    methods: {
        onSubmit (draft) {
            this.$refs.publishFrom.validate(async valid => {
                if (!valid) return
                if (this.id) {
                   const result = await putArticle(this.id, this.publishFrom, draft)
                   console.log(result)
                   if (result.status === 201) {
                       this.$message.success('修改成功')
                       this.$router.push('/article')
                   }
                } else {
                        const res = await publish(this.publishFrom, draft)
                        if (res.status === 201) {
                            this.$message.success('发布成功')
                            this.$router.push('/article')
                        }
                }
            })
        },
        async getChannels () {
            const res = await getChannels()
            this.channelsList = res.data.data.channels
            console.log(res)
        },
        onUpdateImg (index, url) {
            this.publishFrom.cover.images[index] = url
        }
    },
    components: {
        uploadCover
    },
    async created () {
        this.id = this.$route.query.id
        if (this.id) {
            const res = await targetArticle(this.id)
            this.publishFrom = res.data.data
            console.log(this.publishFrom)
            this.loading = false
        } else {
            this.getChannels()
        }
    }
}
</script>
<style lang="less" scoped>
.publish_wrap{
    .title{
        border-bottom: solid 1px #e7ecf0;
        padding: 0 0 18px 0;
    }
    .el-form{
    margin-top: 30px;
    .el-input{
        width: 300px;
    }
    }
}

</style>
