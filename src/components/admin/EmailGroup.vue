<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAddForm">Add</el-button>
		</el-col>

		<el-table :data="emailGroups" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column  align="center" type="index" width="75px">
			</el-table-column>
			<el-table-column align="center" prop="Name" label="Name" width="150px" sortable>
			</el-table-column>
			<el-table-column align="center" prop="Email" label="Email" width="210px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="CC" label="CC" >
			</el-table-column>
			<el-table-column align="center" prop="AddTime" label="AddTime"  sortable>
			</el-table-column>
			<el-table-column align="center" label="Operation" width="160px">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="Add EmailGroup" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="Name" prop="Name">
					<el-input v-model="addForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Email" prop="Email">
					<el-input v-model="addForm.Email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="CC" prop="CC">
					<el-input v-model="addForm.CC" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<el-dialog title="Edit EmailGroup" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
				<el-form-item label="Name" prop="Name">
					<el-input v-model="editForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Email" prop="Email">
					<el-input v-model="editForm.Email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="CC" prop="CC">
					<el-input v-model="editForm.CC" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Submit</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { addEmailGroup, getEmailGroupList, deleteEmailGroup, editEmailGroup } from '@/api/api'

	export default {
		data() {
			return {
				emailGroups: [],
				listLoading: false,

				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					Name: [
						{ required: true, message: 'Name is necessary', trigger: 'blur'}
					]
				},
				addForm: {
					ID:'',
					Name:'',
					Email:'',
					CC:''
				},
				editFormVisible: false,
				editLoading: false,
				editFormRules: {
					Name: [
						{ required: true, message: 'Name is necessary', trigger: 'blur'}
					]
				},
				editForm: {
					ID:'',
					Name:'',
					Email:'',
					CC:''
				}
			}
		},
		methods: {
			getEmailGroups() {
				this.listLoading = true;
				getEmailGroupList().then((res) => {
					this.emailGroups = res.data;
					this.listLoading = false;
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
					deleteEmailGroup(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: 'Delete success',
							type: 'success'
						});
						this.getEmailGroups();
					}).catch((error)=>{
						this.$message.error("Delete Fail")
						console.log(error.response);
						this.listLoading = false;
					})
				})
			},
			//Edit EmailGroup

			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			editSubmit(){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit the modification?', 'Reminder', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							editEmailGroup(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: 'success modification',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getEmailGroups
();
							}).catch((error)=>{
								this.$message.error('Fail to edit');
								console.log(error.response);
							});
						})
					}
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
							addEmailGroup(para).then((res) => {
								console.log(res);
								this.addLoading = false;
								this.$message({
									message: 'add success',
									type: 'success'
								});
								this.$refs.addForm.resetFields();
								this.addFormVisible = false;
								this.getEmailGroups
();
								
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
			this.getEmailGroups
();
		}
	}
</script>