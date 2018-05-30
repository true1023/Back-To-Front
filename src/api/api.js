import axios from 'axios'
import store from '@/vuex/store'




axios.defaults.withCredentials = true;
var source="http://localhost:61843";
//var source="http://productionHost";

export const login = () => {return axios({
	method: 'get',
	url: source+'/api/users'
});};



//Category
export const getCategoryList = () => { return axios({
	method: 'get',
	url: source+'/api/categories'
});};

export const addCategory = (para) => {return axios({
	method: 'post',
	url: source+'/api/categories',
	data: para
});};

export const editCategory = (para) => { return axios({
	method: 'put',
	url: source+'/api/categories/'+para.ID,
	data:para
});};

export const deleteCategory = (para) => { return axios({
	method: 'delete',
	url: source+'/api/categories/'+para.ID
});};


//Email Group

export const getEmailGroupList = () => { return axios({
	method: 'get',
	url: source+'/api/emailgroups'
});};

export const addEmailGroup = (para) => {return axios({
	method: 'post',
	url: source+'/api/emailgroups',
	data: para
});};

export const editEmailGroup = (para) => { return axios({
	method: 'put',
	url: source+'/api/emailgroups/'+para.ID,
	data:para
});};

export const deleteEmailGroup = (para) => { return axios({
	method: 'delete',
	url: source+'/api/emailgroups/'+para.ID
});};

//Admins

export const getAdminList = () => { return axios({
	method: 'get',
	url: source+'/api/admins'
});};

export const addAdmin = (para) => {return axios({
	method: 'post',
	url: source+'/api/admins',
	data: para
});};

export const deleteAdmin = (para) => { return axios({
	method: 'delete',
	url: source+'/api/admins/'+para.ID
});};


//Products
export const getProductList = () => { return axios({
	method: 'get',
	url: source+'/api/products'
});};

export const addProduct = (para) => {return axios({
	method: 'post',
	url: source+'/api/products',
	data: para
});};

export const editProduct = (para) => { return axios({
	method: 'put',
	url: source+'/api/products/'+para.ID,
	data:para
});};

export const deleteProduct = (para) => { return axios({
	method: 'delete',
	url: source+'/api/products/'+para.ID
});};

//ProductDetails
export const getProductDetailList = () => { return axios({
	method: 'get',
	url: source+'/api/productdetails'
});};

export const addProductDetail = (para) => {return axios({
	method: 'post',
	url: source+'/api/productdetails',
	data: para
});};

export const editProductDetail = (para) => { return axios({
	method: 'put',
	url: source+'/api/productdetails/'+para.ID,
	data:para
});};

export const deleteProductDetail = (para) => { return axios({
	method: 'delete',
	url: source+'/api/productdetails/'+para.ID
});};


//Requests
export const getRequest = () => { return axios({
	method: 'get',
	url: source+'/api/requests'
});};

export const addRequest = (para) => {return axios({
	method: 'post',
	url: source+'/api/requests',
	data: para
});};

export const editRequest = (para) => { return axios({
	method: 'put',
	url: source+'/api/requests',
	data:para
});};

export const deleteRequest = (para) => { return axios({
	method: 'delete',
	url: source+'/api/requests/'+para.ID
});};


//Logs
export const getLog = () => { return axios({
	method: 'get',
	url: source+'/api/logs'
});};


//--------------Cut-Off-------------



export const testPost = () => {return axios({
	method: 'post',
	url: 'http://localhost:52581//api/tests',
	data:{
		'test1':'shiyuan'
	},
	withCredentials: false
});};

export const testGet = () => {return axios({
	method: 'get',
	url: 'http://localhost:61843///api/users'
});};



export const updateAll = () => {
	return getProductList().then((res)=>{store.commit({type:'UpdateProducts',products:res.data})})
	       .then(()=>{return getProductDetailList()}).then((res)=>{store.commit({type:'UpdateProductDetails',productDetails:res.data})})
	       .then(()=>{return getEmailGroupList()}).then((res)=>{store.commit({type:'UpdateEmailGroups',emailGroups:res.data})})
	       .then(()=>{return getCategoryList()}).then((res)=>{store.commit({type:'UpdateCategories',categories:res.data})})
	       .then(()=>{return getRequest()}).then((res)=>{store.commit({type:'UpdateRequests',requests:res.data})})
}