<template>
	<section>
		
		<el-col :span="24" class="toolbar tool">
			 <el-input  style="width:200px" v-model="filterParam" placeholder="Filter" @input="filterChange"></el-input>
			 <!--
			 <download-excel
			    :data   = "selectedLogs"
			    :fields = "json_fields"
			    name   = "GiftLogs.xls"
			    >
			    <el-button  type="primary" size="small">Download Excel</el-button>
			</download-excel>
		-->
			<el-button type="primary" size="small" @click="downloadExcel">Download Excel</el-button>
		</el-col>


		<el-table :data="filterLogs" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="selectionChange">
			<el-table-column  align="center" type="selection" width="50px">
			</el-table-column>
			<el-table-column align="center" prop="Name" label="Name" sortable>
			</el-table-column>
			<el-table-column align="center" prop="BeforeAdjust" label="BeforeAdjust" width="150px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="AfterAdjust" label="AfterAdjust" width="130px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="Size" label="Size" width="130px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="Color" label="Color" width="130px"  sortable>
			</el-table-column>
			<el-table-column align="center" prop="Amount" label="Amount" width="130px"  sortable>
				<template slot-scope="scope">
					<span :class="scope.row.Amount<0?'reduce':'increase'">{{getLiteralByAmount(scope.row.Amount)}}</span>
				</template>
			</el-table-column>
			<el-table-column  align="center" prop="Type" label="Type" width="130px" >
				<template slot-scope="scope">
					<span>{{scope.row.Type.toUpperCase()}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="Operator" label="Operator" width="130px"  sortable>
			</el-table-column>
			<!--
			<el-table-column align="center" prop="Comment" label="Comment" width="130px"  sortable>
			</el-table-column>
			-->
			<el-table-column  align="center" prop="AddTime" label="AddTime" width="160px" sortable></el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" :page-size="size"  @current-change="handleCurrentChange"  :total="getTotalNumber()" style="float:right"></el-pagination>
		</el-col>
	</section>
</template>

<script>
	import {getLog} from '@/api/api'

	export default {
		data() {
			return {
				listLoading: false,
				logs:[],
				filterLogs:[],
				selectedLogs:[],
				filterParam:'',
				size:20,
				page:1,



				json_fields:{
		          "Name":"Name",
		          "BeforeAdjust":"BeforeAdjust",
		          "AfterAdjust":"AfterAdjust",
		          "Size":"Size",
		           "Color":"Color",
		          "Amount":"Amount",
		           "Type":"Type",
		          "Operator":"Operator",
		          "AddTime":"AddTime"
		        },
		        json_meta:[
		        	[{
		        		"key":"charset",
		        		"value":"utf-8"
		        	}]
		        ]
			}
		},
		methods: {
			getAll(){
		      this.listLoading=true
		      getLog().then((res)=>{
		      	this.logs=res.data
		      	this.listLoading=false
		      	this.filterPages();
		      }).catch((err)=>{
		      	this.listLoading=false
		      	this.$message.error('Get logs error')
		      	console.log(err)
		      	console.log(err.response)
		      })
		      this.page=1;
		      
    		},
    		selectionChange(selection){
    			this.selectedLogs=selection
    		},
    		getLiteralByAmount(amount){
    			if (amount<0){
    				return 'REDUCE: '+Math.abs(amount)
    			}else {
    				return 'INCREASE: '+Math.abs(amount)
    			}
    		},
    		filterChange(){
    			this.filterPages();
    		},
    		handleCurrentChange(currentPage){
    			this.page=currentPage;
    			this.filterPages();
    		},
    		filterPages(){
    			this.filterLogs=this.logs.filter(item=>item.Name.includes(this.filterParam)).filter((u,index)=>index<this.size*this.page && index>=this.size*(this.page-1));
    		},
    		getTotalNumber(){
    			return this.logs.filter(item=>item.Name.includes(this.filterParam)).length;
    		},
    		JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
			    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
			    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			    var CSV = '';    
			    //Set Report title in first row or line
			    CSV += ReportTitle + '\r\n\n';
			    //This condition will generate the Label/Header
			    if (ShowLabel) {
			        var row = "";
			        //This loop will extract the label from 1st index of on array
			        for (var index in arrData[0]) {
			            //Now convert each value to string and comma-seprated
			            row += index + ',';
			        }
			        row = row.slice(0, -1);
			        //append Label row with line break
			        CSV += row + '\r\n';
			    }
			    //1st loop is to extract each row
			    for (var i = 0; i < arrData.length; i++) {
			        var row = "";
			        //2nd loop will extract each column and convert it in string comma-seprated
			        for (var index in arrData[i]) {
			            row += '"' + arrData[i][index] + '",';
			        }
			        row.slice(0, row.length - 1);
			        
			        //add a line break after each row
			        CSV += row + '\r\n';
			    }
			    if (CSV == '') {        
			        alert("Invalid data");
			        return;
			    }   
			    //Generate a file name
			    var fileName = "Gift_";
			    //this will remove the blank-spaces from the title and replace it with an underscore
			    fileName += ReportTitle.replace(/ /g,"_");   
			    
			    //Initialize file format you want csv or xls
			    var uri = 'data:text/csv;charset=utf-8,' + CSV;
			    // Now the little tricky part.
			    // you can use either>> window.open(uri);
			    // but this will not work in some browsers
			    // or you will not get the correct file extension    
			    //this trick will generate a temp <a /> tag
			    var link = document.createElement("a");    
			    link.href = uri;
			    //set the visibility hidden so it will not effect on your web-layout
			    link.style = "visibility:hidden";
			    link.download = fileName + ".csv";
			    //this part will append the anchor tag and remove it after automatic click
			    document.body.appendChild(link);
			    link.click();
			    document.body.removeChild(link);
			},
			downloadExcel(){
			this.JSONToCSVConvertor(this.selectedLogs,"Logs",true)
			},
		},
		mounted() {
			this.getAll()
		}
	}
</script>

<style scoped>
	.reduce{
		color: red;
	}
	.increase{
		color:green;
	}
	.tool {
		display: flex;
		justify-content:space-between;
		align-items:flex-end;
	}
</style>