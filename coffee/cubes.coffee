

class Space
    constructor: (@container) ->
        @last_time = null
        @objects = []

        @scene = new THREE.Scene
        @renderer = new THREE.WebGLRenderer
        @renderer.setSize(@container.offsetWidth, @container.offsetHeight)
        @renderer.shadowMapEnabled = true
        @renderer.shadowMapSoft = true
        #@renderer.setClearColor 0x0099FF, 1
        @container.appendChild( @renderer.domElement )
        
        @camera = new THREE.PerspectiveCamera(45, @container.offsetWidth / @container.offsetHeight, 1, 4000 )
        @camera.position.set  0, 0, 10
        
        @addLight  0,  1,  0, 0xffffff, 1.0, castShadow = true
        @addLight  0,  0,  1, 0xFF0000, 1.0
        @addLight  0,  0, -1, 0x00FF00, 1.0
        @addLight  1,  0,  0, 0x0000FF, 1.0
        @addLight -1,  0,  0, 0xFFFF00, 1.0
        #@scene.add(new THREE.AmbientLight(0x666666))
        floorTexture = THREE.ImageUtils.loadTexture("img/tile.jpg")
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 1, 1 );
        plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 1, 1), new THREE.MeshPhongMaterial(map: floorTexture))
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -3.5
        plane.receiveShadow = true
        @scene.add plane
        
        window.addEventListener 'resize', => @onWindowResize()
        @container.addEventListener 'dblclick', (evt) => @toggleFullScreen(evt)
        @start_stats()


    addLight: (x, y, z, color, intensity, castShadow = false) ->
        light = new THREE.DirectionalLight color, intensity
        light.position.set x, y * 10, z
        if castShadow
            light.castShadow = true
            light.shadowCameraNear = 0.01
            #light.shadowCameraVisible = true
            light.shadowMapWidth = 2048
            light.shadowMapHeight = 2048
            d = 10
            light.shadowCameraLeft = -d
            light.shadowCameraRight = d
            light.shadowCameraTop = d
            light.shadowCameraBottom = -d

            light.shadowCameraFar = 100
            light.shadowDarkness = 0.5
        @scene.add light


    isFullscreen: ->
        document.webkitIsFullScreen || document.mozFullScreen


    toggleFullScreen: (et) ->
        el = et.target
        if not @isFullscreen()
            if el.requestFullscreen
                el.requestFullscreen()
            else if el.mozRequestFullScreen
                el.mozRequestFullScreen()
            else if el.webkitRequestFullscreen
                el.webkitRequestFullscreen Element.ALLOW_KEYBOARD_INPUT
        else
            if document.cancelFullScreen
                document.cancelFullScreen()
            else if document.mozCancelFullScreen
                document.mozCancelFullScreen()
            else if document.webkitCancelFullScreen
                document.webkitCancelFullScreen()


    onWindowResize: ->
        if @isFullscreen
            w = window.innerWidth
            h = window.innerHeight
        else
            w = @container.offsetWidth
            h = @container.offsetHeight
        @camera.aspect = w / h
        @camera.updateProjectionMatrix()
        @renderer.setSize(w, h)


    start_stats: ->
        @stats = new Stats
        #@stats.setMode(1) // 0: fps, 1: ms
        @stats.domElement.style.position = 'absolute'
        @stats.domElement.style.left = '0px'
        @stats.domElement.style.top = '0px'
        document.body.appendChild @stats.domElement


    update: (t_step, timestamp) ->
        t = new Date().getTime()
        @camera.position.x = 0 + Math.sin(t * 0.0002 + Math.PI / 2) * 10
        @camera.position.z = 0 + Math.sin(t * 0.0002) * 10
        @camera.position.y = 5
        @camera.lookAt(new THREE.Vector3(0,0,0))
        for o in @objects
            o.update(t_step, timestamp)


    run: (timestamp) ->
        timestamp = 0 unless timestamp
        @last_time = timestamp unless @last_time
        t_step = timestamp - @last_time
        @update(t_step, timestamp)
        @render()
        @last_time = timestamp
        @stats.update()
        requestAnimationFrame (par) => @run par


    add: (obj) ->
        @scene.add obj.object3D 
        obj.attachScene @
        @objects.push obj

    render: ->
        @renderer.render @scene, @camera


class Object3D
    attachScene: (scene) ->
        @scene = scene


    update: (t_step, timestamp) ->


    setPosition: (pos) ->
        @setPos = pos
        @object3D.position.x = pos[0]
        @object3D.position.y = pos[1]
        @object3D.position.z = pos[2]
        @


class Cube extends Object3D
    constructor: ->
        materials = @makeMaterials()
        material = new THREE.MeshFaceMaterial( materials )
        #material = new THREE.MeshLambertMaterial({color: 0x0aeedf})
        geometry = new THREE.CubeGeometry(1, 1, 1)
        @object3D = new THREE.Mesh(geometry, material)
        @object3D.castShadow = true
        @object3D.receiveShadow = true
        @rotStart = Math.PI * Math.random()


    makeNumber: (n) ->
        text = n.toString()
        bitmap = document.createElement('canvas')
        g = bitmap.getContext('2d')
        bitmap.width = 100
        bitmap.height = 100
        g.fillStyle = '#FFFFFF'
        g.fillRect(0, 0, bitmap.width, bitmap.height)
        g.font = 'Bold 80px Arial'
        g.fillStyle = 'black'
        g.textBaseline = 'middle'
        g.textAlign = 'center'
        g.fillText(text, bitmap.width / 2, bitmap.height / 2)
        bitmap


    makeMaterials: ->
        for i in [0..5]
            texture = new THREE.Texture (@makeNumber i)
            texture.needsUpdate = true
            new THREE.MeshLambertMaterial map: texture


    allowedRotations: (rot) ->
        [@rotX, @rotY, @rotZ] = rot
        @rotXspeed = 0.01
        @rotYspeed = 0.01
        @rotZspeed = 0.01
        @

    update: (t_step, timestamp) ->
        step = t_step / 16.7
        t = new Date().getTime()
        if @rotX
            @object3D.rotation.x -= step * @rotXspeed
            @object3D.position.x = @setPos[0] + Math.sin(t * 0.0015 + @rotStart)
        if @rotY
            @object3D.rotation.y -= step * @rotYspeed
            @object3D.position.y = @setPos[1] + Math.sin(t * 0.0015 + @rotStart)
        if @rotZ
            @object3D.rotation.z -= step * @rotZspeed
            @object3D.position.z = @setPos[2] + Math.sin(t * 0.0015 + @rotStart)


makeGrid = ({spacing, count, centered}) ->
    spacing ?= new THREE.Vector3(1, 1, 1)
    count ?= new THREE.Vector3(1, 1, 1)
    centered ?= true
    center = new THREE.Vector3(0, 0, 0)
    result = []
    if centered
        center.multiplyVectors spacing, (new THREE.Vector3()).subVectors(count, new THREE.Vector3(1, 1, 1))
        center.divide (new THREE.Vector3(2, 2, 2))
    for x in [0...count.x]
        for y in [0...count.y]
            for z in [0...count.z]
                result.push [x * spacing.x - center.x, y * spacing.y - center.y, z * spacing.z - center.z]
    result


makeCombinations = (size) ->
    for x in [0...Math.pow(2, size)]
        for i in [0..size]
            ((x >> i) & 1) is 1


printout = (o) ->
    console.log JSON.stringify o


run_cubes = (container) ->
    m = new Space container
    grid = makeGrid spacing: new THREE.Vector3(3, 3, 0), count: new THREE.Vector3(4, 2, 1)
    rotations = makeCombinations 3
    for [gpos, rot] in _.zip grid, rotations
        c = new Cube().setPosition(gpos).allowedRotations(rot)
        m.add c
    m.run() 


window.LL = window.LL || {}
window.LL.run_cubes = run_cubes

#window.onload = -> run_cubes document.getElementById "container"
        