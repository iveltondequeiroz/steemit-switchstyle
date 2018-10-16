import Vue from 'vue'
import Router from 'vue-router'
import SwitchStyle from '@/components/SwitchStyle'
import Posts from '@/components/Posts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SwitchStyle',
      component: SwitchStyle
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    }
  ]
})
