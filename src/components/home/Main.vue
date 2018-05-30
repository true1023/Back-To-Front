<template>
  <div class="content">
    <el-row  class="head">
        <div class="desc_left">
           <h3>Application Process </h3>
           <p>Tarquinium mala libido Lucretiae propter formam et spectatam castitatem cepit: ergo iuvenis paulo post Collatiam</p>
           <p>comite uno noctis tempore denuo venit, Lucretiam gladio petivit ac mulieri amorem suum patefecit.</p>
           <p>Quoniam obstinatum Lucretiae animum neque verbis neque vi flectere potuit, addidit ad metum dedecus: </p>
           <p>"Tete interficiam ac postea apud corpus tuum cadaver servi nudum ponam: </p>
           <p>omnes de sordido adulterio cogitabunt". Sic dedecoris terrore obstinatam pudicitiam vicit libido.
             Lucretia, maesta tanto maloomnes de sordido adulterio cogitabunt". Sic dedecoris terrore obstinatam pudicitiam vicit libido.
             Lucretia,</p>
           <p class="goadmin">
             <el-button  v-if="role=='admin'" size="big" @click="toAdmin">Go to Control Panel</el-button>
           </p>
        </div>
        <div class="desc_right">
          <img src="/static/imgs/home.jpg">
        </div>
    </el-row>
    <el-row class="head2">
      <h3>Application Guideline</h3>
      <p><strong>Vestigia viri alieni, - inquit - Collantine, in lecto sunt tuo; sed corpus est tantum violantum:</strong></p>
      <p>
        <span style="margin-right:10px;">1.</span>animus insons: mors testis erit: Sex. Tarquinius hostis pro hospite noctis tempore vi mihi sibique:<br/> 
        <span style="margin-left:23.34px;"><strong>Tete interficiam:</strong> neque vi flectere potuit, addidit ad metum dedecus: "Tete interficiam ac postea etc.</span><br/>
        <span style="margin-left:23.34px;"><strong>Horridum facinus:</strong> si vos viri esitis, prestiferum a me abstulit gaudium". Levant viri Lucretiae animum, etc.</span><br/>
        <span style="margin-left:23.34px;"><strong>Iuvenis paulo:</strong> omite uno noctis tempore denuo venit, Lucretiam gladio petivit ac.</span><br/>
      </p>
      <p><span style="margin-right:10px;">2.</span>Nec ulla femina deinde Lucretiae exemplo impudica vivet.</p>
      <p><span style="margin-right:10px;">3.</span>Quoniam obstinatum Lucretiae animum neque verbis neque vi flectere potuit etc.</p>
    </el-row>
  </div>
</template>

<script>
import {} from '@/api/api'
export default {
  data(){
    return {
      role:'admin',
    }
  },
  methods: {
    toAdmin(){
      this.$router.push({path:'/admin'})
      //console.log(this.windowWidth);
    }
  },
  mounted(){
    this.role=user.role;
  },
}
</script>

<style lang="scss" scoped>
$color:#2f54a3;
$width:1200px;
.content {
  text-align: left;
  .head {
    background-color: $color;
    min-width:$width;
    min-height: 300px;
    color: white;
    display: flex;
    justify-content: space-between;
    .desc_left {
      flex: 0 1 auto;
      padding-left: 10px;
      word-wrap: break-word;
      .goadmin {
        text-align:center;
        .el-button {
          font-size:18px;
          color:$color;
        }
      }
    }
    .desc_right{
      background-color: $color;
      flex: 1 1 auto;
      text-align: right;
      img{
        height: 100%;
        width: 100%;
      }
    }
  }
  .head2 {
    margin:auto;
    align-items: center;
    width:$width;
    h3 {
      color: $color;  
    }
    li {
      list-style: none;
      margin-bottom: 10px;
    }
  }
}
  
</style>
