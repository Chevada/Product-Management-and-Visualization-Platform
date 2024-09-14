// 对外暴露配置路由（常量路由）
export const constantRoute = [
  {
    // 登录
    path: '/login',
    // 组件的懒加载写法：
    component: () => import('@/views/login/index.vue'),
    name: 'login', //命名路由，以后做权限会用到
    meta: {
      //路由元信息，用于展示菜单的标题
      title: '登录', //菜单需要的标题,
      hidden: true, //该标题是否需要在菜单中隐藏
      icon: 'Promotion', //图标名字
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      //路由元信息，用于展示菜单的标题
      title: '',
      hidden: true,
      icon: '',
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          //路由元信息，用于展示菜单的标题
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },

  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'PieChart',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      //路由元信息，用于展示菜单的标题
      title: '404',
      hidden: true,
      icon: 'Filter',
    },
  },
]

// 异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor',
        },
      },
    ],
  },

  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Orange',
        },
      },
    ],
  },
]

// 任意路由
export const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    //路由元信息，用于展示菜单的标题
    title: '任意路由',
    hidden: true,
    icon: 'Finished',
  },
}
