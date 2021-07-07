<template>
  <main>
    <div id='canvas'>
      <canvas></canvas>
    </div>
    <div class='appWrapper text-center'>
      <div id='info' class='row justify-content-around'>

        <div class='col' @mouseup="goto('chemicals')">
          <button class='btn btn-sm btn-outline-success'><small class='m-2'>Description</small></button>
        </div>

        <div class='col' @mouseup="goto('door')">
          <button class='btn btn-sm btn-outline-success'><small class='m-2'>Work</small></button>
        </div>

        <div class='col' @mouseup="goto('frame')">
          <button class='btn btn-sm btn-outline-success'><small class='m-2'>Contact</small></button>
        </div>

        <div id='text' class='col-12 align-self-center'>

          <Initial v-if='divs.initialDiv' />

          <Work :clock='animation.clock' v-if='divs.doorDiv'/>

          <Description v-if='divs.chemicalsDiv'/>

          <Contact v-if='divs.frameDiv'/>

        </div>
        
        <small class='orientation d-none d-lg-block'>Use A, S, W, D and arrow keys to explore</small>


        <div class='absolute d-lg-none'>
          <FlyControls />
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
import FlyControls from '../components/FlyControls.vue';

export default {
  name: "Animation",
  components:{
    FlyControls,
    Initial,
    Work,
    Description,
    Contact
  },
  data(){
    return {
      divs: {
        doorDiv: false,
        frameDiv: false,
        chemicalsDiv: false,
        initialDiv: true
      },
    }
  },
  computed:{
    animation(){
      return this.$store.state.animation
    }
  },
  methods: {
    slideToIsZero(){
      return this.slideTo === 0
    },
    changeDivTo(div){
      const setDivsToFalse = () => {
        const keys = Object.keys(this.divs)
        for(let  i = 0; i < keys.length; i++){
          this.divs[keys[i]] = false
        }
      }

      setDivsToFalse();

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
    },
    addOrientationAnimation(){
      const el = document.querySelector(".orientation")
      el.classList.add('animate__animated', 'animate__hinge', 'animate__delay-6s')
    }
  },
  mounted(){
    setTimeout(() => {
      this.animateCSS('#text', 'zoomInUp', null, 'show');
    }, 500)

    document.querySelector('canvas').style.setProperty('height', window.innerHeight)
    document.querySelector('canvas').style.setProperty('width', window.innerWidth)
    this.addOrientationAnimation()
  }
};


</script>

<style scoped>

  #canvas{
    position:absolute;
    top: 0;
    left: 0;
    height:100%;
    width:100%;
    overflow: hidden;
    z-index:0;
  }

  .appWrapper{
    position: fixed;
    z-index:1;
    top:0;
    left:13px;
  }

  #info {
    height:100% !important;
    width: 100% !important;

  }
  .absolute{
    position:absolute;
    z-index:3;
    width:50% !important;
    height:50% !important;
    right:-6vw;
    bottom:-36vh;
  }

  .btn{
    margin:5px;
  }


</style>