gsap.registerPlugin(ScrollTrigger)

//===================================================== canvas
const renderer2 = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas2'),
})
renderer2.setPixelRatio(window.devicePixelRatio)
renderer2.setSize(window.innerWidth, window.innerHeight)

//===================================================== scene
var scene2 = new THREE.Scene()

//===================================================== camera
var camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera2.position.z = 25
camera2.position.y = 18

//===================================================== lights
var light1 = new THREE.DirectionalLight(0xefefff, 3)
light1.position.set(1, 1, 1).normalize()
scene2.add(light1)

var light2 = new THREE.DirectionalLight(0xffefef, 3)
light2.position.set(-1, -1, -1).normalize()
scene2.add(light2)

//===================================================== resize
window.addEventListener('resize', onWindowResize)

function onWindowResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  renderer2.setSize(width, height)
  camera2.aspect = width / height
  camera2.updateProjectionMatrix()
}

//===================================================== model
var loader = new THREE.GLTFLoader()
var mixer
var model
loader.load('./model/cat_rigged.glb', function (gltf) {
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
  action.play()

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

Array(2700).fill().forEach(addStar)

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
      trigger: '.timeline-container',
      start: 'top top',
      end: '800vh', // Adjust this end value as needed
      pin: true,
      pinSpacing: false, // Prevents additional space when pinned
      scrub: true,
    },
  })

  scrollingTL.to(proxy, {
    time: clip.duration * 1,
    repeat: 4,
  })

  // Adjust the xPercent based on your design needs
  scrollingTL.to(
    '.phases',
    {
      xPercent: -100 * 2.5,
      ease: 'none',
      duration: 2,
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top top',
        end: '800vh', // Use the same end value
        scrub: true,
      },
    },
    0
  ) // Sync with the first timeline
}

render()
