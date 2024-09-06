gsap.registerPlugin(ScrollTrigger)

const renderer2 = new THREE.WebGLRenderer({
  canvas: document.getElementById('timeline-canvas'),
})
renderer2.setPixelRatio(window.devicePixelRatio)
renderer2.setSize(window.innerWidth, window.innerHeight)

var scene2 = new THREE.Scene()

var camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera2.position.z = 25
camera2.position.y = 18

var light1 = new THREE.DirectionalLight(0xefefff, 3)
light1.position.set(1, 1, 1).normalize()
scene2.add(light1)

var light2 = new THREE.DirectionalLight(0xffefef, 3)
light2.position.set(-1, -1, -1).normalize()
scene2.add(light2)

window.addEventListener('resize', onWindowResize)

function onWindowResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  renderer2.setSize(width, height)
  camera2.aspect = width / height
  camera2.updateProjectionMatrix()
}

var loader = new THREE.GLTFLoader()
var mixer
var model
loader.load('./models/cat_rigged.glb', function (gltf) {
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true
      node.material.side = THREE.DoubleSide
    }
  })

  model = gltf.scene
  model.scale.set(0.35, 0.35, 0.35)
  scene2.add(model)

  mixer = new THREE.AnimationMixer(model)
  var action = mixer.clipAction(gltf.animations[0])

  createAnimation(mixer, action, gltf.animations[0])
})

var clock = new THREE.Clock()
function render() {
  requestAnimationFrame(render)
  var delta = clock.getDelta()
  if (mixer != null) mixer.update(delta)
  renderer2.render(scene2, camera2)
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200))

  star.position.set(x, y, z)
  scene2.add(star)
}

Array(1000).fill().forEach(addStar)

function createAnimation(mixer, action, clip) {
  let proxy = {
    get time() {
      return mixer.time
    },
    set time(value) {
      action.paused = false
      mixer.setTime(value)
      action.paused = true
    },
  }

  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.brandwrap-section',
      start: 'top top',
      end: '700vh', // Adjust this end value as needed
      scrub: true,
    },
  })

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 3,
  })

  action.play()
}

render()
