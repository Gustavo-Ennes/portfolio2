<template>

  <main class='textWrapper p-1 m-1'>

    <!-- 
      the main component will have one button to each project
      when button is pressed, another div with project infos will
      appear after the past div desapear by animate.css

      wil be divided in three divs
      left column to left arrow, right to the right one
      and in the center the biggest div will show both, a project and all projects minified
      this center div will be diveded in two horizontally
      the biggest one to to the project itself and another one 
      to the minified projects, let's go
     -->

     <div class='row justify-around align-items-start'>
       <!-- left arrow -->
       <div class='col-1 align-self-center'>
        <i id='leftArrow' class="fas fa-chevron-left arrowColor" @click='leftArrowClickHandler'></i>
       </div>

      <!-- main component -->
       <div class='col-10'>
          <div class='row'>

            <!-- projects itself -->
            <div class='col-12 align-self-start h-75'>
              <div id='projects'>
                <div class='row justify-content-around align-items-center'>
                  <div class='col-12'
                  v-for='work in works' 
                  :key='work.name'
                  >
                    <!-- project -->
                    <div class='project' v-if='isPointingToProject(work.name)'>

                      {{ work.name }}
                    </div>
                  </div>

                </div>
              </div>

            
            </div>
          <!-- all projects minified -->
            <div class='col-12 align-self-end'>
              <div class='row justify-content-around align-items-center'>
                <div class='col'
                v-for='work in works' 
                :key='work.name'
                >
                  <p class='smallText' :class='{"selectedMinified" : isPointingToProject(work.name)}'>{{ work.name }}</p>
                </div>
              </div>
            

            </div>

        </div>
      </div>
      <!-- right arrow -->
       <div class='col-1 align-self-center'>
          <i id='rightArrow' class="fas fa-chevron-right arrowColor" @click='rightArrowClickHandler'></i>
       </div>


     </div>

  </main>

</template>

<script>
const axios = require('axios')
const MIN_CLICK_INTERVAL = 0.5

export default {
  name: "Work",
  props: ['clock'],
  data() {
    return {
      works: [],
      slideTo: 0,
      projectIndex: -1,
      projectPointer: null,
      lastClick: null
    }
  },
  methods: {
    leftArrowClickHandler(){
      if((this.lastClick + MIN_CLICK_INTERVAL) < this.clock.getElapsedTime() || !this.lastClick){
        const el = document.querySelector("#projects")

        el.style.setProperty('--animate-duration', '.2s')
        el.addEventListener("animationend", null)

        if(this.projectIndex === 0){
          this.projectIndex = this.works.length - 1
        } else{
          this.projectIndex -= 1
        }     
        el.classList.add('animate__animated', 'animate__slideOutLeft')

        el.addEventListener('animationend', () => {

          el.classList.remove('animate__animated', "animate__slideOutLeft")        
          el.classList.add("animate__animated", "animate__slideInRight")
          el.addEventListener('animationend', () => {
            el.classList.remove('animate__animated', "animate__slideInRight")
            this.projectPointer = this.works[this.projectIndex].name 
          })

        })      
      }
      this.lastClick = this.clock.getElapsedTime()
    },
    rightArrowClickHandler(){
      if((this.lastClick + MIN_CLICK_INTERVAL) < this.clock.getElapsedTime() || !this.lastClick){

        const el = document.querySelector("#projects")
        el.style.setProperty('--animate-duration', '.2s')
        el.addEventListener('animationend', null)

        if(this.projectIndex === this.works.length - 1){
          this.projectIndex = 0
        } else{
          this.projectIndex += 1
        }

        el.classList.add('animate__animated', 'animate__slideOutRight')

        el.addEventListener('animationend', () => {
          el.classList.remove("animate__animated", "animate__slideOutRight")
          el.classList.add("animate__animated", "animate__slideInLeft")
          el.addEventListener('animationend', () => {
            el.classList.remove("animate__animated", "animate__slideInLeft")
            this.projectPointer = this.works[this.projectIndex].name
          })

        })
      }
    },
    isPointingToProject(project){
      return project === this.projectPointer
    },
    hideAllProjects(){
      this.projectPointer = null
    },
    async getWorks(){
      const res = await axios({
        url:'https://api.ennes.dev/portfolio/project',
        method: 'get'
      })
      this.works = res.data.projects
    }
  },
  async mounted(){
    await this.getWorks()
    if(this.works.length > 0){
      this.projectIndex = 0
      this.projectPointer = this.works[this.projectIndex].name
    }
    console.log(`
     index: ${this.projectIndex}
     pointer: ${this.projectPointer}
    `)
  }

}
</script>

<style scoped>
.arrowColor{
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size:25px;
}
.arrowColor:hover{
  color: rgba(255, 255, 255, 0.5);
  font-size: 30px;
  
}
.minHeight{
  min-height: 70% !important;
}
.smallText{
  font-size:10px;
}

.selectedMinified{
  color: rgba(255, 200, 200, 0.7);
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.3)
}

</style>