

class Face  
    setVideoElement: (video) ->
        @video = video
        @


    autoCreateVideo: ->
        @video = document.createElement('video')
        @video.width = 640
        @video.height = 360
        @video.autoplay = true
        @


    getUserMedia: ->
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia


    hasGetUserMedia: ->
        if @getUserMedia() then true else false


    cameraErrorCallback: (e) =>
        console.log 'Reeeejected!', e


    showCamera: (localMediaStream) =>
        @video.src = window.URL.createObjectURL localMediaStream
        @video.onloadedmetadata = (e) ->


    startVideo: (params, callback, errorCallback) ->
        if navigator.webkitGetUserMedia
            navigator.webkitGetUserMedia params, callback, errorCallback
        else if navigator.mozGetUserMedia
            navigator.mozGetUserMedia params, callback, errorCallback
        else if navigator.getUserMedia
            navigator.getUserMedia params, callback, errorCallback


    doFace: ->
        if @hasGetUserMedia()
            @startVideo {video: true}, @showCamera, @cameraErrorCallback
        else
            alert 'getUserMedia() is not supported in your browser'
        @


run_face = ->
    video = document.querySelector 'video'
    face = new Face().setVideoElement(video).doFace()


window.LL = window.LL || {}
window.LL.Face = Face
window.LL.run_face = run_face


