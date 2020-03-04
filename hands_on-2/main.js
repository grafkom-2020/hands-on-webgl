function main() {
    var canvas = document.getElementById("canvas_main"), gl = canvas.getContext("webgl");

    var vertices = [
        -0.5, 0.5, 0.0, -0.10, -0.5, 0.0, 0.5, -0.5, 0.0,0.5, -0.10, 0.0, 
    ];
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var vertexShaderCode = 
        'attribute vec3 coordinates;' +
        'void main(void) {' +
            ' gl_Position = vec4(coordinates, 1.0);' +
            ' gl_PointSize = 5.0;' +
        '}';

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    
    var fragmentShaderCode =
        'void main(void) {' +
            'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
        '}';

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var coordinate = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinate, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinate);

    gl.clearColor(0.35, 0.35, 0.94, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
}