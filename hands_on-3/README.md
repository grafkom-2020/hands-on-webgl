# Hands-on 3

## Proses di CPU (JavaScript)

Kita sekarang berpindah dari pembuatan obyek 2D (segitiga di hands-on 2) ke pembuatan obyek 3D, dalam hal ini adalah obyek kubus. Untuk dapat membuat sebuah kubus, kita membutuhkan definisi posisi dari titik-titik sudut kubus berikut dengan warna masing-masing sisinya. Ada 8 titik sudut kubus yang perlu kita definisikan posisinya di aplikasi JavaScript. Kita akan buat kubus ini berukuran 1 unit baik dari segi lebar, tinggi, dan panjangnya.

```JavaScript
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
```

![https://i.pinimg.com/originals/f9/51/cf/f951cfd3baaf74282dfb67ae5a810f8f.gif]
(https://i.pinimg.com/originals/f9/51/cf/f951cfd3baaf74282dfb67ae5a810f8f.gif)

Warna-warna yang akan kita aplikasikan pada kubus kali ini akan kita sesuaikan dengan warna kubus yang sering kita lihat dari kubus rubik, yakni: merah, hijau, biru, putih, oranye, dan kuning. Definisi warna pada JavaScript cukup disematkan pada indeks 1-6 (indeks 0 dan 7 sengaja kita kosongkan). Alasannya akan dijelaskan pada paragraf berikutnya.

```JavaScript
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
```

Agar keenam sisi kubus bisa mendapatkan warna yang berbeda-beda, maka satu titik sudut kubus tidak cukup hanya didefinisikan sebagai sebuah verteks. Alih-alih, kita membutuhkan 3 definisi verteks terpisah untuk satu buah titik sudut agar dari satu titik sudut ini bisa mengakomodasi tiga sisi dengan warna yang berbeda untuk masing-masingnya. Untuk membantu proses pendefinisian verteks ini kita akan membuat fungsi `quad`. Fungsi ini akan mengolah kedelapan titik sudut untuk didistribusikan sebagai 36 buah verteks (dalam array `vertices`) yang akan memuat atribut posisi `cubePoints` dan warna `cubeColors`. Fungsi ini akan dipanggil 6 kali, yakni sebanyak jumlah sisi kubus.

```JavaScript
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
```

Jangan lupa sebagai langkah akhir (di bagian proses di CPU) untuk menyambungkan variabel warna di JavaScript dengan variabel warna di _shader_ agar _pointer_ terhadap _vertex buffer object_ tereksekusi dengan tepat.

```JavaScript
var color = gl.getAttribLocation(shaderProgram, "aColor");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(color);
```

Untuk proses penggambaran verteks-nya, kita akan menggunakan `gl.TRIANGLES` dengan jumlah verteks total sebanyak 36.

```JavaScript
gl.drawArrays(gl.TRIANGLES, 0, 36);
```

## Proses di GPU (Shader)
### Vertex Shader

Oleh karena kita perlu menambahkan atribut warna ke dalam verteks, maka kita perlu menambahkan variabel baru di _shader_ untuk mengakomodasi ini. Pada awalnya, variabel `aColor` dibuat dengan _qualifier `attribute`_ yang berarti akan menangkap nilai dari CPU (JavaScript) untuk kemudian ditransfer ke _fragment shader_ melalui variabel `vColor` yang dibuat dengan _qualifier `varying`_. Variabel **warna** ini bertipedatakan `vec3`sebagaimana variabel posisi. Hanya saja 3 elemen yang dicakup bukan ~xyz~ tapi **rgb**.

```GLSL
attribute vec3 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
void main(void) {
    vColor = aColor;
    gl_Position = vec4(aPosition, 1.0);
}
```

### Fragment Shader

Variabel `vColor` yang dideklarasikan di _vertex shader_ akan ditangkap oleh variabel `vColor` (juga `varying`) yang ada di _fragment shader_. Pada akhirnya, `vColor` akan menyusun 3 elemen awal dari `gl_FragColor`.

```GLSL
precision mediump float;
varying vec3 vColor;
void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
}
```
