<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-button type="primary"  @click="click_event1" v-loading="listLoading">Button1</el-button>
			<el-button type="danger"  @click="click_event2" v-loading="listLoading">Button2</el-button>
		</el-col>

		<el-table :data="table_data" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="selectionChange">
			<el-table-column  align="center" type="selection" width="50px">
			</el-table-column>
			<el-table-column align="center" prop="id" label="ID" width="130px" sortable>
			</el-table-column>
			<el-table-column align="center" prop="prop1" label="Prop1" width="130px"  sortable>
			</el-table-column>
			<el-table-column  align="center" prop="name" label="Name" width="350px" >
			</el-table-column>
			<el-table-column  align="center" prop="prop2" label="Prop2" width="130px" >
			</el-table-column>
			<el-table-column  align="center" prop="prop3" label="Prop3" width="100px" >
			</el-table-column>
			<el-table-column align="center" prop="prop4" label="Prop4">
		 	</el-table-column>
			<el-table-column  align="center" prop="prop5" label="Prop5"></el-table-column>
		</el-table>
	</section>
</template>

<script>
	import {} from '@/api/api'

	export default {
		data() {
			return {
				listLoading: false,
		        userAlias:'',
				table_data:[],
			}
		},
		methods: {
			selectionChange(selection){
				console.log(selection)
			},
			click_event1(){
				console.log("You clicked button1")
			},
			click_event2(){
				console.log("You clicked button2")
			}
		},
		mounted() {
		}
	}
</script>

<style scoped>
	.pending {
		color: blue;
	}
	.approve {
		color: green;
	}
	.reject {
		color: red;
	}
</style>