import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import store from '@/store'

Vue.use(VueRouter)

// import('url') 这是一个表达式
const routes = [{
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: 'login' */'@/views/login'),
  beforeEnter (to, from, next) {
    if (window.localStorage.getItem('tokenInfo') || store.state.tokenInfo) {
      Message.error('退出后才能再次登录！')
      next({
        path: from.fullPath
      })
      return false
    }
    next()
  }
}, {
  path: '/',
  name: '',
  component: () => import(/* webpackChunkName: 'layout' */'@/views/layout'),
  meta: {
    requireAuth: true,
    title: '首页'
  },
  children: [
    {
      path: '',
      name: 'home',
      component: () => import(/* webpackChunkName: 'home' */'@/views/home')
    }, {
      path: 'about',
      name: 'about',
      component: () => import(/* webpackChunkName: 'about' */'@/views/about'),
      meta: { title: '关于页' }

    }, {
      // 绝对路径
      path: '/menus',
      name: 'menus',
      component: () => import(/* webpackChunkName: 'menus' */'@/views/menu'),
      meta: { title: '菜单' }
    },
    // 添加菜单页面
    {
      // 绝对路径，直接看看当前路径是否能与之匹配(随便匹配不用管当前的父级路由，写/login也没问题)
      // 因为添加菜单并非镶嵌在menus中，因此为了明确意思所以这样写
      path: '/menu/create',
      name: 'menu-create',
      component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create-or-edit'),
      meta: { title: '菜单-添加' }
    },
    // 编辑菜单页面
    {
      path: '/menu/:id/edit',
      name: 'menu-edit',
      component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/create-or-edit'),
      meta: { title: '菜单-编辑' }
    },
    // 资源类别列表
    {
      path: '/resource-category',
      name: 'resource-category',
      component: () => import(/* webpackChunkName: 'resource-category' */'@/views/resource-category'),
      meta: { title: '资源类别列表' }
    },
    // 资源列表
    {
      path: '/resources',
      name: 'resources',
      component: () => import(/* webpackChunkName: 'resources' */'@/views/resource'),
      meta: { title: '资源列表' }
    },
    // 角色列表
    {
      path: '/roles',
      name: 'roles',
      component: () => import(/* webpackChunkName: 'roles' */'@/views/role'),
      meta: { title: '角色列表' }
    },
    // 角色的菜单分配
    {
      path: '/roles/:roleId/alloc-menu',
      name: 'alloc-menu',
      component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu'),
      meta: { title: '角色-菜单分配' },
      props: true
    },
    // 角色的资源分配
    {
      path: '/roles/:roleId/alloc-resource',
      name: 'alloc-resource',
      component: () => import(/* webpackChunkName: 'alloc-resource' */'@/views/role/alloc-resource.vue'),
      meta: { title: '角色-资源分配' },
      props: true
    },
    // 用户管理
    {
      path: '/users',
      name: 'users',
      component: () => import(/* webpackChunkName: 'users' */'@/views/user'),
      meta: { title: '用户管理' }
    },
    // 课程管理
    {
      path: '/courses',
      name: 'courses',
      component: () => import(/* webpackChunkName: 'courses' */'@/views/course'),
      meta: { title: '课程管理' }
    },
    // 创建课程
    {
      path: '/course/create',
      name: 'course-create',
      component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create-or-edit.vue'),
      meta: { title: '课程-创建课程' }
    },
    // 编辑课程
    {
      path: '/course/:courseId/edit',
      name: 'course-edit',
      component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/create-or-edit.vue'),
      meta: { title: '课程-编辑课程' },
      props: true
    },
    // 课程内容
    {
      path: '/course/:courseId/content',
      name: 'course-content',
      component: () => import(/* webpackChunkName: 'course-content' */'@/views/course-content/index.vue'),
      meta: { title: '课程-详细内容' },
      props: true
    }
  ]
}, {
  path: '*',
  name: 'errorPage',
  component: () => import(/* webpackChunkName: 'error' */'@/views/error-page')
}]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 展示路由内容前，看看是否需要登录才能查看，也就是看看有没有 requireAuth （注意，若祖先路由需要登录，那么自身也就不必说了）
  if (to.matched.some(r => r.meta.requireAuth)) { // 自身或祖先是否要登录才能查看，要的话去看看有没有令牌
    // 该分支意味着，去的路由需要登录，那么看看当前是否登录了
    if (!store.state.tokenInfo) {
      // 之前和现在都没登陆过
      Message.error('请先登录！')
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return false
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
