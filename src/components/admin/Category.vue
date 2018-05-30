<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAddForm">Add</el-button>
		</el-col>

		<el-table :data="categories" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column  align="center" type="index" width="75px">
			</el-table-column>
			<el-table-column align="center" prop="Name" label="Name" width="150px" sortable>
			</el-table-column>
			<el-table-column align="center" prop="Name_CN" label="NameByChinese" width="210px"  sortable>
			</el-table-column>
			<el-table-column  align="center" label="Image" width="280px" >
				<template slot-scope="scope">
					<img style="width:280px;height:140px;" :src="scope.row.ImageUrl" alt="No Image">
				</template>
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

		<el-dialog title="Add Category" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="180px" :rules="addFormRules" ref="addForm">
				<el-form-item label="Name" prop="Name">
					<el-input v-model="addForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="NameByChinese" prop="Name_CN">
					<el-input v-model="addForm.Name_CN" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="ImageUrl">
					<el-upload
					  drag
					  action="http://msraitimages.corp.microsoft.com/api/images"
					  ref="uploadimage"
					  list-type="picture"
					  :limit="1"
					  :before-upload="handleImageBeforeAdd"
					  :on-remove="handleImageRemoveAdd"
					  :on-success="handleImageSuccessAdd"
					  :on-error="handleImageErrorAdd"
					  >
					  <i class="el-icon-upload"></i>
					  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					  <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过500kb, 大小为280px*140px</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<el-dialog title="Edit Category" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
				<el-form-item label="Name" prop="Name">
					<el-input v-model="editForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="NameByChinese" prop="Name_CN">
					<el-input v-model="editForm.Name_CN" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="ImageUrl">
					<el-upload
					  drag
					  action='http://msraitimages.corp.microsoft.com/api/images'
					  ref="uploadimageedit"
					  list-type="picture"
					  :limit="1"
					  :on-remove="handleImageRemoveEdit"
					  :on-success="handleImageSuccessEdit"
					  :on-error="handleImageErrorEdit"
					  >
					  <i class="el-icon-upload"></i>
					  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					  <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过500kb, 大小为280px*140px</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="Current Image">
					<img style="width:280px;height:140px;" :src="editForm.ImageUrl" alt="No Image">
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
	import { addCategory, getCategoryList, deleteCategory, editCategory } from '@/api/api'

	export default {
		data() {
			return {
				categories: [],
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
					Name_CH:'',
					ImageUrl:''
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
					Name_CH:'',
					ImageUrl:''
				}
			}
		},
		methods: {
			getCategories() {
				this.listLoading = true;
				getCategoryList().then((res) => {
					this.categories = res.data;
					this.listLoading = false;
				}).catch((error)=>{
					console.log(error.response)
					this.listLoading = false;
				});
			},
			//Delete Category
			handleDel(index, row) {
				var ID = row.ID;
				this.$confirm('Are you sure to delete this record?' , 'Reminder', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {ID: ID};
					deleteCategory(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: 'Delete success',
							type: 'success'
						});
						this.getCategories();
					}).catch((error)=>{
						this.$message.error("Delete Fail")
						console.log(error.response);
						this.listLoading = false;
					})
				})
			},
			//Edit Category
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
							editCategory(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: 'success modification',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCategories();
							}).catch((error)=>{
								this.$message.error('Fail to edit');
								console.log(error.response);
							});
						})
					}
				})

			},
			handleImageRemoveEdit(file, fileList){
				this.editForm.ImageUrl=''
				this.$message({
						type:'success',
						message: 'Remove success'
					})
			},
			handleImageSuccessEdit(response, file, fileList) {
				this.$message({
					type:'success',
					message: 'Success'
				})
				this.editForm.ImageUrl=response;
				console.log(response);
			},
			handleImageErrorEdit(err, file, fileList) {
				this.$message.error('Net Error');
				console.log(err.response);
			},

			//Add Category
			handleAddForm(){
				this.addFormVisible = true;
				this.$nextTick(()=>{this.$refs.uploadimage.clearFiles();})
			},
			handleImageBeforeAdd(file){
				this.addLoading=true;
				if (!file.type.includes('image') || file.size>512000){
					this.$message.error("Upload image format/size error!")
					this.addLoading=false;
					return false;	
				}
			},
			handleImageRemoveAdd(file, fileList){
				this.addForm.ImageUrl=''
				this.$message({
						type:'success',
						message: 'Remove success'
					})
				this.addLoading = false;
			},
			handleImageSuccessAdd(response, file, fileList) {
				this.$message({
					type:'success',
					message: 'Success'
				})
				this.addForm.ImageUrl=response;
				this.addLoading = false;
			},
			handleImageErrorAdd(err, file, fileList) {
				this.$message.error('Net Error');
				console.log(err.response);
				this.addLoading = false;
			},
			addSubmit(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit?' , 'Reminder', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({},this.addForm);
							addCategory(para).then((res) => {
								console.log(res);
								this.addLoading = false;
								this.$message({
									message: 'add success',
									type: 'success'
								});
								this.$refs.addForm.resetFields();
								this.addFormVisible = false;
								this.getCategories();
								
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
			this.getCategories();
		}
	}
</script>