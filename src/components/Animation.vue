<template>
  <div id="app"></div>
  <div id='info' class='row justify-content-around align-items-top w-100'>

    <div class='col-4' @mouseup="goto('window')">
      <button class='btn btn-outline-light'>Description</button>
    </div>

    <div class='col-4' @mouseup="goto('shelf')">
      <button class='btn btn-outline-light'>Work</button>
    </div>

    <div class='col-4' @mouseup="goto('frame')">
      <button class='btn btn-outline-light'>Contact</button>
    </div>

  </div>
</template>

<script>

import Animation from '../assets/js/index.js';

export default {
  name: "Animation",
  data(){
    return {
      animation: null
    }
  },
  methods: {
    goto(place){
      this.animation.goto(place)
    }
  },
  async mounted() {
    this.animation = new Animation()
    await this.animation.init()
    this.animation.animate()
  }
};


</script>

<style scoped>
.btn{
  margin: 15px;
}
#info {
  /*position: absolute !important;
  width: 100% !important;
  text-align: center;
  z-index: 100;
  display:block;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);*/

  position:fixed;
  padding:0;
  margin:0;
  top:0;
  left:0;
  width: 100%;
  height: 100%;

  text-align: center;
  z-index: 100;
}


</style>