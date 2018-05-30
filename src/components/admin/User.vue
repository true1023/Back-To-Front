<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAddForm">Add</el-button>
		</el-col>

		<el-table :data="admins" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column  align="center" type="index" width="75px">
			</el-table-column>
			<el-table-column align="center" prop="Alias" label="Alias" width="150px" sortable>
			</el-table-column>
			<el-table-column align="center" prop="AddTime" label="AddTime" width="210px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="AddAlias" label="AddAlias" >
			</el-table-column>
			<el-table-column align="center" label="Operation" width="160px">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="Add Admin" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="Name" prop="Name">
					<el-input v-model="addForm.Alias" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { addAdmin, getAdminList, deleteAdmin } from '@/api/api'

	export default {
		data() {
			return {
				admins: [],
				listLoading: false,

				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					Alias: [
						{ required: true, message: 'Alias is necessary', trigger: 'blur'}
					]
				},
				addForm: {
					ID:'',
					Alias:'',
					AddAlias:''
				}
			}
		},
		methods: {
			getAdmins() {
				this.listLoading = true;
				getAdminList().then((res) => {
					this.admins = res.data;
					this.listLoading = false;
					console.log(this.admins);

				}).catch((error)=>{
					console.log(error.response)
					this.listLoading = false;
				});
			},
			//Delete EmailGroup
			handleDel(index, row) {
				var ID = row.ID;
				this.$confirm('Are you sure to delete this record?' , 'Reminder', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {ID: ID};
					deleteAdmin(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: 'Delete success',
							type: 'success'
						});
						this.getAdmins();
					}).catch((error)=>{
						this.$message.error("Delete Fail")
						console.log(error.response);
						this.listLoading = false;
					})
				})
			},
			//Add EmailGroup
			handleAddForm(){
				this.addFormVisible = true;
			},
			addSubmit(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?' , 'Reminder', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({},this.addForm);
							addAdmin(para).then((res) => {
								console.log(res);
								this.addLoading = false;
								this.$message({
									message: 'add success',
									type: 'success'
								});
								this.$refs.addForm.resetFields();
								this.addFormVisible = false;
								this.getAdmins();
								
							}).catch((error)=>{
								this.addLoading = false;
								this.$message.error('Add Error!')
								console.log(error)
							})
						})
					}
				});
			}
		},
		mounted() {
			this.getAdmins();
		}
	}
</script>