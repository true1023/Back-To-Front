<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-button type="primary"  @click="approveRequest" v-loading="listLoading">Approve</el-button>
			<el-button type="danger"  @click="rejectRequest" v-loading="listLoading">Reject</el-button>
		</el-col>

		<el-table :data="filteredRequests" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="selectionChange" :default-sort="{prop:'AddTime', order:'descending'}">
			<el-table-column  align="center" type="selection" width="50px" :selectable="IfCanSelect">
			</el-table-column>
			<el-table-column align="center" prop="ApplicantAlias" label="Applicant" width="130px" sortable>
			</el-table-column>
			<el-table-column align="center" prop="ApproverAlias" label="Apporver" width="130px"  sortable>
			</el-table-column>
			<el-table-column  align="center" label="Name" width="350px" >
				<template slot-scope="scope">
					<span>{{ products.find(item=>item.ID==scope.row.ProductID).Name}}</span><br/>
				 	<span>{{ products.find(item=>item.ID==scope.row.ProductID).Name_CN}}</span>
				</template>
			</el-table-column>
			<el-table-column  align="center" label="Attribute" width="130px" >
				<template slot-scope="scope">
					<span>Size: {{ productDetails.find(item=>item.ID==scope.row.ProductDetailID).Size}}</span><br/>
					<span>Color: {{ productDetails.find(item=>item.ID==scope.row.ProductDetailID).Color}}</span>
				</template>
			</el-table-column>
			<el-table-column  align="center" label="Quantity" width="100px" >
				<template slot-scope="scope">
					<span>{{ scope.row.Quantity}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center"  label="Category">
		 		<template slot-scope="scope">
		 			<span class="cursor" @click="gotoCategory(products.find(item=>item.ID==scope.row.ProductID).CategoryID)">{{ getCategoryName(products.find(item=>item.ID==scope.row.ProductID).CategoryID)}}</span>
		 		</template>
		 	</el-table-column>
			<el-table-column  align="center" prop="Comment" label="Comment"></el-table-column>
			<el-table-column  align="center" label="Status" prop="Status"  width="150px" sortable>
				<template slot-scope="scope">
		 			<span :class="scope.row.Status">{{statusPhrase[statusClass.indexOf(scope.row.Status)]}}</span>
		 		</template>
			</el-table-column>
			<el-table-column  align="center" prop="AddTime" label="AddTime" width="160px" sortable></el-table-column>
		</el-table>
	</section>
</template>

<script>
	import {updateAll, editRequest} from '@/api/api'

	export default {
		data() {
			return {
				listLoading: false,
				statusClass:["pending","approve","reject"],
				statusPhrase:["Waiting for approval","Approved","Rejected"],
		        userAlias:'',

		        categories:[],
				products:[],
				productDetails:[],
				emailGroups:[],  
				requests:[],
				selectedRequests:[]
			}
		},
		computed:{
			filteredRequests(){
				console.log(this.requests)
				return this.requests.filter(item=>{
					return item.Status=='pending'  || item.Status=='approve' || item.Status=='reject'
				})
			}
		},
		methods: {
			getAll(){
		      this.listLoading=true;
		      this.categories=this.$store.state.categories;
		      this.products=this.$store.state.products;
		      this.productDetails=this.$store.state.productDetails;
		      this.emailGroups = this.$store.state.emailGroups;
		      this.requests = this.$store.state.requests;
		      if (this.categories.length<=0){
		        updateAll().then(()=>{
		          this.categories=this.$store.state.categories;
			      this.products=this.$store.state.products;
			      this.productDetails=this.$store.state.productDetails;
			      this.emailGroups = this.$store.state.emailGroups;
			      this.requests = this.$store.state.requests;
		          this.listLoading=false;
		        }).catch((err)=>{
		          console.log(err);
		          this.$message.error("NET ERROR, ");
		          this.listLoading=false;
		        })
		      }else{
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
			      this.requests = this.$store.state.requests;
		          this.listLoading=false;
		        }).catch((err)=>{
		          console.log(err);
		          this.$message.error("NET ERROR, "+err.response.data);
		          this.listLoading=false;
		        })
    		},
    		selectionChange(selection){
    			this.selectedRequests=selection
    		},
    		IfCanSelect(row, index){
    			if (row.Status=='pending') return true;
    			return false;
    		},
    		approveRequest(){
    			this.$confirm('Confirm to approve those selected items?').then(()=>{
    				this.listLoading = true;
    				this.selectedRequests.forEach(item=>{
    					item.Status='approve'
    				})
    				//console.log(this.selectedRequests)
    				editRequest(this.selectedRequests).then((res)=>{
    					this.$message({
    						type:'success',
    						message:'Approved Success'
    					})
    					this.listLoading =false;
    					this.getAllMandatory()
    				}).catch((err)=>{
    					this.$message.error('Error occured')
    					this.selectedRequests.forEach(item=>{
    						item.Status='pending'
    					})
    					this.listLoading = false;
    					this.getAllMandatory()
    				})

    			})
    		},
    		rejectRequest(){
    			this.$confirm('Confirm to reject those selected items?').then(()=>{
    				this.listLoading=true;
    				this.selectedRequests.forEach(item=>{
    					item.Status='reject'
    				})	
    				//console.log(this.selectedRequests)
    				editRequest(this.selectedRequests).then((res)=>{
    					this.$message({
    						type:'success',
    						message:'Reject Success'
    					})
    					this.listLoading =false;
    					this.getAllMandatory()
    				}).catch((err)=>{
    					this.$message.error('Error occured')
    					this.selectedRequests.forEach(item=>{
    						item.Status='pending'
    					})
    					this.listLoading = false;
    					this.getAllMandatory()
    				})

    			})
    		},
    		getCategoryName(ID){
    			return this.categories.find(item=>item.ID==ID).Name
    		},
			
		},
		mounted() {
			this.getAll()
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