

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
        @camera.position.set  7, 5, 7
        @camera.lookAt new THREE.Vector3 0,0,0
        window.addEventListener 'resize', => @onWindowResize()
        @start_stats()


    addToScene: (o) ->
        @scene.add o


    addLight: (x, y, z, color, intensity, castShadow = false) ->
        light = new THREE.DirectionalLight color, intensity
        light.position.set x, y, z
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
        @addToScene light


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


    addUpdatable: (obj) ->
        @scene.add obj.object3D 
        @objects.push obj

    render: ->
        @renderer.render @scene, @camera


class Object3D
    setPosition: (x, y, z) ->
        @setPos = [x, y, z]
        @object3D.position.x = x
        @object3D.position.y = y
        @object3D.position.z = z
        @


normalDist = ->
    (Math.random() + Math.random() + Math.random()) / 3


class Cube extends Object3D
    constructor: (@space) ->
        material = new THREE.MeshLambertMaterial(color: 0x888888, opacity: 0.5, transparent: true)
        @volume = normalDist() * (1 - 0.4) + 0.1
        @dimX = normalDist() * (1 - 0.2) + 0.2
        @dimZ = @dimX
        @dimY = @volume / (@dimX * @dimZ)
        geometry = new THREE.CubeGeometry(@dimX, @dimY, @dimZ)
        @object3D = new THREE.Mesh(geometry, material)
        #@object3D.castShadow = true
        #@object3D.receiveShadow = true


    setLLC: (x, y, z) ->
        # set left lower center position
        @setPosition x + (@dimX / 2), y + (@dimY / 2), z + (@dimZ / 2)


class Maze
    constructor: (@dimX, @dimY) ->
        @coordinates = @genCoordinates()

    genCoordinates: ->
        res = []
        for i in [0...@dimX]
            for j in [0...@dimY]
                res.push [i, j]
        res


    fromGridCoords: (i, j) ->
        [i - (@dimX / 2), 0, j - (@dimY / 2)]


    toGridCoords: (x, z) ->
        [Math.floor(x + (@dimX / 2)), Math.floor(z + (@dimY / 2))]

    trimPercent: (percent) ->
        p = percent / 100
        for [i, j] in @coordinates
            if Math.random() < p
                if @mazeWalls[i][j]
                    @mazeWalls[i][j] = false


    inGrid: (i, j) ->
        not (i < 0 || j < 0 || i >= @dimX || j >= @dimY)


    cross: (x, y) ->
        for [dx, dy] in [[-1, 0], [1, 0], [0, -1], [0, 1]]
            [x + dx, y + dy]


    around: (x, y) ->
        ret = []
        for dx in [-1,0,1]
            for dy in [-1,0,1]
                if dy != 0 && dx != 0
                    ret.push [x + dx, y + dy]
        ret


    neighbours: (x, y) ->
        ([i, j] for [i, j] in (@cross x, y) when @inGrid(i, j))


    neighbourWalls: (x, y) ->
        ([i, j] for [i, j] in (@neighbours x, y) when @mazeWalls[i][j])


    breakWall: (x, y) ->
        wcount = 0
        for [i, j] in (@cross x, y)
            if not @inGrid(i, j)
                wcount += 1
            else
                if @mazeWalls[i][j]
                    wcount += 1
        wcount > 2


    make: ->
        @mazeWalls = ((true for ign in [0...@dimY]) for ign in [0...@dimX])
        startX = _.random 0, @dimX - 1
        startY = _.random 0, @dimY - 1
        @mazeWalls[startX][startY] = false
         
        wall = @neighbourWalls startX, startY
        while wall.length > 0
            indx = Math.floor(Math.random() * wall.length)
            [x, y] = wall[indx]
            wall.splice indx, 1
            if not @mazeWalls[x][y]
                continue
            if @breakWall x, y
                @mazeWalls[x][y] = false
                for [i, j] in @neighbourWalls x, y
                    isIn = (w for w in wall when w[0] is i and w[1] is j)
                    if isIn.length == 0
                        wall.push [i, j]
        @mazeWalls


    randomEmptyCell: ->
        res = []
        for [i, j] in @coordinates
            if not @mazeWalls[i][j]
                res.push [i,j]
        res[Math.floor(Math.random() * res.length)]


printout = (o) ->
    console.log JSON.stringify o


class Scout extends Object3D
    constructor: (@space, @maze) ->
        @dimX = 0.5
        @dimY = 0.5
        @dimZ = 0.5
        color = 0x0099FF
        sphere = new THREE.SphereGeometry 0.05
        lp = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( color: color ))
        lp.position = 
        #light = new THREE.SpotLight color, 2.0, 5
        light = new THREE.PointLight color, 1.0, 4
        lp.position = light.position
        @space.addToScene lp
        @object3D = light
        [i, j] = @maze.randomEmptyCell()
        [sx, sy, sz] = maze.fromGridCoords i, j
        @.setLLC sx, sy, sz

    setLLC: (x, y, z) ->
        # set left lower center position
        @setPosition x + (@dimX / 2), y + (@dimY / 2) + 0, z + (@dimZ / 2)


    update: (t_step, timestamp) ->
        sin_speed = timestamp / 1000 / 3
        
        [x, z] = @maze.toGridCoords @object3D.position.x, @object3D.position.z
        for [i, j] in @maze.neighbours(x, z)
            #if @maze.mazeWalls[x][z]
            #    console.log @maze.mazeWalls[x][z].dimY
            true

        @object3D.position.x = Math.sin(sin_speed + Math.PI / 2) * 4
        @object3D.position.z = Math.sin(sin_speed) * 4

        @space.camera.lookAt @object3D.position



run_scout = (container) ->
    sizeX = 15
    sizeZ = 15
    s = new Space container
    ## add lights
    s.addToScene (new THREE.AmbientLight 0x101010)
    s.addLight  3,  10,  2, 0x505050, 0.3
    ## add floor
    plane = new THREE.Mesh(new THREE.PlaneGeometry(sizeX, sizeZ, 50, 50), new THREE.MeshLambertMaterial(color: 0x404040))
    plane.rotation.x = - Math.PI / 2
    plane.position.y = 0
    s.addToScene plane

    maze = new Maze sizeX, sizeZ
    maze.make()
    maze.trimPercent 0
    for [i, j] in maze.coordinates
        if maze.mazeWalls[i][j]
            [x, y, z] = maze.fromGridCoords i, j
            c = new Cube(s).setLLC x, y, z
            s.addToScene c.object3D
            maze.mazeWalls[i][j] = c
    scout = new Scout s, maze
    s.addUpdatable scout
    s.run window.performance.now()


window.LL = window.LL || {}
window.LL.run_scout = run_scout

        