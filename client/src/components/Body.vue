<template>
	<div class="row mb-0" id="user_section">
      <div class="col-sm-2 login">
        <img src="./../assets/steemlogo.png" class="img-fluid" style="margin-bottom: 5px;">
        <span>
          <input type="text" v-model="username" v-on:keyup.enter="verifyUser" id="username" size="12" placeholder="@" style="margin:0px;">
          <button v-on:click="verifyUser" style="margin: margin:0px;">connect</button>
        </span>   
        <div id="status-section" v-show="true" v-cloak style="margin-left: 0px; margin-right: 0px; margin-top: 1px">
          <div v-show="showStatus" class="alert alert-success fade show">
            <button type="button" v-on:click="hideStatus" class="close">&times;</button>
            <strong>{{statusMsg}}</strong>.
          </div>    
        </div>
      </div> 
      <div class="col-sm-8">
      	<h1>	URLS</h1>
      </div>    
    </div>

</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
