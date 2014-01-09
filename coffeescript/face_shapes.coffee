

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
        @camera.position.set  0, 2, 7
        @camera.lookAt(new THREE.Vector3 0,0,0 )

        light = new THREE.AmbientLight 0xffffff
        @scene.add light
        
        window.addEventListener 'resize', => @onWindowResize()
        @start_stats()


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
        else
            @render()
        requestAnimationFrame (par) => @run par


    add: (obj) ->
        @scene.add obj.object3D 
        obj.attachScene @
        @objects.push obj

    render: ->
        @renderer.render @scene, @camera


class Object3Dcamera
    constructor: (@video) ->
        @videoTexture = new THREE.Texture @video
        @material = new THREE.MeshLambertMaterial {map : @videoTexture}


    attachScene: (scene) ->
        @scene = scene


    update: (t_step, timestamp) ->
        if @video && @video.readyState is @video.HAVE_ENOUGH_DATA
            @videoTexture.needsUpdate = true


    setObject3D: (m) ->
        @object3D = m


    setPosition: (pos) ->
        @setPos = pos
        [x, y, z] = pos
        @object3D.position.x = x
        @object3D.position.y = y
        @object3D.position.z = z
        @



class SpinningObject extends Object3Dcamera
    constructor: (video) ->
        super video
        speed = 0.003
        @rotXspeed = speed
        @rotYspeed = speed
        @rotZspeed = speed


    update: (t_step, timestamp) ->
        step = t_step / 16.7
        if @rotX
            @object3D.rotation.x -= step * @rotXspeed
        if @rotY
            @object3D.rotation.y -= step * @rotYspeed
        if @rotZ
            @object3D.rotation.z -= step * @rotZspeed
        super t_step, timestamp


    allowedRotations: (rot) ->
        [@rotX, @rotY, @rotZ] = rot
        @


class Cube extends SpinningObject
    constructor: (video, dim = 1) ->
        super video
        geometry = new THREE.CubeGeometry(dim, dim, dim)
        mesh = new THREE.Mesh(geometry, @material)
        @setObject3D mesh
        @object3D.rotation.y = Math.PI / 4
        #@rotYspeed = @rotYspeed / 4



class Sphere extends SpinningObject
    constructor: (video, radius = 1, widthSegments = 30, heightSegments = 30) ->
        super video
        geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
        mesh = new THREE.Mesh(geometry, @material)
        @setObject3D mesh
        @object3D.rotation.y = 0



class CylinderGeometry extends SpinningObject
    constructor: (video, radiusTop = 1, radiusBottom = 1, height = 2, radiusSegments = 20) ->
        super video
        geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments)
        mesh = new THREE.Mesh(geometry, @material)
        @setObject3D mesh
        @object3D.rotation.y -= Math.PI / 2



run_face_shapes = (container) ->
    m = new Space container
    f = new LL.Face().autoCreateVideo().doFace()
    m.add(new Cube(f.video, dim = 1.5).setPosition([-2.5, 0, 0]).allowedRotations([false, true, false]))
    m.add(new Sphere(f.video).allowedRotations([false, true, false]))
    m.add(new CylinderGeometry(f.video).setPosition([2.5, 0, 0]).allowedRotations([false, true, false]))
    m.run window.performance.now()


window.LL = window.LL || {}
window.LL.run_face_shapes = run_face_shapes
        