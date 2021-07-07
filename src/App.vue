<template>
  <div>
    <Animation v-if='isLoaded' v-show='isLoaded' />
    <ProgressBar :label='label' :progress='progress' v-else/>
  </div>
</template>

<script>
import Animation from './components/Animation.vue';
import ProgressBar from './components/ProgressBar.vue';

export default {
  name: 'App',
  computed: {
    isLoaded(){
      if(this.$store.state.animation){
        return this.$store.state.animation.percent === 100
      }
      return false
    },
    progress(){
      return this.$store.state.animation ? this.$store.state.animation.percent : 0
    },
    label(){
      return this.$store.state.animation ? this.$store.state.animation.label : 'Loading...'
    }
  },
  components: {
    Animation,
    ProgressBar
  },
  async mounted() {
    this.$store.dispatch('initAnimation')
    document.getElementById('app').focus();
  }
};
</script>

