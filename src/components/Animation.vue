<template>
  <main>
    <div id="app"></div>
    <div class='appWapper position-relative d-flex'>
      <div id='info' class='row justify-content-around align-items-start'>

        <div class='col-4' @mouseup="goto('chemicals')">
          <button class='btn btn-outline-light'>Description</button>
        </div>

        <div class='col-4' @mouseup="goto('door')">
          <button class='btn btn-outline-light'>Work</button>
        </div>

        <div class='col-4' @mouseup="goto('frame')">
          <button class='btn btn-outline-light'>Contact</button>
        </div>

        <div class='col-12'>
          <small class='orientation'>Use A, S, W, D and arrow keys to explore</small>
        </div>


        <div id='text' class='col-12'>

          <Initial v-if='divs.initialDiv' />

          <Work v-if='divs.frameDiv'/>

          <Description v-if='divs.chemicalsDiv'/>

          <Contact v-if='divs.doorDiv'/>

        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Initial from '../components/Initial.vue';
import Work from '../components/Work.vue';
import Description from '../components/Description.vue';
import Contact from '../components/Contact.vue';

export default {
  name: "Animation",
  props: ['animation'],
  components:{
    Initial,
    Work,
    Description,
    Contact
  },
  data(){
    return {
      title: "Hey, I'm Gustavo!",
      subTitle: "full-stack web developer",
      text: '',
      divs: {
        doorDiv: false,
        frameDiv: false,
        chemicalsDiv: false,
        initialDiv: true
      }
    }
  },
  methods: {
    changeDivTo(div){
      const setDivsToFalse = () => {
        const keys = Object.keys(this.divs)
        for(let  i = 0; i < keys.length; i++){
          this.divs[keys[i]] = false
        }
      }

      setDivsToFalse();
      console.dir(this.divs)

      switch(div){
        case 'door':
          this.divs['doorDiv'] = true
          break;
        case 'frame':
          this.divs['frameDiv'] = true
          break;
        case 'chemicals':
          this.divs['chemicalsDiv'] = true
          break;
        default: 
          console.warn(`There's no such a div: ${div}`);
          break;
      
      }
    },
    goto(place){
      this.animation.goto(place, this.getTextAnimations({starts:'hide', ends:'show', place: place}))
    },
    animateCSS(element, animation, place=null, afterAnimates=null, prefix = 'animate__',){
      // We create a Promise and return it
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);
      const changeToDiv = this.changeDivTo

      const handleAnimationStart = (event) => {
        event.stopPropagation()
        if(afterAnimates === 'show'){
          node.style.setProperty('opacity', 100)
          if(place){
            changeToDiv(place)
            console.log(place)
          }
        }
      }
      const handleAnimationEnd = (event) => {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        if(afterAnimates === 'hide'){
          node.style.setProperty('opacity', 0)
        }
      };

      return new Promise((resolve, reject) => {
        try{

          node.classList.add(`${prefix}animated`, animationName);
          node.addEventListener('animationend', handleAnimationEnd, {once: true});
          node.addEventListener('animationstart', handleAnimationStart, {once: true});
          resolve('Animation ended');
        } catch(err){
          reject(err)
        }
      });
    },
    getTextAnimations(after){  
      return {
        callback: this.animateCSS,
        endParams: ['#text', 'zoomInDown'],
        startParams: ['#text', 'zoomOutUp'],  
        afterStarts: after.starts,
        afterEnds: after.ends,
        place: after.place
      }   
    }
  },
  mounted(){
    setTimeout(() => {
      this.animateCSS('#text', 'zoomInUp', null, 'show');
    }, 500)
  }
};


</script>

<style scoped>

  .appWrapper{
    position: relative !important;

  }

  #info {
    position: fixed;
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