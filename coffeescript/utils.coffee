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