<template>
  <div class='vh-100 vw-100 my-auto bg-dark'>
    <div class='row justify-content-center align-items-center h-100 w-100'>
      <div class="col-12">
        <div class=' progress w-75 mx-auto bg-custom'>
          <div id='progress' class="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar" :aria-valuenow="getAria" aria-valuemin="0" aria-valuemax="100" :style='getStyle'>
            {{label}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: ['progress', 'label'],
  computed: {
    getStyle(){
      return `height:50px; width: ${this.progress}%;aria-valuenow: ${this.progress};`
    },
    getAria(){
      return `${this.progress}`
    }
  }
}
</script>

<style>

  .bg-custom{
    background-color: rgba(255, 255, 255, 0.1)
  }

</style>