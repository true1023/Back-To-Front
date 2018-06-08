import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import HomeMain from '@/components/home/Main'
import HomeNavigation1 from '@/components/home/Navigation1'
import HomeNavigation2 from '@/components/home/Navigation2'
import HomeNavigation3 from '@/components/home/Navigation3'
import HomeNodisplay from '@/components/home/Nodisplay'

import Admin from '@/components/Admin'
import AdminMain from '@/components/admin/Main'
import AdminList from '@/components/admin/List'
import AdminList1 from '@/components/admin/List1'
import AdminList2 from '@/components/admin/List2'
import AdminList3 from '@/components/admin/List3'


const Empty = {
  template: ` <router-view/>`
}
//这个空组件用来显示一级目录名称



Vue.use(Router)

//这个动态路由最多支持到2级菜单显示，前台只支持一级
export default new Router({
  routes: [
    {
        path: '/',
        component: Home,
        name: 'Front',
        children:[
          //因为在Home.vue组件中需要使用绝对路径动态显示菜单栏，所以这里的path使用绝对路径
      		{path: '/main', component: HomeMain, name: 'Home'},
          {path: '/navigation1', component: HomeNavigation1, name: 'navigation1'},
          {path: '/navigation2', component: HomeNavigation2, name: 'navigation2'},
          {path: '/navigation3', component: HomeNavigation3, name: 'navigation3'},
          //hidden 为true 则不显示在菜单栏
          {path: '/nodisplay/:id', component: HomeNodisplay, name: 'Nodisplay', hidden: true},
          //默认路由
      		{path: '', component: HomeMain, hidden: true}
       ]
    },
    {
      	path: '/admin',
  	    component: Admin,
        name: 'Back',
  	    children:[
          {
            path: '/admin/main',
            component: AdminMain,
            name: "Control Panel",
            iconCls: 'fa fa-address-card',
            leaf: true
          },
          {
            path: '', 
            component:Empty, 
            name: "Nav1", 
            iconCls: 'fa fa-address-card',
            children:[
              //因为在Admin.vue组件中需要使用绝对路径动态显示菜单栏，所以这里的path使用绝对路径
              {path: '/admin/item1', component: AdminList, name: "item1"},
              {path: '/admin/item2', component: AdminList1, name: "item2"}
          ]},
          {
            path: '', 
            component:Empty, 
            name: "Nav2", 
            iconCls: 'fa fa-address-card',
            children:[
              {path: '/admin/item3', component: AdminList2, name: "item3"},
              {path: '/admin/item4', component: AdminList3, name: "item4"}
          ]},
         
  	    ]
    }
  ]
})
