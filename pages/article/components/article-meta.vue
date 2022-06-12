<template>
  <div class="article-meta">
    {{isMe}}
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
      v-if="!isMe"
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow {{ article.author.username }} <span class="counter"></span>
    </button>
    <button
      v-else
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
      @click="editArticle"
    >
      <i class="ion-edit"></i>
      &nbsp;
      Edit Articel<span class="counter"></span>
    </button>
    &nbsp;&nbsp;
    <button
      v-if="!isMe"
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">{{ article.favoritesCount }}</span>
    </button>
    <button
      v-else
      class="btn btn-outline-danger btn-sm"
      :class="{
        active: article.favorited
      }"
      @click="deleteArticles(article)"
    >
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Articel<span class="counter"></span>
    </button>
  </div>
</template>

<script>
import { deleteArticles } from '@/api/article'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    isMe() {
      console.log(this.$store.state.user);
      return this.$store.state.user && this.$store.state.user.username === this.article.author.username
    }
  },
  mounted() {
    console.log(this.$store.state.user);
    
  },
  methods: {
    async deleteArticles(article) {
      const res = await deleteArticles(article.slug)
      this.$router.push('/')
    },
    async editArticle() {
      console.log(this.$route.params.slug);
      // return
      this.$router.push({
        name: 'update',
        params: {
          slug: this.$route.params.slug
        }
      })
    }
  }
}
</script>

<style>

</style>
