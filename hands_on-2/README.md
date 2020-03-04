# Hands-on 2

## Shader

Shader merupakan program yang didesain untuk di-run pada graphics processor, secara paralel. Shader ditulis menggunakan OpenGL ES Shader Language (GLSL). Untuk bisa bekerja, WebGL membutuhkan 2 shader setiap kali kita draw sesuatu pada canvas, yaitu *fragment shader* dan *vertex shader.* Setiap shader ini merupakan sebuah function/method. Kedua shader ini akan saling berhubungan menjadi sebuah program/shader program. Pada sebuah project/aplikasi WebGL, shader program lebih dari satu terkadang dibutuhkan.

### Vertex Shader

![https://webglfundamentals.org/webgl/lessons/resources/vertex-shader-anim.gif](https://webglfundamentals.org/webgl/lessons/resources/vertex-shader-anim.gif)

Vertex shader merupakan sebuah fungsi yang dipanggil pada setiap vertex. Vertex shader mengontrol data pada setiap vertex (per-vertex data) seperti koordinat, warna, dan texture pada koordinat tersebut. Selain itu vertex shader juga mengatur transformasi vertex, seperti merubah koordinat vertex, normalisasi, transformasi texture koordinat, lighting, dan color material.
Sample code vertex shader:

```GLSL
//attribute merupakan qualifier yang menghubungkan antara vertex shader dan per-vertex data
//value ini selalu beruba setiap eksekusi vertex shader
attribute vec2 coordinates;

void main(void) {
    gl_Position = vec4(coordinates, 0.0, 1.0);
};
```

Pada sample di atas, kita mendeklarasikan sebuah attribute variable bernama `coordinates`. Variable ini akan diasosiakan (dihubungkan) dengan *Vertex Buffer Object* menggunakan method `getAttribLocation()`. 

`gl_Position` merupakan variable yang sudah predefined yang hanya ada di vertex shader. Variablee ini yang berisi posisi dari vertex. Pada sample diatas, attribute variable `coordinates` dipassing dalam bentuk vector. 

### Fragment Shader

![https://gsculerlor.s-ul.eu/MRoljygw](https://gsculerlor.s-ul.eu/MRoljygw)

Sebuah mesh terbuat dari beberapa triangles, dan permukaan dari tiap triangle ini yang disebut dengan fragment. Fragment shader sendiri merupakan sebuah fungsi yang dipanggil pada setiap fragment. Fragment shader akan mengatur dan mengkalkulasi warna pada setiap pixelnya. Fragment shader dapat melakukan operasi pada interpolated value, texture, fog, dan color summing.
Sample code fragment shader:

```GLSL
void main(void) {
    gl_FragColor = vec4(0, 0.8, 0, 1);
}
```

Pada sample di atas, value dari color disimpan pada variable `gl_FragColor`. `gl_FragColor` merupakan variable predefined pada fragment shader yang membawa output data berupa color value dari pixel.

### Implementasi shader pada WebGL

Implementasi shader pada WebGL membutuhkan beberapa step:

- Membuat shader object

    Pada WebGL, terdapat method `createShader()` yang akan membuat shader object kosong.
    Syntax:

    ```GLSL
    Object createShader (enum type)
    //Enum type bisa berupa gl.VERTEX_SHADER atau gl.FRAGMENT_SHADER
    ```

- Attach source ke shader object

    Source code shader kita perlu diattach ke shader object yang sudah kita buat sebelumnya menggunakan method `shaderSource()`
    Syntax:

    ```GLSL
    void shaderSource(Object shader, string source)
    ```

- Compile shader

    Setelah shader object attached dengan sourcenya, shader perlu di compile sebelum kita passing ke program kita menggunakan method `compileShader()`
    Syntax:

    ```GLSL
    void compileShader(Object shader)
    ```

Contoh implementasi:

```Javascript
var vertCode =
    'attribute vec2 coordinates;' +
    
    'void main(void) {' +
        ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
    '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);
    
var fragCode =
    'void main(void) {' +
        ' gl_FragColor = vec4(0.0, 1.0, 1.0, 0.5);' +
    '}';

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);
```

Setelah selesai membuat vertex shader dan fragment shader, kita perlu menggabungkan keduanya ke dalam sebuah program:

- Membuat program object

    Seperti biasa kita perlu membuat program object kosong, menggunakan method `createProgram()`
    Syntax:

    ```GLSL
    WebGLProgram gl.createProgram();
    ```

- Attach shader ke program

    Setelah memiliki object program kosong, kita perlu attach shader yang sudah dicompile sebelumnya ke dalam program kita menggunakan method `attachShader()`
    Syntax:

    ```GLSL
    void gl.attachShader(program, shader);
    ```

- Link program

    Linking program merupakan tahap akhir untuk linking antar program (shader progam dan program) menggunakan method `linkProgram()`
    Syntax:

    ```GLSL
    void gl.linkProgram(program);
    ```

- Menggunakan program yang sudah dibuat

    Kita perlu menspesifikkan program mana yang akan digunakan sebagai bagian dari rendering state menggunakan method `useProgram()`
    Syntax:

    ```GLSL
    void gl.useProgram(program);
    ```

Contoh implementasi:

```JavaScript
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
```

## Drawing Points dan Triangles

Define vertices sebagai coordinates dan simpan ke dalam buffer

```JavaScript
var vertices = [
    -0.5,   0.5,  0.0,
    -0.5,  -0.5,  0.0,
    0.5,  -0.5,  0.0, 
];

var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
```

Membuat dan compile shaders dan WebGL program

```JavaScript
var vertCode =
    'attribute vec3 coordinates;' +

    'void main(void) {' +
        'gl_Position = vec4(coordinates, 1.0);' +
        'gl_PointSize = 10.0;'+
    '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragCode =
    'void main(void) {' +
        ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
    '}';

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader); 
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
```

Associate shader dengan buffer object

```JavaScript
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);
```

Draw objects

```JavaScript
gl.drawArrays(gl.POINTS, 0, 3);
```

Untuk menggambar sebuah Triangles, yang perlu diubah adalah parameter yang dipassing kedalam fungsi `gl.drawArrays` atau `gl.drawElements`. Ada 7 jenis, yaitu `POINTS`, `LINES`, `LINE_STRIP`, `LINE_LOOP`, `TRIANGLES`, `TRIANGLE_STRIP`, dan `TRIANGLE_FAN`. Jadi untuk menggambar sebuah triangle dengan vertex yang sudah dibuat sebelumnya cukup dengan merubah line berikut.

```JavaScript
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

Perlu diperhatikan juga bahwa kita juga bisa menghapus `gl_PointSize` yang kita gunakan sebelumnya karena yang dirender bukanlah points.

---

### Referensi yang digunakan:
- [Shader](https://www.khronos.org/opengl/wiki/Shader)
- [WebGLShader](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
- [WebGL Specification](https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.8)
- [WebGL Shaders and GLSL](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html)
- [Unbinding a WebGL buffer, worth it?](https://stackoverflow.com/questions/28259022/unbinding-a-webgl-buffer-worth-it)
- [WebGLRenderingContext.drawArrays()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays)
- [WebGLRenderingContext.drawElements()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements)