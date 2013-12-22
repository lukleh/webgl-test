

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


    errorCallback: (e) =>
        console.log 'Reeeejected!', e


    showCamera: (localMediaStream) =>
        @video.src = window.URL.createObjectURL localMediaStream
        @video.onloadedmetadata = (e) ->


    doFace: ->
        if @hasGetUserMedia()
            navigator.webkitGetUserMedia {video: true}, @showCamera, @errorCallback
        else
            alert 'getUserMedia() is not supported in your browser'
        @


run_face = ->
    video = document.querySelector 'video'
    face = new Face().setVideoElement(video).doFace()


window.LL = window.LL || {}
window.LL.Face = Face
window.LL.run_face = run_face


