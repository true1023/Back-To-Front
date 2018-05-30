<template>
	<section>
		<el-col :span="24" class="toolbar top">
			<div>
				<el-button type="primary" @click="handleAddProduct" >Add</el-button>
				<el-dropdown style="margin-left:10px">
					<el-button type="primary" size="medium">{{filterCategory}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="changeFilterCategory('所有类型')">所有类型</el-dropdown-item>	
						<template v-for="item in categories">
							<el-dropdown-item @click.native="changeFilterCategory(item.Name)">{{item.Name}}</el-dropdown-item>	
						</template>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<el-input  style="width:200px" v-model="filterParam" placeholder="Filter by name" @input="filterChange"></el-input>
		</el-col>

		 <el-table :data="productsPage" v-loading="listLoading" style="width: 100%">
		    <el-table-column type="expand">
		      <template slot-scope="props">
			        <el-table :data="productDetails.filter(item => item.ProductID==props.row.ID)" style="width:100%" >
			        	<el-table-column label="尺寸" prop="Size" align="center">
			        	</el-table-column>
			        	<el-table-column label="颜色" prop="Color" align="center">
			        	</el-table-column>
			        	<el-table-column label="图示" prop="ImageUrl" align="center">
			        		<template slot-scope="scope">
					    		<img :src="scope.row.ImageUrl" style="width:140px;height:140px;" alt="No Image">
					    	</template>
			        	</el-table-column>
			        	<el-table-column label="入库总数" prop="TotalInventory" align="center">
			        	</el-table-column>
			        	<el-table-column label="剩余库存" prop="SurplusInventory" align="center">
			        	</el-table-column>
			        	<el-table-column label="操作" align="center">
			        			<template slot-scope="scope">
			        				<el-button size="small" @click="handleDetailEdit(scope.$index, scope.row)">Edit</el-button>
									<el-button type="danger" size="small" @click="handleDetailDel(scope.$index, scope.row)">Delete</el-button>
			        			</template>
			        	</el-table-column>
			        </el-table>
			        <div class="detailTool">
			        	<el-button type="primary" @click="handleAddDetail(props.row.ID)" size="small">Add SubProduct</el-button>
			        </div>
		      </template>
		    </el-table-column>
		    <el-table-column label="英文名" prop="Name" sortable>
		    </el-table-column>
		    <el-table-column label="中文名" prop="Name_CN" width="200" sortable>
		    </el-table-column>
		    <el-table-column label="价格" prop="Price" width="100" sortable>
		    </el-table-column>
		    <el-table-column label="入库总数"  width="120" >
		    	<template slot-scope="scope">
		    		{{getTotalInventory(scope.row.ID)}}
		    	</template>
		    </el-table-column>
		    <el-table-column label="剩余库存" width="120" >
		    	<template slot-scope="scope">
		    		{{getSurplusInventory(scope.row.ID)}}
		    	</template>
		    </el-table-column>
		    <el-table-column label="所属类型" width="180" prop="CategoryID" sortable>
		    	<template slot-scope="scope">
		    		{{categories.length>0?(categories.find(item=>item.ID==scope.row.CategoryID)==undefined?'':categories.find(item=>item.ID==scope.row.CategoryID).Name):''}}
		    	</template>
		    </el-table-column>
		    <el-table-column label="管理组电子邮件" width="150" prop="EmailGroupID" sortable>
		    	<template slot-scope="scope">
		    		{{emailGroups.length>0?(emailGroups.find(item=>item.ID==scope.row.EmailGroupID)==undefined?'':emailGroups.find(item=>item.ID==scope.row.EmailGroupID).Name):''}}
		    	</template>
		    </el-table-column>
		    <el-table-column label="添加时间" prop="AddTime" width="200" sortable>
		    </el-table-column>
		    <el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" @click="handleProductEdit(scope.$index, scope.row)">Edit</el-button>
					<el-button type="danger" size="small" @click="handleProductDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		  </el-table>

		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" :page-size="size"  @current-change="handleCurrentChange"  :total="total" style="float:right"></el-pagination>
		</el-col>

		<el-dialog title="Add Product" :visible.sync="addFormVisible" :close-on-click-modal="false" >
			<!--Add Product-->
			<el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm" style="margin-right:50px">
				<el-form-item label="EmailGroup" prop="EmailGroupID">
					<el-select v-model="addForm.EmailGroupID" placeholder="Select Email Group">
					    <el-option  v-for="item in emailGroups"
					      :key="item.Name"
					      :label="item.Name"
					      :value="item.ID">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="Category" prop="CategoryID">
					<el-select v-model="addForm.CategoryID" placeholder="Select Email Group">
					    <el-option  v-for="item in categories"
					      :key="item.Name"
					      :label="item.Name+' ( '+item.Name_CN+' )'"
					      :value="item.ID">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="Name" prop="Name">
					<el-input v-model="addForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Name_CN" prop="Name_CN">
					<el-input v-model="addForm.Name_CN" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Price" prop="Price">
					<el-input-number v-model="addForm.Price" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="Image">
					<el-upload 
						action="http://msraitimages.corp.microsoft.com/api/images"
						list-type="picture"
						:on-success="addProductImageSuccess"
						:on-error="addProductImageError"
						:before-upload="addProductImageBefore"
						:limit="1"
						ref="addProductUpload"
						>
						<el-button size="small" type="primary">Click Upload</el-button>
						<div slot="tip">Only jpg/png files, limit 1024kb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="ProperCustomer">
					<el-input type="textarea" v-model="addForm.ProperCustomer"></el-input>
				</el-form-item>
				<el-form-item label="Description">
					<el-input type="textarea" v-model="addForm.Description"></el-input>
				</el-form-item>
			</el-form>
			<!--END-->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button  type="primary" @click.native="addProductSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<el-dialog title="Edit Product" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm" style="margin-right:50px">
				<el-form-item label="EmailGroup" prop="EmailGroupID">
					<el-select v-model="editForm.EmailGroupID" placeholder="Select Email Group">
					    <el-option  v-for="item in emailGroups"
					      :key="item.Name"
					      :label="item.Name"
					      :value="item.ID">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="Category" prop="CategoryID">
					<el-select v-model="editForm.CategoryID" placeholder="Select Email Group">
					    <el-option  v-for="item in categories"
					      :key="item.Name"
					      :label="item.Name+' ( '+item.Name_CN+' )'"
					      :value="item.ID">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="Name" prop="Name">
					<el-input v-model="editForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Name_CN" prop="Name_CN">
					<el-input v-model="editForm.Name_CN" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Price" prop="Price">
					<el-input-number v-model="editForm.Price" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="Image">
					<el-upload 
						action="http://msraitimages.corp.microsoft.com/api/images"
						list-type="picture"
						:on-success="editProductImageSuccess"
						:on-error="editProductImageError"
						:before-upload="editProductImageBefore"
						:limit="1"
						ref="editProductUpload"
						>
						<el-button size="small" type="primary">Click Change Cover</el-button>
						<div slot="tip">Only jpg/png files, limit 1024kb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="Preview">
					<img :src="this.editForm.ImageUrl" style="width:200px;height:200px;" alt="No Image"/>
				</el-form-item>
				<el-form-item label="ProperCustomer">
					<el-input type="textarea" v-model="editForm.ProperCustomer"></el-input>
				</el-form-item>
				<el-form-item label="Description">
					<el-input type="textarea" v-model="editForm.Description"></el-input>
				</el-form-item>
			</el-form>
			<!--END-->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button  type="primary" @click.native="editProductSubmit" :loading="editLoading">Submit</el-button>
			</div>
		</el-dialog>


		<el-dialog title="Add Detail" :visible.sync="addDetailVisible" :close-on-click-modal="false">
			<el-form :model="addDetailForm" label-width="120px" ref="addDetailForm">
					<el-form-item label="Size" prop="Size">
						<el-input v-model="addDetailForm.Size"></el-input>
					</el-form-item>
					<el-form-item label="Color" prop="Color">
						<el-input v-model="addDetailForm.Color"></el-input>
					</el-form-item>
					<el-form-item label="TotalInventory" prop="TotalInventory">
						<el-input-number v-model="addDetailForm.TotalInventory" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="Image" prop="ImageUrl">
						<el-upload 
						action="http://msraitimages.corp.microsoft.com/api/images"
						list-type="picture"
						:on-success="addDetailImageSuccess"
						:on-error="addDetailImageError"
						:before-upload="addDetailImageBefore"
						:limit="1"
						ref="addDetailUpload"
						>
							<el-button size="small" type="primary">Click Upload</el-button>
							<div slot="tip">Only jpg/png files, limit 1024kb</div>
						</el-upload>
					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addDetailVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addDetailSubmit" :loading="addDetailLoading">Submit</el-button>
			</div>
		</el-dialog>
		<el-dialog title="Edit Detail" :visible.sync="editDetailVisible" :close-on-click-modal="false">
			<el-form :model="editDetailForm" label-width="120px" ref="editDetailForm">
					<el-form-item label="Size" prop="Size">
						{{this.editDetailForm.Size}}
					</el-form-item>
					<el-form-item label="Color" prop="Color">
						{{this.editDetailForm.Color}}
					</el-form-item>
					<el-form-item label="TotalInventory" prop="TotalInventory">
						{{this.editDetailForm.TotalInventory}}
					</el-form-item>
					<el-form-item label="SurplusInventory" prop="SurplusInventory">
						<el-input-number v-model="editDetailForm.SurplusInventory" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="Image" prop="ImageUrl">
						<el-upload 
						action="http://msraitimages.corp.microsoft.com/api/images"
						list-type="picture"
						:on-success="editDetailImageSuccess"
						:on-error="editDetailImageError"
						:before-upload="editDetailImageBefore"
						:limit="1"
						ref="editDetailUpload"
						>
							<el-button size="small" type="primary">Change Cover</el-button>
							<div slot="tip">Only jpg/png files, limit 1024kb</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="Preview">
						<img :src="this.editDetailForm.ImageUrl" style="width:200px;height:200px;"/>
					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editDetailVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editDetailSubmit" :loading="editDetailLoading">Submit</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import util from '@/common/js/util'
	import {updateAll, deleteProduct, editProduct, addProduct, getProductDetailList, deleteProductDetail, editProductDetail, addProductDetail} from '@/api/api'

	export default {
		data() {
			return {
				total: 0,
				page: 1,
				filterParam:'',
				filterCategory:'所有类型',
				size:20,
				listLoading: false,
//----------------------Product-------------------------
				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					EmailGroupID: [
						{type:'number', message:'EmailGroup is necessary', trigger: 'change'}
					],
					CategoryID: [
						{type:'number', message:'Category is necessary', trigger: 'change'}
					],
					Name: [
						{ required: true, message: 'Name is necessary', trigger: 'blur'}
					],
					Name_CN: [
						{ required: true, message: 'Name_CN is necessary', trigger: 'blur'}
					]
				},
				addForm: {
					EmailGroupID:'',
					CategoryID:'',
					Name:'',
					Name_CN:'',
					ImageUrl:'',
					Price:'',
					ProperCustomer:'',
					Description:''
				},


				editFormVisible: false,
				editLoading: false,
				editFormRules: {
					EmailGroupID: [
						{type:'number', message:'EmailGroup is necessary', trigger: 'change'}
					],
					CategoryID: [
						{type:'number', message:'Category is necessary', trigger: 'change'}
					],
					Name: [
						{ required: true, message: 'Name is necessary', trigger: 'blur'}
					],
					Name_CN: [
						{ required: true, message: 'Name_CN is necessary', trigger: 'blur'}
					]
				},
				editForm: {
					EmailGroupID:'',
					CategoryID:'',
					Name:'',
					Name_CN:'',
					ImageUrl:'',
					Price:'',
					ProperCustomer:'',
					Description:''
				},

//-----------------------------END Product--------------------------------

//-----------------------------Detail-------------------------------
				addDetailVisible:false,
				addDetailLoading:false,
				addDetailForm:{
					ProductID:'',
					ImageUrl:'',
					Size:'默认',
					Color:'默认',
					SurplusInventory:0,
					TotalInventory:0
				},


				editDetailVisible:false,
				editDetailLoading:false,
				editDetailForm:{
					ProductID:'',
					ImageUrl:'',
					Size:'',
					Color:'',
					SurplusInventory:0,
					TotalInventory:0
				},

//----------------------------END Detail------------------------------

				productsPage:[],
				products:[],
				productDetails:[],
				categories:[],
				emailGroups:[]
			}
		},
		methods: {
//------------------------------PRODUCT---------------------------------------------
			handleAddProduct(){
				this.addFormVisible = true;
			},
			addProductImageBefore(file){
				this.addLoading=true;
				if (!file.type.includes('image') || file.size>1024000){
					this.$message.error("Upload image format/size error!")
					this.addLoading=false;
					return false;	
				}
			},
			addProductImageSuccess(res, file, filelist){
		         this.$message({type:'success',message:'图片上传成功'});
		         this.addForm.ImageUrl=res;
		         this.addLoading=false;
			},
			addProductImageError(err, file, filelist){
				this.$message.error("图片上传失败");
				this.addLoading=false;
        		console.log(err);
			},
			addProductSubmit(){
				this.$refs['addForm'].validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to submit the product?', 'Reminder', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addProduct(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: 'success add',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.$refs.addProductUpload.clearFiles();
								this.addFormVisible = false;
								this.addLoading = false;
								this.getAllMandatory();
							}).catch((error)=>{
								this.$message.error('Fail to add');
								this.addLoading = false;
								console.log(error.response);
							});
						})
					}
				})
			},
			handleProductDel(index, item){
				this.$confirm('Confirm to delete the record?','Reminder',{}).then(()=>{
					deleteProduct(item).then((res)=>{
						this.$message({
							type:'success',
							message:'success delete'
						})
						this.getAllMandatory()
					}).catch((err)=>{
						this.$message.error('fail to delete')
						console.log(err);
					})					
				})
			},
			handleProductEdit(index, item){
					this.editForm = Object.assign({}, item);
					this.editFormVisible = true;
			},
			editProductImageBefore(file){
				this.editLoading=true;
				if (!file.type.includes('image') || file.size>1024000){
					this.$message.error("Upload image format/size error!")
					this.editLoading=false;
					return false;	
				}
			},
			editProductImageSuccess(res, file, filelist){
		         this.$message({type:'success',message:'图片上传成功'});
		         this.editForm.ImageUrl=res;
		         this.editLoading=false;
			},
			editProductImageError(err, file, filelist){
				this.$message.error("图片上传失败");
				this.editLoading=false;
        		console.log(err);
			},
			editProductSubmit(){
				this.$refs['editForm'].validate((valid) => {
					if (valid) {
						this.$confirm('Confirm to emend the product infor?', 'Reminder', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							editProduct(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: 'emend success',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.$refs.editProductUpload.clearFiles();
								this.editFormVisible = false;
								this.editLoading = false;
								this.getAllMandatory();
							}).catch((error)=>{
								this.$message.error('Fail to emend');
								this.editLoading = false;
								console.log(error.response);
							});
						})
					}
				})
			},
//------------------------------------END  PRODUCT-------------------------------------------------

//----------------------------Product Detail-------------------------------------
			handleAddDetail(productId){
				this.addDetailVisible = true;
				this.addDetailForm.ProductID=productId
			},
			addDetailImageBefore(file){
				this.addDetailLoading = true;
				if (!file.type.includes('image') || file.size>1024000){
					this.$message.error("Upload image format/size error!")
					this.addDetailLoading = false;
					return false;	
				}
			},
			addDetailImageSuccess(res, file, filelist){
		         this.$message({type:'success',message:'图片上传成功'});
		         this.addDetailForm.ImageUrl=res;
		         this.addDetailLoading = false;
			},
			addDetailImageError(err, file, filelist){
				this.$message.error("图片上传失败");
				this.this.addDetailLoading = false;
        		console.log(err);
			},
			addDetailSubmit(){
				this.$confirm('Confirm to submit the product detail?', 'Reminder', {}).then(() => {
					this.addDetailLoading = true;
					let para = Object.assign({}, this.addDetailForm);
					addProductDetail(para).then((res) => {
						this.addDetailLoading = false;
						this.$message({
							message: 'success add',
							type: 'success'
						});
						this.$refs['addDetailForm'].resetFields();
		          		this.$refs.addDetailUpload.clearFiles();
						this.addDetailLoading = false;
						this.addDetailVisible = false;
						this.getProductDetails();
					}).catch((error)=>{
						this.$message.error('Fail to add');
						this.addDetailLoading = false;
						console.log(error.response);
					});
				})
			},
			handleDetailDel(index, item){
				this.$confirm('Confirm to delete the record?','Reminder',{}).then(()=>{
					deleteProductDetail(item).then((res)=>{
						this.$message({
							type:'success',
							message:'success delete'
						})
						this.getProductDetails()
					}).catch((err)=>{
						this.$message.error('fail to delete')
						console.log(err);
					})					
				})
			},
			handleDetailEdit(index, item){
					this.editDetailForm = Object.assign({}, item);
					
					this.editDetailVisible = true;
			},
			editDetailImageBefore(file){
				this.editDetailLoading = true;
				if (!file.type.includes('image') || file.size>1024000){
					this.$message.error("Upload image format/size error!")
					this.editDetailLoading = false;
					return false;	
				}
			},
			editDetailImageSuccess(res, file, filelist){
		         this.$message({type:'success',message:'图片更改成功'});
		         this.editDetailForm.ImageUrl=res;
		         this.editDetailLoading = false;
			},
			editDetailImageError(err, file, filelist){
				this.$message.error("图片上传失败");
				this.this.editDetailLoading = false;
        		console.log(err);
			},
			editDetailSubmit(){
				this.$confirm('Confirm to change the product detail?', 'Reminder', {}).then(() => {
					this.editDetailLoading = true;
					let para = Object.assign({}, this.editDetailForm);
					editProductDetail(para).then((res) => {
						this.editDetailLoading = false;
						this.$message({
							message: 'success changed',
							type: 'success'
						});
						this.$refs['editDetailForm'].resetFields();
		         		this.$refs.editDetailUpload.clearFiles();
						this.editDetailLoading = false;
						this.editDetailVisible = false;
						this.getProductDetails();
					}).catch((error)=>{
						this.$message.error('Fail to add');
						this.editDetailLoading = false;
						console.log(error.response);
					});
				})
			},
//----------------------------END Product Detail---------------------------------------------

//----------------------------Global Functions------------------------------------
			getAll(){
		      this.listLoading=true;
		      this.categories=this.$store.state.categories;
		      this.products=this.$store.state.products;
		      
		      this.productDetails=this.$store.state.productDetails;
		      this.emailGroups = this.$store.state.emailGroups;
		      if (this.categories.length<=0){
		        updateAll().then(()=>{
		          this.categories=this.$store.state.categories;
			      this.products=this.$store.state.products;
			      this.total = this.products.length;
			      this.productDetails=this.$store.state.productDetails;
			      this.emailGroups = this.$store.state.emailGroups;
			      this.total = this.products.length;
		      	  this.filterPage();
		          this.listLoading=false;
		        }).catch((err)=>{
		          console.log(err);
		          this.$message.error("NET ERROR, ");
		          this.listLoading=false;
		        })
		      }else{
		      	this.total = this.products.length;
		      	this.filterPage();
		      	this.listLoading=false;
		      }
    		},
    		getAllMandatory(){
    			this.listLoading=true;
    			 updateAll().then(()=>{
		          this.categories=this.$store.state.categories;
			      this.products=this.$store.state.products;
			      this.productDetails=this.$store.state.productDetails;
			      this.emailGroups = this.$store.state.emailGroups;
			      this.total = this.products.length;
			      this.filterPage();
		          this.listLoading=false;
		        }).catch((err)=>{
		          console.log(err);
		          this.$message.error("NET ERROR, "+err.response.data);
		          this.listLoading=false;
		        })
    		},
			getProductDetails(){
				getProductDetailList().then((res)=>{
					this.productDetails = res.data;
				}).catch((error)=>{
					this.$message.error("NET ERROR, when get productDetails");
					console.log(error);
				})
			},
			getTotalInventory(productID){
				var total =0;
				this.productDetails.filter(item=>item.ProductID==productID).forEach(item=>{
					total+=item.TotalInventory;
				})
				return total;
			},
			getSurplusInventory(productID){
				var total =0;
				this.productDetails.filter(item=>item.ProductID==productID).forEach(item=>{
					total+=item.SurplusInventory;
				})
				return total;
			},
			changeFilterCategory(name){
				this.filterCategory=name;
				this.filterPage();
			},
			filterChange(){
				this.filterPage();
			},
			handleCurrentChange(currentPage){
				this.page=currentPage;
				this.filterPage();
			},
			filterPage(){
				//Filter params top right
				var list = this.productsPage=this.products.filter(item=>item.Name.toLowerCase().includes(this.filterParam.toLowerCase())||item.Name_CN.toLowerCase().includes(this.filterParam.toLowerCase()));
				//Filter category
				if (this.filterCategory!='所有类型'){
					var categoryID=this.categories.find(item=>item.Name==this.filterCategory).ID;
					list = list.filter(item=>item.CategoryID==categoryID);
				}
				//Filter pages
				this.productsPage=list.filter((u,index)=>index<this.size*this.page && index>=this.size*(this.page-1));
				this.total = list.length;
			}
//-------------------------------END Global Functions-----------------------------------------------------
		},
		mounted() {
			this.getAll();
		}
	}
	
</script>

<style scoped>
.product-detail{
	border-bottom: 0.5px dotted #676767;
	margin-bottom: 10px;
}
.top{
	display: flex;
	justify-content: space-between;
}
.detailTool{
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
}
</style>