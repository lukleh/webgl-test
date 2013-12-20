renderer = null
scene = null
camera = null
cube = null
stats = null

start = () ->
    container = document.getElementById("container")
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    container.appendChild( renderer.domElement )

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 )
    camera.position.set( 0, 0, 4 )

    light = new THREE.DirectionalLight( 0xffffff, 1.5)
    light.position.set(0, 1, 1)
    scene.add( light )

    mapUrl = "img/molumen_small_funny_angry_monster.jpg"
    map = THREE.ImageUtils.loadTexture(mapUrl)
  
    material = new THREE.MeshPhongMaterial({ map: map })

    geometry = new THREE.CubeGeometry(1, 1, 1)
    cube = new THREE.Mesh(geometry, material)
    cube.rotation.x = Math.PI / 5
    cube.rotation.y = Math.PI / 5

    scene.add( cube )

    start_stats()
    run()

last_time = null

run = (timestamp) ->
    renderer.render( scene, camera )

    progress
    timestamp = 0 if timestamp is undefined
    last_time = timestamp if last_time is null
    progress = timestamp - last_time

    cube.rotation.y -= (progress / 16.7) * 0.01
    cube.rotation.x -= (progress / 16.7) * 0.01
    cube.rotation.z -= (progress / 16.7) * 0.01
    
    last_time = timestamp
    stats.update()
    requestAnimationFrame(run)


window.onload = () ->
  start()

start_stats = () ->
    stats = new Stats()
    #stats.setMode(1) // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    document.body.appendChild( stats.domElement )
