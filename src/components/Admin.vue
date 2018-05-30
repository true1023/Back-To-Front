<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">Welcome, {{sysUserName}}</span> 
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item disabled>My messages(not availability)</el-dropdown-item>
						<el-dropdown-item disabled>Setting (not availability)</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">Log Out </el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside>
				<el-menu :default-active="$route.path" :collapse="collapsed" unique-opened router>
					<template v-for="(item,index) in routes.children" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
								<span slot="title">{{child.name}}</span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf" :index="item.path">
							<i :class="item.iconCls"></i>
							<span slot="title">{{item.name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div>
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb class="breadcrumb-inner" separator="/" >
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{item.name}}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysName: 'MSRAGift',
				collapsed: false,
				sysUserName: '',
				routes: ''
			}	
		},
		methods: {
			collapse: function(){
				this.collapsed = !this.collapsed;
			},
			logout: function(){
				var _this = this;
				this.$confirm('Confirm quit?', 'Reminder', {
				}).then(() => {
					_this.$router.push('/main');
				}).catch((error) => {
					console.log(error)
				})
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
			}
			this.routes = this.$router.options.routes.find(u => u.name=='Back');
		}
	}
</script>

<style  scoped  lang="scss">

	$color:#fe7903;
	$color1:#20a0ff;
	.container {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		min-height: 97vh;
		.header {
			height: 60px;
			line-height:60px;
			background:$color;
			color: #fff;
			.logo {
				height: 60px;
				font-size: 22px;
				padding-left: 20px;
				padding-right: 20px;
				border-color: rgba(238, 241, 146, 0.3);
				border-right-width: 1px;
				border-right-style: solid;
			}
			.logo-width {
				width: 230px;
			}
			.logo-collapse-width {
				width: 60px;
			}
			.tools {
				padding: 0px 23px;
				width: 14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color: #fff;
				}
			}
		}
		.main {
			display: flex;
			//background: #324057;
			top: 60px;
			bottom: 0px;
			min-height: 93vh;
			overflow: hidden;
			aside {
				flex: 0 0 230px;
				width: 230px;
				text-align: left;
				.el-menu {
					flex: 0 0 230px;
					width: 230px;
					height: 100%;
				}
				.el-menu--collapse {
					flex: 0 0 60px;
					width: 60px;
				}
			}
			.content-container {
				flex: 1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					display: flex;
					justify-content: space-between;
					.title {
						width: 200px;
						color: #475699;
						text-align: left;
					}
					.breadcrumb-inner {
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
					text-align: left;
				}
			}
		}
	}
</style>
