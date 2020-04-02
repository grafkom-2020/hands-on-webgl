function main() {
    var canvas = document.getElementById("canvas_main"), gl = canvas.getContext("webgl");

    var vertices = [];
    var cubePoints = [
        [-0.5,  0.5,  0.5],   // A, 0
        [-0.5, -0.5,  0.5],   // B, 1
        [ 0.5, -0.5,  0.5],   // C, 2 
        [ 0.5,  0.5,  0.5],   // D, 3
        [-0.5,  0.5, -0.5],   // E, 4
        [-0.5, -0.5, -0.5],   // F, 5
        [ 0.5, -0.5, -0.5],   // G, 6
        [ 0.5,  0.5, -0.5]    // H, 7 
    ];
    var cubeColors = [
        [],
        [1.0, 0.0, 0.0],    // merah
        [0.0, 1.0, 0.0],    // hijau
        [0.0, 0.0, 1.0],    // biru
        [1.0, 1.0, 1.0],    // putih
        [1.0, 0.5, 0.0],    // oranye
        [1.0, 1.0, 0.0],    // kuning
        []
    ];
    function quad(a, b, c, d) {
        var indices = [a, b, c, c, d, a];
        for (var i=0; i<indices.length; i++) {
            for (var j=0; j<3; j++) {
                vertices.push(cubePoints[indices[i]][j]);
            }
            for (var j=0; j<3; j++) {
                vertices.push(cubeColors[a][j]);
            }
        }
    }
    quad(1, 2, 3, 0); // Kubus depan
    quad(2, 6, 7, 3); // Kubus kanan
    quad(3, 7, 4, 0); // Kubus atas
    quad(4, 5, 1, 0); // Kubus kiri
    quad(5, 4, 7, 6); // Kubus belakang
    quad(6, 2, 1, 5); // Kubus bawah

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var vertexShaderCode = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        uniform float deg;
        varying vec3 vColor;
        void main(void) {
            vColor = aColor;
            float d = sin(radians(deg));
            gl_Position = vec4(aPosition.x * (1.0 + d/2.0), aPosition.y * (1.0 + d/2.0), aPosition.z - 1.0, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    
    var fragmentShaderCode = `
        precision mediump float;
        varying vec3 vColor;
        void main(void) {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var position = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(position);
    var color = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(color);

    // Parameter animasi
    var deg = 0;
    var degLoc = gl.getUniformLocation(shaderProgram, 'deg');

    var freeze = false;
    document.addEventListener('keydown', onKeydown, false);
    document.addEventListener('keyup', onKeyup, false);
    function onKeydown(event) {
        if (event.keyCode == 32) {
            freeze = true;
        }
    }
    function onKeyup(event) {
        if (event.keyCode == 32) {
            freeze = false;
        }
    }
    document.addEventListener('click', onMouseClick, false);
    function onMouseClick(event) {
        freeze = !freeze;
    }

    function render() {
        if (!freeze) {
            deg += 1;
        }
        gl.uniform1f(degLoc, deg);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, (gl.canvas.height - gl.canvas.width)/2, gl.canvas.width, gl.canvas.width);
    render();
}