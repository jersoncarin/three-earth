import * as THREE from 'three'

export default function generateStar() {
  const geo = new THREE.BufferGeometry()
  const verts = [],
    colors = []

  for (let i = 0; i < 5000; i++) {
    const radius = Math.random() * 25 + 25
    const u = Math.random(),
      v = Math.random()
    const theta = 2 * Math.PI * u,
      phi = Math.acos(2 * v - 1)
    const pos = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )

    verts.push(pos.x, pos.y, pos.z)

    const col = new THREE.Color().setHSL(0.6, 0.2, Math.random())
    colors.push(col.r, col.g, col.b)
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load('./assets/star.png'),
  })

  return new THREE.Points(geo, mat)
}
