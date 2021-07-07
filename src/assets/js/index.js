import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FlyControls } from '../../FlyControls.js';
import * as TWEEN from '../js/tween.umd.js';

export default class Animation{

  constructor(el){
    
    this.isAppended = false
    this.percent = 0
    this.label = ''
    this.LOADER = new GLTFLoader()
    this.CAMERALIMITS = {
      x: {
        max: 454,
        min: -438
      },
      y: {
        max: 312,
        min: 17
      },
      z:{
        max: 690,
        min: -70
      }
    }
    this.FALLINGLIMITS = {
      x: {
        max: 447,
        min: -326
      },
      y:{
        max: 312,
        min: 17
      },
      z: {
          min: 62,
          max: 423
      }
    }

    this.TWEENTARGETS = {
      chemicals: {
        pos: new THREE.Vector3(-243, 138, 513),
        lookAt: new THREE.Vector3(-243, 148, 689)
      },
      window:{
        pos: new THREE.Vector3(270, 203, 94),
        lookAt: new THREE.Vector3(276, 350 -168)
      },
      shelf:{
        pos: new THREE.Vector3(30, 197, 283),
        lookAt: new THREE.Vector3(30, 150, -100),
      },
      frame:{
        pos: new THREE.Vector3(-237, 227, 534),
        lookAt: new THREE.Vector3(-500, 227, 534),
      },
      door:{
        pos: new THREE.Vector3(-214, 127, -69),
        lookAt: new THREE.Vector3(-176, 125, 374),
      },
    }
    this.CAMERATARGET = new THREE.Object3D()
    this.scene = null
    this.camera = null
    this.renderer = null
    this.light = null
    this.falling = []
    this.models = {}
    this.staticModels = {}
    this.controls = null
    this.clock = null
    this.tween = null
    this.loaded = false
    this.animate = this.animate.bind(this)
    this.element = el
    this.screen = null
    this.screenLayer = null

  }

  async loadModels(){
    const labelConst = 'Loading model'
    this.label = `${labelConst} pickleRick`
    this.models['pickleRick'] = await this.loadModel('./models/pickleRick/scene.gltf')
    this.label = `${labelConst} portalGun`
    this.models['portalGun'] = await this.loadModel('./models/portalGun/scene.gltf')
    this.label = `${labelConst} plumbus`
    this.models['plumbus'] = await this.loadModel('./models/plumbus/scene.gltf')
    this.label = `${labelConst} Rick's garage`
    this.staticModels['garage'] = await this.loadModel('./models/rickGarage/scene.gltf')
  }

  
  randomPos(){

    const pos =  new THREE.Vector3(
      Math.random() * (this.FALLINGLIMITS.x.max - this.FALLINGLIMITS.x.min) + this.FALLINGLIMITS.x.min,
      Math.random() * (this.FALLINGLIMITS.y.max - this.FALLINGLIMITS.y.min) + this.FALLINGLIMITS.y.min,
      Math.random() * (this.FALLINGLIMITS.z.max - this.FALLINGLIMITS.z.min) + this.FALLINGLIMITS.z.min
    )
    return pos
  }

  createFalling(max){
    const keys = Object.keys(this.models)
  
    for(let i = 0; i < keys.length; i++){
      const howMany = Math.random() * max
      for(let _ = 0; _ < howMany; _++){
        this.createModel(keys[i])
      }
    }
  }

  createRoom(){
    const clone = this.staticModels['garage'].clone()
    this.scene.add(clone)  
  }

  createModel(name){
    try{
      const positiveOrNegative = (num) => { return ((Math.random() * 100) % 2 === 0) ? num*-1 : num }
  
      const MAX = 0.01
      const MIN = -0.01
      const rotation = Math.random() * (MAX - MIN) + MIN
      const clone = this.models[name].clone()
  
      const obj = {
        mesh: clone,
        rotationY:  positiveOrNegative(rotation),
        rotationZ:  positiveOrNegative(rotation),
        rotationX:  positiveOrNegative(rotation),
        velocity: {
          x: positiveOrNegative(Math.random() / 3),
          y: positiveOrNegative(Math.random() / 3),
          z: positiveOrNegative(Math.random() / 3)
        },
        boundingBox: new THREE.Box3().setFromObject(clone),
        invertAll(){
          this.rotationX *= -1
          this.rotationY *= -1
          this.rotationZ *= -1
          this.velocity.x *= -1
          this.velocity.y *= -1
          this.velocity.z *= -1
        },
        touch(axis) {
          switch(axis){
            case 'x':
              this.velocity.y *= -1
              this.velocity.x *= -1
              break;
            case 'y':
              this.velocity.y *= -1
              this.velocity.z *= -1
              break;
            case 'z':
              this.velocity.z *= -1
              this.velocity.x *= -1 
          }
        }
      }
  
      obj.mesh.position.copy(this.randomPos())
      obj.mesh.rotation.x +=180
  
      this.modelsModifications(obj.mesh, name)
  
      this.scene.add(obj.mesh)
      this.falling.push(obj)
  
    } catch (err){
      console.log(err)
    }
  }

  

  modelsModifications(obj, name){
    let material
    switch(name){
      case 'pickleRick':
        obj.scale.set(10, 10, 14)
        break;
      case 'portalGun':
        obj.scale.set(0.2, 0.2, 0.2)
        break;
      case 'plumbus':
        material = new THREE.MeshToonMaterial({color: 0xffbcf6})
        obj.children[0].material = material
        obj.children[1].material = material
        obj.children[2].material = material
        obj.scale.set(6, 6, 6)
        break;
      default: break;
    }
  }

  collisionHandler(obj){
    if(obj.mesh.position.x > this.FALLINGLIMITS.x.max || obj.mesh.position.x < this.FALLINGLIMITS.x.min){
      obj.touch('x')
    } else if(obj.mesh.position.y > this.FALLINGLIMITS.y.max || obj.mesh.position.y < this.FALLINGLIMITS.y.min){
      obj.touch('y')
    } else if(obj.mesh.position.z > this.FALLINGLIMITS.z.max || obj.mesh.position.z < this.FALLINGLIMITS.z.min){
      obj.touch('z')
    }
  }

  loadFont(text){
    const camera = this.camera
    return new Promise((resolve, reject) => {

      try{
        const loader = new THREE.FontLoader();

        loader.load( './fonts/optimer_regular.typeface.json', function ( font ) {
    
          const geometry = new THREE.TextGeometry( text, {
            font: font,
            size: 1,
            height: 0.1,
            curveSegments: 55,
            bevelEnabled: false,
          });
          const material = new THREE.MeshToonMaterial({color:0xdddddd});
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(camera.position.x, camera.position.y, camera.position.z + 10)
          mesh.rotation.copy(camera.rotation)
          resolve(mesh)
        });

      }catch(err){
        reject(err)
      }
    })
  }

  animateFalling(){

    for(let i = 0; i < this.falling.length; i++){
      this.falling[i].mesh.rotation.z += this.falling[i].rotationZ
      // this.falling[i].mesh.rotation.y += falling[i].rotationY
      this.falling[i].mesh.rotation.x += this.falling[i].rotationX
      this.falling[i].mesh.position.y += this.falling[i].velocity.y
      this.falling[i].mesh.position.z += this.falling[i].velocity.z
      this.falling[i].mesh.position.x += this.falling[i].velocity.x
      this.falling[i].boundingBox = new THREE.Box3().setFromObject(this.falling[i].mesh)
  
      this.collisionHandler(this.falling[i])
    }
  }

  putCameraInLimits(){
    if(this.camera.position.z > this.CAMERALIMITS.z.max){
      this.camera.position.set(this.camera.position.x, this.camera.position.y, this.CAMERALIMITS.z.max - 1)
    }
    if(this.camera.position.z < this.CAMERALIMITS.z.min){
      this.camera.position.set(this.camera.position.x, this.camera.position.y, this.CAMERALIMITS.z.min + 1)
    }
    if(this.camera.position.x > this.CAMERALIMITS.x.max){
      this.camera.position.set( this.CAMERALIMITS.x.max - 1, this.camera.position.y, this.camera.position.z)
    }
    if(this.camera.position.x < this.CAMERALIMITS.x.min){
      this.camera.position.set( this.CAMERALIMITS.x.min + 1, this.camera.position.y, this.camera.position.z)
    }
    if(this.camera.position.y > this.CAMERALIMITS.y.max){
      this.camera.position.set( this.camera.position.x, this.CAMERALIMITS.y.max - 1, this.camera.position.z)
    }
    if(this.camera.position.y < this.CAMERALIMITS.y.min){
      this.camera.position.set( this.camera.position.x, this.CAMERALIMITS.y.min + 1, this.camera.position.z)
    }
  }

  tweenCamera(to, callbacks={}){

    const animateFlyControls = (way) => {
      const el = document.querySelector('.fly-controls-wrapper')
      el.style.setProperty('opacity', way === 'in' ? 1 : 0)
      el.classList.add(
        'animate__animated',
        way === 'in' ? 'animate__rotateIn' : 'animate__rotateOut',
        'animate__delay-300ms'
      )
      el.addEventListener('animationend', () => {
        el.classList.remove(
          'animate__animated',
          way === 'in' ? 'animate__rotateIn' : 'animate__rotateOut',
          'animate__delay-300ms'
        )
      })
    }


    if(this.tween){
      this.tween.stop()
      TWEEN.remove(this.tween)
    }

    this.tween = new TWEEN.Tween(this.camera.position)
    .to(to.pos, 6000)
    .easing(TWEEN.Easing.Quadratic.In)
    .onStart( () => {
      animateFlyControls('out')
      const focus = new TWEEN.Tween(this.CAMERATARGET.position)    
      focus.to(to.lookAt, 6000)
      focus.onUpdate(() => {
        this.camera.lookAt(this.CAMERATARGET.position)
        this.camera.updateProjectionMatrix()
      })
      focus.start()    
      if(callbacks.startParams){
        callbacks.callback(
          callbacks.startParams[0], 
          callbacks.startParams[1], 
          callbacks.place,
          callbacks.afterStarts
        )
      }
    })
    .onComplete(() => {  
      this.tween = null
      animateFlyControls('in')
      if(callbacks.endParams){
        callbacks.callback(
          callbacks.endParams[0], 
          callbacks.endParams[1], 
          callbacks.place,
          callbacks.afterEnds
        )
      }
    })

    .start()
  }

  isCameraInsideLimits(){ 

    if(
      this.camera.position.z < this.CAMERALIMITS.z.max &&
      this.camera.position.z > this.CAMERALIMITS.z.min &&
      this.camera.position.x < this.CAMERALIMITS.x.max &&
      this.camera.position.x > this.CAMERALIMITS.x.min &&
      this.camera.position.y < this.CAMERALIMITS.y.max &&
      this.camera.position.y > this.CAMERALIMITS.y.min
    ){
      return true
    }
    return false
  }

  loadModel(path){
    return new Promise((resolve, reject) => {
      this.LOADER.load(path, (gltf) => {
        resolve(gltf.scene.children[0].children[0].children[0])
      }, (percent) => {
        this.percent += ( percent.loaded / percent.total * 100 ) / 4
      }, (err) => reject(err))
    })
  }

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix(); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("canvas").style.setProperty('height', window.innerHeight);
    document.getElementById('canvas').style.setProperty('width', window.innerWidth);
 
  }

  async init(){  
    
    this.label = "Just a moment"
    await this.loadModels()
    this.label = 'Finishing init'

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x444444)
    // scene.fog = new THREE.Fog({color:0xaaaaaa, far: 5000})
    this.camera = new THREE.PerspectiveCamera( 75, window.innerHeight / window.innerHeight, 1, 10000 );
    this.CAMERATARGET.position.set(-246, 44, 467)
    this.camera.lookAt(this.CAMERATARGET.position)
    this.camera.updateProjectionMatrix()
  
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#canvas canvas"), 
      antialias: true,
    });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  
    this.controls = new FlyControls(this.camera, this.renderer.domElement);
    this.controls.object.position.set(58, 173, 5)
    this.controls.movementSpeed = 0.1
    this.controls.rollSpeed = 0.0006
  
    this.createLight()
    this.createRoom()
    this.createFalling(2)
    this.addEventListeners()
    // this.scene.add(await this.loadFont("Kratos"))
  
    this.clock = new THREE.Clock()  
    this.percent = 100
    this.label = "Done!"
  }

  addEventListeners(){
    const controls = this.controls
    document.addEventListener('keydown', function (event) {
      if (event.key === 'i') {
        console.log(`camera pos:\n${JSON.stringify(controls.object.position, null, 2)}`)
      }
    });
    document.addEventListener('resize', this.onWindowResize)
  }

  createLight(){
    const h_light = new THREE.HemisphereLight(0xddddff, 0xaaaacc, 0.4)
    const h_light2 = new THREE.HemisphereLight(0xddddff, 0xaaaacc, 0.4)
    h_light.position.set(-141, 302, 294)
    h_light2.position.set(-162, 303, 335)
    this.scene.add(h_light)
    this.scene.add(h_light2)
  
    this.light = new THREE.PointLight(0xFFFD5B, 1, 1000)
    this.light.position.set(-336, 260, -8)
    this.scene.add(this.light)
  
  }

  animate(){
    // if(!this.isAppended){
    // document.body.appendChild(this.renderer.domElement)
    // this.isAppended = true
    // }

    const _animate = () => {
      requestAnimationFrame( _animate );
    
      if(this.isCameraInsideLimits()){

        this.controls.update(this.clock.getElapsedTime())
        TWEEN.update()

      } else {
        this.putCameraInLimits()
      }
    
      this.animateFalling()
      this.renderer.render( this.scene, this.camera );
    }

    _animate()
  }

  goto(place, callbacks){
    if(place){
      this.tweenCamera(this.TWEENTARGETS[place], callbacks)
    } else{
      console.err(`
        Places that you can go:
        ${JSON.stringify(Object.keys(this.TWEENTARGETS))}
      `)
    }
  }  
}