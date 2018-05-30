<template>
	<el-container >
		<h1>{{ $route.params.id}}</h1>
	</el-container>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods: {
		},
		mounted() {
			console.log("this is a no display component")
		}
	}	
</script>

<style scoped>
	.el-container {
		width: 100%;
	}
	h1 {
		margin: auto;
	}
</style>