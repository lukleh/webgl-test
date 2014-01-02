

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
        @camera.position.set  0, 5, 0
        @camera.lookAt new THREE.Vector3 0,0,0
        #@addToScene(new THREE.AmbientLight(0x666666))
        window.addEventListener 'resize', => @onWindowResize()
        document.querySelector("#fullscreen p").addEventListener 'click', (evt) => @toggleFullScreen(evt)
        @start_stats()


    addToScene: (o) ->
        @scene.add o


    addLight: (x, y, z, color, intensity, castShadow = false) ->
        light = new THREE.DirectionalLight color, intensity
        light.position.set x, y, z
        if castShadow
            light.castShadow = true
            light.shadowCameraNear = 0.01
            light.shadowCameraVisible = true
            light.shadowMapWidth = 2048
            light.shadowMapHeight = 2048
            d = 10
            light.shadowCameraLeft = -d
            light.shadowCameraRight = d
            light.shadowCameraTop = d
            light.shadowCameraBottom = -d

            light.shadowCameraFar = 100
            light.shadowDarkness = 0.5
        @addToScene light


    isFullscreen: ->
        document.webkitIsFullScreen || document.mozFullScreen


    toggleFullScreen: (et) ->
        el = @container
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
        sin_speed = timestamp / 1000 / 4
        @camera.position.x = Math.sin(sin_speed + Math.PI / 2) * 15
        @camera.position.z = Math.sin(sin_speed) * 15
        @camera.lookAt(new THREE.Vector3(0,0,0))
        for o in @objects
            o.update(t_step, timestamp)


    run: (timestamp) ->
        @last_time = timestamp unless @last_time
        t_step = timestamp - @last_time
        if t_step > 0
            @update(t_step, timestamp)
            @render()
            @last_time = timestamp
            @stats.update()
        requestAnimationFrame (par) => @run par


    add: (obj) ->
        @scene.add obj.object3D 
        @objects.push obj

    render: ->
        @renderer.render @scene, @camera


class Object3D
    update: (t_step, timestamp) ->


    setPosition: (pos) ->
        console.log pos
        @setPos = pos
        @object3D.position.x = pos[0]
        @object3D.position.y = pos[1]
        @object3D.position.z = pos[2]
        @


class Cube extends Object3D
    constructor: (@space) ->
        material = new THREE.MeshLambertMaterial(color: 0x888888)
        geometry = new THREE.CubeGeometry(1, 1, 1)
        @object3D = new THREE.Mesh(geometry, material)
        @object3D.castShadow = true
        @object3D.receiveShadow = true


    update: (t_step, timestamp) ->


makeMaze = (x, y) ->
    size = x * y
    mazeArray = ((true for _ in [0...y]) for _ in [0...x])
    startX = _.random(0, x - 1)
    startY = _.random(0, y - 1)
    mazeArray[startX][startY] = 'space'
    wall = neighbourWalls startX, startY, x, y
    while wall.length() > 0
        w = wall.pop()
        if breakWall w
            mazeArray[w.x][w.y] = 'space'
            for w in neighbourWalls w.x, w.y, x, y
                wall.push w
    mazeArray


removePercentMaze = (maze, spars) ->
    p = spars / 100
    for mx, i in maze
        for mz, j in mx
            if Math.random() < p
                if maze[i][j]
                    maze[i][j] = false
    maze


printout = (o) ->
    console.log JSON.stringify o


run_scout = (container) ->
    sizeX = 15
    sizeZ = 16
    s = new Space container

    ## add lights
    #s.addToScene (new THREE.AmbientLight 0xffffff, 0.2)
    # spotLight = new THREE.SpotLight 0xffffff, 1.0
    # spotLight.position.set 5, 5, 5
    # spotLight.castShadow = true
    # s.addToScene spotLight
    s.addLight  5,  10,  5, 0xffffff, 0.3, castShadow = true
    ## add floor
    plane = new THREE.Mesh(new THREE.PlaneGeometry(sizeX, sizeZ), new THREE.MeshBasicMaterial(color: 0x404040))
    plane.rotation.x = -Math.PI / 2
    plane.position.y = 0
    plane.receiveShadow = true
    s.addToScene plane

    maze = makeMaze sizeX, sizeZ
    maze = removePercentMaze maze, 50
    for x in [0...sizeX]
        for z in [0...sizeZ]
            if maze[x][z]
                gx = -(sizeX / 2) + 0.5 + x
                gz = -(sizeZ / 2) + 0.5 + z
                c = new Cube(s).setPosition([gx, 0.5, gz])
                s.addToScene c.object3D
    s.run window.performance.now()


window.LL = window.LL || {}
window.LL.run_scout = run_scout
        