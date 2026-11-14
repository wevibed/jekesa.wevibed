import * as THREE from 'three'

export function createHeroScene(container) {
  const coarse = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: false, powerPreference: 'low-power' })
  } catch (error) {
    container.classList.add('hero-3d-unavailable')
    return { dispose() {} }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.1 : 1.45))
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  renderer.shadowMap.enabled = false
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x171a1e)
  scene.fog = new THREE.Fog(0x171a1e, 9, 23)
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 60)
  camera.position.set(0, 2.25, 9.6)
  camera.lookAt(0, 2.05, -2.2)

  const materials = {
    wall: new THREE.MeshStandardMaterial({ color: 0x282b2d, roughness: .88 }),
    panel: new THREE.MeshStandardMaterial({ color: 0x343638, roughness: .78 }),
    floor: new THREE.MeshStandardMaterial({ color: 0x554637, roughness: .48, metalness: .12 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xb18a51, roughness: .28, metalness: .82 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x111519, roughness: .32, metalness: .55 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xffe2ad, roughness: .18, metalness: .08, emissive: 0xffb85d, emissiveIntensity: 1.15 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x6a6257, roughness: .42, metalness: .08 })
  }
  const addBox = (w,h,d,material,x,y,z,cast=true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material)
    mesh.position.set(x,y,z); mesh.castShadow = cast; mesh.receiveShadow = true; scene.add(mesh); return mesh
  }

  // A restrained architectural gallery interior, framed as one continuous room.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), materials.floor)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.03; floor.receiveShadow = true; scene.add(floor)
  addBox(15, 7, .28, materials.wall, 0, 3.35, -5.7, false)
  addBox(.28, 7, 13, materials.wall, -7.45, 3.35, .65, false)
  addBox(.28, 7, 13, materials.wall, 7.45, 3.35, .65, false)
  addBox(15, .16, 13, new THREE.MeshStandardMaterial({ color: 0x171a1d, roughness: .92 }), 0, 6.85, .65, false)
  // Tall wall panels and subtle brass reveals.
  for (let x = -6.25; x <= 6.26; x += 2.5) {
    addBox(.025, 5.35, .035, materials.brass, x, 3.2, -5.53, false)
  }
  for (const y of [1.05, 5.85]) addBox(13.1, .025, .035, materials.brass, 0, y, -5.52, false)
  // Instanced floor seams keep the architectural texture without hundreds of draw calls.
  const seamMat = new THREE.MeshStandardMaterial({ color: 0x332a22, roughness: .82 })
  const seams = new THREE.InstancedMesh(new THREE.BoxGeometry(14.5, .012, .012), seamMat, 17)
  const seamDummy = new THREE.Object3D()
  for (let i = 0; i < 17; i++) {
    seamDummy.position.set(0, -.008, -5 + i * .72)
    seamDummy.updateMatrix()
    seams.setMatrixAt(i, seamDummy.matrix)
  }
  scene.add(seams)

  // Architectural console and framed lighting artwork.
  addBox(3.5, .16, .72, materials.stone, 0, 1.12, -3.5)
  addBox(3.25, .72, .62, materials.dark, 0, .66, -3.5)
  addBox(3.42, .045, .78, materials.brass, 0, 1.22, -3.5)
  addBox(1.65, 1.28, .08, materials.brass, -.1, 3.1, -5.48, false)
  addBox(1.53, 1.16, .045, materials.dark, -.1, 3.1, -5.4, false)
  addBox(1.2, .06, .06, materials.brass, -.1, 3.1, -5.34, false)

  // Signature sculptural pendant: a brass ribbon with illuminated opal globes.
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x17191b, metalness: .72, roughness: .3 })
  for (const x of [-1.35, 1.35]) {
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,2.15,10), cableMat)
    cable.position.set(x, 5.72, -1.5); scene.add(cable)
  }
  const ribbonPoints = []
  for (let i = 0; i <= 100; i++) {
    const t = i / 100
    ribbonPoints.push(new THREE.Vector3(-2.65 + t*5.3, 4.05 + Math.sin(t*Math.PI*3.2)*.52 + Math.sin(t*Math.PI)*.22, -1.5))
  }
  const ribbon = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ribbonPoints), 180, .045, 12, false), materials.brass)
  ribbon.castShadow = true; scene.add(ribbon)
  const bulbs = []
  for (const x of [-1.55, -.55, .55, 1.55]) {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.19, 24, 18), materials.glass)
    bulb.position.set(x, 3.7 + Math.sin((x+2.65)/5.3*Math.PI*3.2)*.52, -1.5); scene.add(bulb)
    const light = new THREE.PointLight(0xffc77d, 1.45, 5.2, 2)
    light.position.copy(bulb.position); scene.add(light); bulbs.push({bulb,light})
  }

  // Wall sconces and a slim floor lamp add layers of light to the environment.
  const sconcePositions = [[-5.8,3.25,-5.18],[5.8,3.25,-5.18]]
  sconcePositions.forEach(([x,y,z]) => {
    addBox(.22,.5,.18,materials.dark,x,y,z)
    const shade = new THREE.Mesh(new THREE.BoxGeometry(.18,.38,.13),materials.glass); shade.position.set(x,y,z+.13); scene.add(shade)
    const glow = new THREE.PointLight(0xffc77d,1.05,4,2); glow.position.set(x,y,z+.3); scene.add(glow)
  })
  addBox(.06,2.15,.06,materials.brass,4.25,1.05,-1.4)
  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(.18,.42,.52,32,1,true),materials.dark); lampShade.position.set(4.25,2.42,-1.4); scene.add(lampShade)
  const floorGlow = new THREE.PointLight(0xffc77d,1.2,4,2); floorGlow.position.set(4.25,2.15,-1.35); scene.add(floorGlow)

  // Ambient architectural light and a warm grazing source.
  scene.add(new THREE.HemisphereLight(0xc4c7cf, 0x2a211a, .78))
  const key = new THREE.DirectionalLight(0xffe2bd, 1.15); key.position.set(-3,8,5); key.castShadow = !coarse; key.shadow.mapSize.set(1024,1024); scene.add(key)
  const wash = new THREE.SpotLight(0xffd8a2, 1.7, 16, Math.PI/4, .55, 1.2); wash.position.set(-2,5.8,1); wash.target.position.set(0,1.8,-3.5); scene.add(wash, wash.target)

  let raf = 0, disposed = false, visible = true, intersecting = true, active = true
  const clock = new THREE.Clock()
  function resize(){
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight)
    renderer.setSize(w,h,false); camera.aspect = w/h; camera.fov = w/h < .72 ? 58 : 43; camera.updateProjectionMatrix()
    if (visible && !document.hidden) renderer.render(scene,camera)
  }
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
  if (resizeObserver) resizeObserver.observe(container)
  else window.addEventListener('resize', resize, { passive: true })
  const visibilityObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(entries => {
        intersecting = !!entries[0]?.isIntersecting
        visible = intersecting && active
        if (visible) wake()
        else { cancelAnimationFrame(raf); raf = 0 }
      }, { threshold: 0.01 })
    : null
  visibilityObserver?.observe(container)
  function frame(){
    raf = 0
    if(disposed || !visible || document.hidden) return
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t*.11)*.13
    camera.position.y = 2.25 + Math.sin(t*.17)*.035
    camera.lookAt(Math.sin(t*.09)*.1,2.05,-2.2)
    bulbs.forEach(({bulb,light},i)=>{const pulse=1+Math.sin(t*1.1+i*.7)*.025;bulb.scale.setScalar(pulse);light.intensity=1.4+Math.sin(t*.8+i)*.045})
    renderer.render(scene,camera)
    raf = requestAnimationFrame(frame)
  }
  function wake(){
    if (!disposed && visible && !document.hidden && !raf) {
      renderer.render(scene,camera)
      raf = requestAnimationFrame(frame)
    }
  }
  const onVisibilityChange = () => document.hidden ? (cancelAnimationFrame(raf), raf = 0) : wake()
  document.addEventListener('visibilitychange', onVisibilityChange)
  resize()
  wake()
  return { setActive(value){
    active = !!value
    visible = intersecting && active
    if (visible) wake()
    else { cancelAnimationFrame(raf); raf = 0 }
  }, dispose(){
    disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();visibilityObserver?.disconnect()
    if (!resizeObserver) window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    renderer.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})
    renderer.domElement.remove()
  } }
}
