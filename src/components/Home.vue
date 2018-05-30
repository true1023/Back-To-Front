<template>
  <div class="app">
    <header>
    	<el-col :span="12" class="title">
    		<h1>Brand Title</h1>
    		<h1 class="orange">Headline</h1>
    	</el-col>
    	<el-col :span="12" class="infor">
    		<el-col :span="24" class="userinfor">
    			Welcome, Qinluo
    		</el-col>
			<!--Navigation bar -->
    		<el-col :span="24" class="navitool">
    			<el-menu  :default-active="$route.path" class="navi-menu" mode="horizontal" router>
    				 <template v-for="(item,index) in routes.children" v-if="!item.hidden">
    					<el-menu-item :index="item.path">
    						<span slot="title">{{item.name}}</span>
    					</el-menu-item>
    				</template>
    			</el-menu>
    		</el-col>
			<!--End navigation bar-->
    	</el-col>
    </header>
    <section>
    	    <router-view/>
    </section>
    <footer>
		<p>Copyright 2016 - 2018 Qinluo. All Rights Reserved</p>
    </footer>
  </div>
</template>

<script>
import {} from '@/api/api'
export default {
	data() {
		return {
			routes: '',
		}
	},
	methods: {
	},
	beforeRouteUpdate (to, from, next){
		next();
	},
	mounted(){
		this.routes = this.$router.options.routes.find(u => u.name=='Front');
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app {
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
	min-height: 97vh;
	padding: 0px;
	header {
		flex: 0 0 auto;
		height: 134px;
		margin: 0 auto;
		width:100%;
		.title {
			padding-left:50px;
			text-align: left;
			h1 {
				color:#000000;
				font-size:25px;
			}
			.orange {
				color:#2f54a3;
			}
		}
		.infor {
			padding-right:50px;
			height: 100%;
			display: flex;
			flex-flow: row wrap;
			justify-content: flex-end;
			align-items: flex-end;
			.userinfor {
				text-align: right;
			}
			.navitool {
				display:flex;
				justify-content: flex-end;
				.el-menu--horizontal {
					border: none;
					height:30px;
					line-height:30px;
					margin-bottom:20px;
				}
				.el-menu-item {
					padding-right:10px;
					height:30px;
					line-height:30px;
					font-size: 120%;
				}
			}
		}
	}
	section {
		flex: 1;
	}
	footer {
	  margin: 10px 0px 0px 0px;
	  padding: 0px;
	  text-align: center;
	  height: 66px;
	  line-height: 66px;
	  font-size: 13px;
	  color:#929293;
	  a {
	  	cursor: pointer;
	  	color: #999;
	  	text-decoration: underline;
	  	font: 12px arial;
	  }
	}
}

</style>
