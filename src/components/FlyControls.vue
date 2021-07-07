<template>
   <div class='rounded-circle fly-controls-wrapper'>
      <div class='fly-controls'>
        <div class='row'>
          <div class='col-4'></div>
          <div class='col-4'>
            <div class='clickWrapper text-center arrowUp'>
              <i id='up' class='fas fa-chevron-up arrow'></i>
            </div>
          </div>
          <div class='col-4'></div>
          <div class='col-4'> 
            <div class='clickWrapper arrowLeft' @click='handleLeftClick'>
              <i id='left' class='fas fa-chevron-left arrow'></i>
            </div>
          </div>
          <div class='col-4'><i class='center'></i></div>
          <div class='col-4'>
            <div class='clickWrapper arrowRight' @click='handleRightClick'>
              <i id='right' class='fas fa-chevron-right arrow'></i>
            </div>
          </div>
          <div class='col-4'></div>
          <div class='col-4'>
            <div class='clickWrapper arrowDown' @click='handleDownClick'>
              <i id='down' class='fas fa-chevron-down arrow'></i></div>
          </div>
          <div class='col-4'></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlyControls',
  data(){
    return{
      isAnimating: false
    }
  },
  methods:{
    animateTextDiv(way) {
      const el = document.querySelector('#text')
      const removePastAnimation = () => {
         el.classList.remove(
          'animate__animated',
          way === 'in' ? 'animate__zoomOut': 'animate__zoomIn',
          'animate__duration-200ms',
        )
      }

      removePastAnimation()
     
      el.classList.add(
        'animate__animated',
        way === 'in' ? 'animate__zoomIn' : 'animate__zoomOut',
        'animate__duration-200ms',
      )

      el.addEventListener('animationstart', () => {
        this.isAnimating = true
      })

      el.addEventListener('animationend', () => {
        el.classList.remove(
          'animate__animated',
          way === 'in' ? 'animate__zoomIn' : 'animate__zoomOut',
          'animate__duration-200ms',
        );
        this.isAnimating = false
      })
    },
    addEventListeners(){
      const l = document.querySelector('.arrowLeft')
      const r = document.querySelector('.arrowRight')
      const d = document.querySelector('.arrowDown')
      const u = document.querySelector('.arrowUp')
      const arrows = document.querySelectorAll('.arrow')

      // actions to take when any arrow is pressed
      arrows.forEach(arrow => {

        arrow.addEventListener('mousedown', () => {
          this.animateTextDiv('out')
        });
        arrow.addEventListener('mouseup', () => {
          this.animateTextDiv('in')
        });
        arrow.addEventListener('touchstart', () => {
          this.animateTextDiv('out')
        });
        arrow.addEventListener('touchend', () => {
          this.animateTextDiv('in')
        })
      })

      l.addEventListener('mousedown', this.handleLeftDown)
      l.addEventListener('mouseup', this.handleLeftUp)
      l.addEventListener('touchstart', this.handleLeftDown)
      l.addEventListener("touchend", this.handleLeftUp, {passive: true})
      r.addEventListener('mousedown', this.handleRightDown)
      r.addEventListener('mouseup', this.handleRightUp)
      r.addEventListener('touchstart', this.handleRightDown)
      r.addEventListener("touchend", this.handleRightUp, {passive: true})
      u.addEventListener('mousedown', this.handleUpDown)
      u.addEventListener('mouseup', this.handleUpUp)
      u.addEventListener('touchstart', this.handleUpDown)
      u.addEventListener("touchend", this.handleUpUp, {passive: true})
      d.addEventListener('mousedown', this.handleDownDown)
      d.addEventListener('mouseup', this.handleDownUp)
      d.addEventListener('touchstart', this.handleDownDown)
      d.addEventListener("touchend", this.handleDownUp, {passive: true})
    },
    handleLeftDown(e){
      e.preventDefault()
      this.$store.state.controls.moveState.yawLeft = 1
      this.$store.state.controls.updateRotationVector()
    },
    handleRightDown(e){
      e.preventDefault()
      this.$store.state.controls.moveState.yawRight = 1
      this.$store.state.controls.updateRotationVector()
    },
    handleUpDown(e){
      e.preventDefault()
      this.$store.state.controls.moveState.forward = 1
      this.$store.state.controls.updateMovementVector()
    },
    handleDownDown(e){
      e.preventDefault()
      this.$store.state.controls.moveState.back = 1
      this.$store.state.controls.updateMovementVector()
    },
    handleLeftUp(){
      this.$store.state.controls.moveState.yawLeft = 0
      this.$store.state.controls.updateRotationVector()
    },
    handleRightUp(){
      this.$store.state.controls.moveState.yawRight = 0
      this.$store.state.controls.updateRotationVector()
    },
    handleUpUp(){
      this.$store.state.controls.moveState.forward = 0
      this.$store.state.controls.updateMovementVector()
    },
    handleDownUp(){
      this.$store.state.controls.moveState.back = 0
      this.$store.state.controls.updateMovementVector()
    },
    animate(){
      const el = document.querySelector('.fly-controls-wrapper')
      el.classList.add(
        'animate__animated',
        'animate__rotateIn',
        'animate__delay-1.4s',
        'animate__duration-500ms'
      )
      el.addEventListener('animationend',() => {
        el.classList.remove(
          'animate__animated',
          'animate__rotateIn',
          'animate__delay-1.4s',
          'animate__duration-500ms'
        )
      })
    }
  },
  mounted(){
    this.addEventListeners()
    this.animate()
  }

}
</script>

<style scoped>

.fly-controls-wrapper{
    background-color:rgba(0, 0, 0, 0.55);
    box-shadow:1px 2px 5px 2px rgba(0, 0, 0, 0.55);
    border:0.2px solid rgba(0, 0, 0, 0.66);
    width:80%;
    bottom:0;
    z-index:3;
}

.arrow{
    color:rgba(255, 255, 255, 0.2);
}
.arrow:hover{
    cursor:pointer;
    color:rgba(255, 255, 255, 0.24);
}

i{
    font-size:5vw;
}
</style>