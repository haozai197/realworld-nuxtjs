<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games
            </p>
            <button v-if="!isMe" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ profile.username }}
            </button>
            <button v-else @click="settings" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <!-- <a class="nav-link active" href="">My Articles</a> -->
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  exact
                  :to="`/profile/${$route.params.username}?tab=my_articles`"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <!-- <a class="nav-link" href="">Favorited Articles</a> -->
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles'
                  }"
                  exact
                  :to="`/profile/${$route.params.username}?tab=favorited_articles`"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
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
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  getProfile
} from '@/api/profile.js'
import { mapState } from 'vuex'
import {
  getArticles,
  getYourFeedArticles,
  addFavorite,
  deleteFavorite
} from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  data() {
    return {
    }
  },
  async asyncData({ params, query }) {
    const profileRes = await getProfile(params.username)
    const { profile } = profileRes.data
    const tab = query.tab || 'my_articles'
    const articlesRes = await getArticles({
      author: tab === 'my_articles' ? profile.username : undefined,
      favorited: tab === 'favorited_articles' ? profile.username : undefined,
      limit: 5,
      offset: 0
    })
    const { articles } = articlesRes.data
    articles.forEach(article => article.favoriteDisabled = false)
    return {
      profile,
      articles,
      tab
    }
  },
  watchQuery: ['tab'],
  computed: {
    ...mapState(['user']),
    isMe() {
      return this.user && this.user.username === this.profile.username
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    settings() {
      this.$router.push('/settings')
    }
  }
}
</script>

<style>

</style>
