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

        <div  id='text' class='col-12 m-0 p-0'>
          <!-- 
            the idea in here is to make more divs like the under one to have in it's 
            contents the html code relative to the button pressed.
            Every div like this will be binded to the data attribute 'div' in it's key name
            and will be shown when this.divs[ keyname ] was true

           -->


          <div id='initialText' v-if='divs.initialDiv' class='row justify-content-center align-items-start'>
            <div class='col-12 textWrapper'>
            <h1 class='text'>{{title}}</h1>
            <small class='text'>{{ subTitle}}</small>
            <p>{{ text }}</p>
            </div>
          </div>

          <div id='doorText' v-if='divs.doorDiv' class='row justify-content-center align-items-start'>
          </div>

          <div id='chemicalsText' v-if='divs.chemicalsText' class='row justify-content-center align-items-start'>
          </div>

          <div id='frameText' v-if='divs.frameText' class='row justify-content-center align-items-start'>
          </div>


        </div>
      </div>
    </div>
  </main>
</template>

<script>


export default {
  name: "Animation",
  props: ['animation'],
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
      setDivsToFalse()
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
      this.animation.goto(place, this.getTextAnimations({starts:'hide', ends:'show'}))
    },
    animateCSS(element, animation,afterAnimates=null, prefix = 'animate__',){
      // We create a Promise and return it
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);
      const handleAnimationStart = (event) => {
        event.stopPropagation()
        if(afterAnimates === 'show'){
          node.style.setProperty('opacity', '100')
        }
      }
      const handleAnimationEnd = (event) => {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        if(afterAnimates === 'hide'){
          node.style.setProperty('opacity', '0')
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
        afterEnds: after.ends
      }   
    }
  }
};


</script>

<style scoped>

  .orientation{
    position: absolute;
    bottom: 15px;
    right: 10px;
    color: rgba(255, 255, 255, 0.7)
  }
  .appWrapper{
    position: relative !important;

  }
  .textWrapper{
    background-color:rgba(0, 0, 0, 0.75);
  }
  .text{
    color:white;
    text-align: center;
  }
  .btn{
    margin: 15px;
  }

  /* .col-4{
    height: 20px;
  } */

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