<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{
    background: url('./assets/abstract.jpg') center center no-repeat;
    background-repeat: no-repeat;
    background-size: cover;
}
.body-min-height{
    min-height: 410px;
}
.imgIcon {
    background: url('./assets/imageicogrey.png') center center no-repeat;
    background-color: white;
    min-height: 60px;
    margin-top: 5px;
}
.container-main {
    margin-right: 0;
    margin-left: 0;
    padding-left: 0;
    padding-right: 0;
}
.inputURL {
    width: 65%;
    margin: 5px 0px;
}
.inputFrequency {
    width: 30px;
}
.bannerBox {
    background-color: #e4f9f6;
    padding: 10px;
    margin: 10px;
}
.bannerButton {
    float: left;
}
.login {
  background: rgba(108, 165, 161, .9);
  box-shadow:inset 0px 0px 0px 4px #b2eae4;
  max-height: 90px;
  padding: 10px;
  margin: 10px 25px;
}

#scheduler-section{
    margin-top: 30px;
    margin-bottom: 40px;
}
.wrapper{
    background: rgba(0, 0, 0, .7);
    width: 100vw;
    height: 170vh;
}

/*.container{
    top: 1%;
    position: relative;
}
*/
.navbar-default {
    background-color: #DDEEEE;
    border-color: #E7E7E7;
    height:40px;
}
.navbar-default .navbar-nav > li > a {
    color: #000;
}
.logo {
    margin-left: 10px;
    width: 12%;
}
.spacer{
    margin-top: 15px;
    margin-bottom: 15px;
}
.center-img {
    margin: auto;
    width: 100%;
}
h1{
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 30px;
    letter-spacing: 1px;
}
.urlsHeader {
    font-family: 'Montserrat', sans-serif;
    color: darkgray;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 1px;
}
.form-control{
    outline: none;
    background: rgba(255, 255, 255, .15);
    color: #fff;
}

[v-cloak] { display:none }

.normal {
    background-color: grey;
}
.drag {
    background-color: green;
}
.dragArea{
     min-height: 10px;
}

</style>
