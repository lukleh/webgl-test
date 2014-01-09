
webglCapable = ->
    canvas = document.createElement 'canvas'
    try
        gl = canvas.getContext "webgl"
    catch error
        gl = null
    if gl is null
        try 
            gl = canvas.getContext "experimental-webgl"
        catch error
            gl = null
    if gl
        true
    else if "WebGLRenderingContext" in window
        true
    else
        false


window.LL = window.LL || {}
window.LL.webglCapable = webglCapable