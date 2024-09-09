import * as THREE from 'https://cdn.skypack.dev/three@0.124.0'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/RGBELoader.js'
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/OBJLoader.js'

let theta1 = 0
const canvasContainer = document.getElementById('hero-canvas')

const renderer = new THREE.WebGLRenderer({
  canvas: canvasContainer,
  antialias: true,
  alpha: true,
})

function setRendererSize() {
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight)
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
setRendererSize()

const scene = new THREE.Scene()

const hdrEquirect = new RGBELoader()
  .setPath(
    'https://raw.githubusercontent.com/miroleon/gradient_hdr_freebie/main/Gradient_HDR_Freebies/'
  )
  .load('ml_gradient_freebie_01.hdr', function () {
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
  })

scene.environment = hdrEquirect
scene.fog = new THREE.FogExp2(0x11151c, 0.15)

const group = new THREE.Group()
scene.add(group)

const pointlight = new THREE.PointLight(0x85ccb8, 7.5, 10)
pointlight.position.set(0, 1, 0)
group.add(pointlight)

const pointlight2 = new THREE.PointLight(0x9f85cc, 7.5, 10)
pointlight2.position.set(0, 1, 0)
group.add(pointlight2)

const camera = new THREE.PerspectiveCamera(
  45,
  canvasContainer.clientWidth / canvasContainer.clientHeight,
  0.1,
  1000
)
camera.position.z = 10
group.add(camera)

const material1 = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0,
  metalness: 1,
  envMapIntensity: 8,
})

const objloader = new OBJLoader()
objloader.load('./models/maneki_neko.obj', (object) => {
  object.children[0].material = material1
  object.scale.setScalar(2.3)
  object.position.set(0, 0.2, 0)
  group.add(object)
})

let animationFrameId

function onWindowResize() {
  camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight
  camera.updateProjectionMatrix()
  setRendererSize()
}

function update() {
  theta1 += 0.0025
  camera.position.x = Math.sin(theta1) * 10
  camera.position.z = Math.cos(theta1) * 10
  camera.position.y = Math.cos(theta1)

  pointlight.position.x = Math.sin(theta1 + 1) * 11
  pointlight.position.z = Math.cos(theta1 + 1) * 11
  pointlight.position.y = 2 * Math.cos(theta1 - 3) + 3

  pointlight2.position.x = -Math.sin(theta1 + 1) * 11
  pointlight2.position.z = -Math.cos(theta1 + 1) * 11
  pointlight2.position.y = 2 * -Math.cos(theta1 - 3) - 6

  group.rotation.y += 0.0025
  camera.lookAt(0, 0, 0)
}

function animate() {
  update()
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(animate)
}

function startAnimation() {
  if (!animationFrameId) {
    animate()
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

window.addEventListener('resize', onWindowResize)
window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAnimation()
  } else {
    startAnimation()
  }
})

startAnimation()
