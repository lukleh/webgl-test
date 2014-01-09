runDemo = (fn) ->
    document.querySelector("#hud p").addEventListener 'click', (evt) ->
        if screenfull.enabled
            screenfull.toggle()
    if LL.webglCapable()
        fn document.getElementById("container")
    else
        document.getElementById("container").style.display = "none"
        document.getElementById("hud").style.display = "none"
        document.getElementById("webglfallback").style.display = "block"



window.LL = window.LL || {}
window.LL.runDemo = runDemo