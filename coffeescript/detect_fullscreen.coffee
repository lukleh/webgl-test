
fullscreenElement = ->
    document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled

hasFullscreen: ->
    document.webkitIsFullScreen || document.mozFullScreen || document.requestFullscreen


    toggleFullScreen: () ->
        el = document.body
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