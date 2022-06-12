<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.tagList" type="text" class="form-control" placeholder="Enter tags">
                  <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publishArticles">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { publishArticles, updateArticles, getArticle } from '@/api/article'
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      article: {
        title: '',
        description: '',
        tagList : [],
        body: '',
      }
    }
  },
  async mounted() {
    if (this.$route.name === 'update') {
      const { data } = await getArticle(this.$route.params.slug)
      const { article } = data
      for (const key in this.article) {
        this.article[key] = article[key]
      }
      console.log(this.article);
    }
  },
  methods: {
    async publishArticles() {
      let res = {}
      if (this.$route.name === 'editor') {
        res = await publishArticles({ article: this.article})
      } else if (this.$route.name === 'update') {
        res = await updateArticles(this.$route.params.slug, { article: this.article})
      }
      // if (res.status !== 200) return
      this.$router.push({
        name: 'article',
        params: {
          slug: res.data.article.slug
        }
      })
      
    }
  }
}
</script>

<style>

</style>
