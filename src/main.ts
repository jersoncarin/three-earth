import './styles.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import generateStar from './star'

// Window sizes
const w = window.innerWidth
const h = window.innerHeight

// Main scene
const scene = new THREE.Scene()

// Main camera, fov 75, aspect ration is the window size, near clipping plane at 0.1, far clipping plane at 1000
const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000)

// Set the z-axis to 5
camera.position.z = 5

// Setup the webGL renderer
// antialias is set to true to smooth out the edges
const renderer = new THREE.WebGLRenderer({ antialias: true })

// Set the size of the renderer to the window size
renderer.setSize(w, h)

// Since we don't have a canvas we can append the renderer to the body
document.body.appendChild(renderer.domElement)

// Let the threejs handle the color management
THREE.ColorManagement.enabled = true

// We need to set the tone and colorspaces to match the texture
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

// Group the earth so we can add the clouds and atmosphere
// in this group
const earthGroup = new THREE.Group()

// Set the z-axis rotation to specific angle
earthGroup.rotation.z = (-23.4 * Math.PI) / 180

// Add the earth group to the scene
scene.add(earthGroup)

// Setup the orbit controls
const orbit = new OrbitControls(camera, renderer.domElement)

orbit.minDistance = 3
orbit.maxDistance = 50

// Setup the loader
const loader = new THREE.TextureLoader()

// Setup the geometry and material
const geometry = new THREE.IcosahedronGeometry(1, 12)

// Setup the material with the earth textures
const material = new THREE.MeshPhongMaterial({
  map: loader.load('./assets/earthmap.jpg'),
  specularMap: loader.load('./assets/earthspec.jpg'),
  bumpMap: loader.load('./assets/earthbump.jpg'),
  bumpScale: 0.04,
})

// Create the earth mesh
const earthMesh = new THREE.Mesh(geometry, material)

// Add the earth mesh to the earth group
earthGroup.add(earthMesh)

// Setup the lights material
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('./assets/earthlights.jpg'),
  blending: THREE.AdditiveBlending,
})

// Add the lightsMat to the geometry
const lightsMesh = new THREE.Mesh(geometry, lightsMat)

// Add the lightsMesh to the earthGroup
earthGroup.add(lightsMesh)

// Setup the sun light with a color of white and intensity of 2.0
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0)

// Set the position of the sun light
sunLight.position.set(-2, 0.5, 1.5)

// Setup the stars
const stars = generateStar()

// Add the stars to the scene
scene.add(stars)

// Add the sun light to the scene
scene.add(sunLight)

// Update the aspect ration of the camera when the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animate the scene dependes on the frame rate of the device
// since where using requestAnimationFrame
function animate() {
  requestAnimationFrame(animate)

  earthMesh.rotation.y += 0.003
  lightsMesh.rotation.y += 0.003
  stars.rotation.y -= 0.0003
  renderer.render(scene, camera)
}

animate()
