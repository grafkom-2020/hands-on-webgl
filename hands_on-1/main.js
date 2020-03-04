function main() {
    var canvas = document.getElementById("canvas_main"), gl = canvas.getContext("webgl");

    console.log(gl.getContextAttributes());
    console.log(gl);

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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.colorMask(false, true, true, true);
  
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 10);
}