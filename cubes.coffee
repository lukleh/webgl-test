

class Space
    constructor: (@container) ->
        @last_time = null
        @objects = []

        @scene = new THREE.Scene
        @renderer = new THREE.WebGLRenderer
        @renderer.setSize(@container.offsetWidth, @container.offsetHeight)
        #@renderer.setClearColor 0x0099FF, 1
        @container.appendChild( @renderer.domElement )
        
        @camera = new THREE.PerspectiveCamera(45, @container.offsetWidth / @container.offsetHeight, 1, 4000 )
        @camera.position.set  0, 0, 10
        
        @light = new THREE.DirectionalLight( 0xffffff, 1.5)
        @light.position.set 0, 0, 1
        @scene.add @light 
        @light2 = new THREE.DirectionalLight( 0xFFFF99, 1.5)
        @light2.position.set(0, 0, -1)
        @scene.add( @light2 )
        @light3 = new THREE.DirectionalLight( 0xFF66CC, 1.5)
        @light3.position.set(1, 0, 0)
        @scene.add( @light3 )
        @light4 = new THREE.DirectionalLight( 0x00FF33, 1.5)
        @light4.position.set(-1, 0, 0)
        @scene.add( @light4 )
        @light5 = new THREE.DirectionalLight( 0x0033FF, 1.5)
        @light5.position.set(0, 1, 0)
        @scene.add( @light5 )
        @light6 = new THREE.DirectionalLight( 0xFF3300, 1.5)
        @light6.position.set(0, -1, 0)
        @scene.add( @light6 )
        
        window.addEventListener 'resize', => @onWindowResize()
        @container.addEventListener 'click', (evt) => @toggleFullScreen(evt)
        @start_stats()


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
        t_step


    setObject3D: (m) ->
        @object3D = m


    setPosition: (pos) ->
        @setPos = pos
        [x, y, z] = pos
        @object3D.position.x = x
        @object3D.position.y = y
        @object3D.position.z = z
        @


class Cube extends Object3D
    constructor: ->
        materials = @makeMaterials()
        material = new THREE.MeshFaceMaterial( materials )
        geometry = new THREE.CubeGeometry(1, 1, 1)
        mesh = new THREE.Mesh(geometry, material)
        @setObject3D mesh


    makeMaterials: ->
        for i in [0..5]
            new THREE.MeshLambertMaterial map: THREE.ImageUtils.loadTexture("img/Numbers-#{i}-icon.png")


    update: (t_step, timestamp) ->
        step = t_step / 16.7
        @object3D.rotation.y -= step * 0.01
        @object3D.rotation.x -= step * 0.01
        @object3D.rotation.z -= step * 0.01


class CubeSpin extends Cube
    allowedRotations: (rot) ->
        [x, y, z] = rot
        @rotX = x
        @rotY = y
        @rotZ = z
        @

    update: (t_step, timestamp) ->
        step = t_step / 16.7
        if @rotX
            @object3D.rotation.y -= step * 0.01
        if @rotY
            @object3D.rotation.x -= step * 0.01
        if @rotZ
            @object3D.rotation.z -= step * 0.01


class CubeRot extends CubeSpin
    constructor: ->
        @rotStart = Math.PI * Math.random()
        super


    update: (t_step, timestamp) ->
        t = new Date().getTime()
        if @rotY
            @object3D.position.x = @setPos[0] + Math.sin(t * 0.0015 + @rotStart)
        if @rotX
            @object3D.position.y = @setPos[1] + Math.sin(t * 0.0015 + @rotStart)
        if @rotZ
            @object3D.position.z = @setPos[2] + Math.sin(t * 0.0015 + @rotStart)
        super t_step, timestamp



makeGrid = (spacX = 1, spacY = 1, spacZ = 1, countX = 1, countY = 1, countZ = 1, center = true) ->
    result = []
    centerX = if center then spacX * (countX - 1) / 2 else 0
    centerY = if center then spacY * (countY - 1) / 2 else 0
    centerZ = if center then spacZ * (countZ - 1) / 2 else 0
    for x in [0...countX]
        for y in [0...countY]
            for z in [0...countZ]
                result.push [x * spacX - centerX, y * spacY - centerY, z * spacZ - centerZ]
    result


makeCombinations = (size) ->
    for x in [0...Math.pow(2, size)]
        s = x.toString(2)
        zeros = new Array(size - s.length + 1).join('0')
        i is '1' for i in (zeros + s)


printout = (o) ->
    console.log JSON.stringify o


run = (container) ->
    m = new Space container 
    grid = makeGrid spacX = 3, spacY = 3, spacZ = 0, countX = 4, countY = 2
    rotations = makeCombinations 3
    for [gpos, rpos] in _.zip grid, rotations
        c = new CubeRot().setPosition(gpos).allowedRotations(rpos)
        m.add c
    m.run() 


window.onload = -> @run document.getElementById "container"
        