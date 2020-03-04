# Hands-on 1

## Canvas

Canvas (`<canvas>`) merupakan tag pada HTML5 yang digunakan untuk menggambar grafika via script (JavaScript), misalnya membuat garis, menggabungkan images, dan membuat animasi. Perlu diingat bahwa canvas hanya merupakan sebuah "container"nya saja, perlu script yang merefer ke canvas tersebut agar canvas dapat merender/draw sebuah grafika.

Contoh implementasi canvas:

```HTML
<canvas id="myCanvas" width="200" height="100"></canvas>
```

## Context

Canvas context merupakan object dengan method dan properties yang bisa digunakan untuk menggambar/merender grafika di dalam elemen canvas. Canvas context bisa berupa `2d` dan `webgl` namun tidak terbatas pada dua itu saja. Tiap canvas hanya bisa memiliki satu context, semisal method `getContext()` dipanggil berkali-kali, maka itu akan merefer ke object context yang sama. 

Syntax:

```JavaScript
gl.getContext(contextType);
gl.getContext(contextType, contextAttributes);

//contextType merupakan DOMString berisi context identifier (2d, webgl, bitmaprenderer, etc)
```

Contoh implementasi context:

```HTML
<canvas id="canvas_main" width="300" height="300"></canvas>
```

```JavaScript
var canvas = document.getElementById('canvas_main')
var context = canvas.getContext('2d')
console.log(context)
```

## Context Attributes

Context attributes merupakan sebuah dictionary berisi attribute pada canvas yang dipassing sebagai parameter kedua (optional) pada `getContext()` . Context attributes berbeda-beda tergantung context yang kita apply pada canvas. `WebGLContextAttributes` merupakan context attributes yang dibawa saat kita apply context `webgl` pada canvas kita. Perlu diingat jika kita tidak mem-passing context attributes saat `getContext()` maka default value akan diterapkan

Berikut merupakan context attributes yang bisa kita gunakan saat menggunakan context `webgl` (value merupakan default value setiap context attributes):

```GLSL
dictionary WebGLContextAttributes {
    boolean alpha = true;
    boolean depth = true;
    boolean stencil = false;
    boolean antialias = true;
    boolean premultipliedAlpha = true;
    boolean preserveDrawingBuffer = false;
    WebGLPowerPreference powerPreference = "default";
    boolean failIfMajorPerformanceCaveat = false;
    boolean desynchronized = false;
};
```

Contoh implementasi context attributes:

```JavaScript
var canvas = document.getElementById('canvas_main')
var context = canvas.getContext('webgl', { antialias: false, stencil: true })
console.log(context.contextAttributes())
```

Context attributes dan detailnya bisa dilihat [disini](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext).

## Implementasi Canvas dan WebGL

- Buat canvas dan import file JavaScript yang berisi method untuk rendering pada canvas.

    ```HTML
    <body onload="main()">
        <canvas id="canvas_main" width="800" height="600">
            Browser tidak support HTML5 element.
        </canvas>

        <script type="text/javascript" src="scripts/main.js"></script>
    </body>
    ```

    Pada tag `<body>` terdapat DOM event `onload`, yang memiliki method untuk mengexecute JavaScript langsung setelah page selesai diload.

- Refer canvas pada file JavaScript dan get context sebagai `webgl`

    ```JavaScript
    function main() {
        var canvas = document.getElementById("canvas_main")
        var gl = canvas.getContext("webgl")
    }
    ```

- Clearing WebGL context dengan solid color

    ```JavaScript
    function handleCanvas() {
        ...

        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }
    ```

    `clearColor()` merupakan method yang digunakan untuk mengatur color value yang digunakan saat clear color buffers. Untuk mengecek atau mendapatkan clear color yang terpakai sekarang, bisa dengan melihat value `COLOR_CLEAR_VALUE`. Warna yang diapply akan digunakan saat `clear()` method terpanggil, dengan kata lain method `clearColor()` tidak akan rendering apa-apa. Method ini memiliki param (R, G, B, A) dengan value clamped antara 0 dan 1. Syntax:

    ```JavaScript
    void gl.clearColor(red, green, blue, alpha);
    ```

    `clear()` merupakan method yang "membersihkan" buffer dengan value yang sudah didefinisikan. Value bisa didefinisikan dari method `clearColor()`, `clearDepth()` atau `clearStensil()`. Pada contoh diatas, karena kita menggunakan `clearColor()`, maka kita harus "membersihkan" color buffer agar hasilnya muncul/dirender. Oleh karena itu kita memasukkan param mask yang digunakan adalah `COLOR_BUFFER_BIT`. Param mask merupakan sebuah bitwise yang mengindikasikan buffer mana yang akan "dibersihkan". Terdapat tiga bitwise yang bisa digunakan, sesuai dengan method apa yang kita gunakan untuk membersihkan buffer, yaitu `COLOR_BUFFER_BIT`, `DEPTH_BUFFER_BIT`, dan `STENCIL_BUFFER_BIT`. Syntax: 

    ```JavaScript
    void gl.clear(mask);
    ```

## Viewport

`viewport()` merupakan method pada WebGL yang mengatur viewport, yang mengontrol transformasi posisi atau koordinat pada clip space. Clip space sendiri merupakan sebuah space yang digunakan vertex shader untuk menentukan posisi dimana sebuah vertex akan dirender.
Syntax:
```JavaScript
void gl.viewport(x, y, width, height);
```

Contoh implementasi viewport:

```JavaScript
function handleCanvas() {
    ...

    gl.viewport(0, 0, canvas.width, canvas.height);
}
```

```
vertex attributes --[vertex shader]--> clip space --[viewport]--> canvas space --[CSS]--> HTML frame space --[browser, OS, hardware]--> physical pixel space
```

## Color Mask

Color mask (`colorMask()`) merupakan method yang mengatur color component mana yang enabled/disabled saat drawing atau rendering ke frame buffer. Untuk melihat color mask yang sedang aktif saat ini, bisa dengan melihat value `COLOR_WRITEMASK`.
Syntax:

```JavaScript
void gl.colorMask(red, green, blue, alpha);

//Semua param adalah tipe boolean dengan default value true
```

Contoh implementasi Color Mask:

```JavaScript
function handleCanvas() {
    ...

    gl.clearColor(1.0, 0.0, 0.0, 1.0)
    gl.colorMask(false, true, true, true)
    gl.clear(gl.COLOR_BUFFER_BIT)
}
```

Pada method `clearColor()` kita mempassing warna merah, namun pada saat dirender, output pada canvas bukan warna merah namun warna hitam. Hal ini terjadi karena kita memanggil method `colorMask()` dengan parameter pertama `false`, dengan kata lain kita "mengabaikan" color component warna merah saat rendering.

---
### Referensi yang digunakan:
- [WebGL Specification](https://www.khronos.org/registry/webgl/specs/latest/1.0/)
- [WebGL: 2D and 3D graphics for the web](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [WebGLRenderingContext.clear()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
- [WebGLRenderingContext.clearColor()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
- [WebGLRenderingContext.viewport()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
- [WebGLRenderingContext.colorMask()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)