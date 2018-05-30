import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	products:[],
	productDetails:[],
	categories:[],
	emailGroups:[],
	requests:[]
}

const mutations = {
	UpdateProducts(state, payload) {
		state.products = payload.products;
	},
	UpdateProductDetails(state, payload) {
		state.productDetails = payload.productDetails;
	},
	UpdateCategories(state, payload) {
		state.categories = payload.categories;
	},
	UpdateEmailGroups(state, payload) {
		state.emailGroups = payload.emailGroups;
	},
	UpdateRequests(state, payload) {
		state.requests = payload.requests;
	}
}

export default new Vuex.Store({
	state,
	mutations,
})