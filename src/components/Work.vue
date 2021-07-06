<template>

  <section class='textWrapper'>

     <div class='row'>
       <!-- left arrow -->
       <div class='col-1 align-self-center'>
        <i id='leftArrow' class="fas fa-chevron-left arrowColor" @click='leftArrowClickHandler'></i>
       </div>

      <!-- main component -->
       <div class='col-10 align-self-center'>
          <div class='row'>

            <!-- projects itself -->
            <div class='col-12 align-self-start'>
              <div id='projects'>
                <div class='row justify-content-around align-items-center'>
                  <div class='col-12'
                  v-for='work in works' 
                  :key='work.name'
                  >
                    <!-- project -->
                    <div class='project' v-if='isPointingToProject(work.name)'>

                      <h1 class='title titleFont'>{{ work.title }}</h1>
                      <div class='contacts'>
                        <div class='row justify-content-around'>
                          <!-- github link -->
                          <div class="col">
                            <div class='link' data-bs-toggle="tooltip" data-bs-placement="bottom" title="See my github repo">
                              <i class='fab fa-github-alt'></i><br/>
                              <small class='d-lg-none iconLabel'>repo</small>
                            </div>
                          </div>
                          <!-- presentation link -->
                          <div class="col">
                            <div class='link' data-bs-toggle="tooltip" data-bs-placement="bottom" title="More  details about this project">
                              <i class=' fas fa-cog'></i><br/>
                              <small class='d-lg-none iconLabel'>details</small>
                            </div>
                          </div>
                          <!-- site  -->
                          <div class="col">
                            <div class='link' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Visit this project">
                              <i class=' far fa-eye'></i><br/>
                              <small class='d-lg-none iconLabel'>site</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <small class='d-lg-block d-none subTitle subTitleFont'> {{ work.subTitle }} </small>
                      <p class='description descriptionFont'> {{ work.description }} </p>
                      <div class='techs mt-1'>
                        <div class='row justify-content-around'>
                          <div class='col' v-for='tech in work.usedTechs' :key='tech'>
                            <small class='tech titleFont'>{{ tech }}</small>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>

                </div>
              </div>

            
            </div>
          <!-- all projects minified -->
            <div class='col-12 align-self-end mt-0'>
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

  </section>

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
    },
  },
  async mounted(){
    await this.getWorks()
    if(this.works.length > 0){
      this.projectIndex = 0
      this.projectPointer = this.works[this.projectIndex].name
    }
  }

}
</script>

<style scoped>  
/* #projects{
  height:85%;
  width:100%;
} */
.description{
  font-size:2.5vw !important;
}
.tech{
  font-size:2.2vw !important;
  
}
.contacts{
  bottom: 20px;

}
.arrowColor{
  color: rgba(255, 230, 121, 0.589);
  cursor: pointer;
  font-size:15px;
  text-align: center !important;
}
.arrowColor:hover{
  color: rgba(255, 230, 121, 0.689);
  font-size: 20px;
}
.smallText{
  font-size:2.1vw !important;
  bottom:10px;
  margin-top: 30px;
}
.subTitle{
  margin:20px;
  font-size:3vw;
  color:rgba(255, 230, 121, 0.589);
}

.selectedMinified{
  font-family: "Bebas Neue", cursive;
  color:rgba(255, 230, 121, 0.589);
  font-size:4vw;
  font-style: oblique;
  
}
.link{
  font-size: 2.3vw;
}


</style>