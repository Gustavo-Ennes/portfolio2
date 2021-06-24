<template>
  <transition
  v-on:enter="handleEnter"
  v-on:leave="handleLeave"
  >
    <keep-alive>
     <Animation />
   </keep-alive>
  </transition>
</template>

<script>
import Animation from './components/Animation.vue';

export default {
  name: 'App',
  methods: {
    handleEnter(){

    },
    handleLeave(){

    }
  },
  components: {
    Animation
  }
};
</script>

