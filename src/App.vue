<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  min-width: 1000px;
}
.toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-button {
      background-color:#2f54a3;
      border-color:#2f54a3;
    }
}
.head-font {
  font-size: 20px;
}
.title-font{
  font-size: 18px;
}
.content-font{
  font-size: 14px;
}
.assist-font{
  font-size: 12px;
}
.el-row {
  width: 100%;
}

</style>

<script>
export default {
  mounted(){
    this.$notify.info({
          title: 'Notify',
          message: 'This is a notify',
          position: 'bottom-right'
        });
  }
}
</script>