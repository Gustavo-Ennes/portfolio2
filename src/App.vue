<template>
  <div>
    <Animation v-if='isLoaded' :animation='animation' v-show='isLoaded'/>
    <ProgressBar :label='label' :progress='progress' v-else/>
  </div>
</template>

<script>
import Animation from './components/Animation.vue';
import ProgressBar from './components/ProgressBar.vue';
import AnimationClass from '../src/assets/js/index.js'

export default {
  name: 'App',
  data(){
    return {
      animation: null,
    }
  },
  computed: {
    isLoaded(){
      if(this.animation){
        return this.animation.percent === 100
      }
      return false
    },
    progress(){
      return this.animation ? this.animation.percent : 0
    },
    label(){
      return this.animation ? this.animation.label : 'Loading...'
    }
  },
  components: {
    Animation,
    ProgressBar
  },
  async mounted() {
    document.getElementById('app').focus();
    this.animation = new AnimationClass()
    await this.animation.init()
    this.animation.animate()
  }
};
</script>

