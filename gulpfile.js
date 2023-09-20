const { src, dest, watch, parallel } = require("gulp");     //compilar gulp


//CSS
const sass = require("gulp-sass")(require("sass"));         //compilar archivos sass a css
const plumber = require("gulp-plumber");                    //ejecutar pese a errores
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

//IMG
const cache = require("gulp-cache");                        //chace de imagenes
const imagemin = require("gulp-imagemin");                  //aligerar img
const webp = require("gulp-webp");                          //convertir img a webp
const avif = require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');

//JAVASCRIPT
const terser = require('gulp-terser-js');


// Funciones

//Compilar archivos de estilo SASS a CSS npx gulp css
function css(cb) {
    src('src/scss/**/*.scss')       //Identifica el archivo SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())            //Evita que se detenga el watch en caso de errores
        .pipe(sass())               //Lo compila
        .pipe(postcss( [autoprefixer(), cssnano() ] ))  //Comprimir codigo
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))    //Lo almacena en el Disco
    cb();
}

//Aligerar imagenes
function imagen (cb) {
    const opciones = {
        optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones) ))
        .pipe(dest('build/img') )
    cb();
}

//Convertir archivos de imagenes a webp
function vwebp(cb) {
    const opciones = {              // Especifica la calidad
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')   // Ubica los archivos
        .pipe(webp(opciones))       // Ejecuta la conversion
        .pipe(dest('build/img'))    // Almace en disco
    cb();
}

//Convertir archivos de imagenes a avif
function vavif(cb) {
    const opciones = {              // Especifica la calidad
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')   // Ubica los archivos
        .pipe(avif(opciones))       // Ejecuta la conversion
        .pipe(dest('build/img'))    // Almace en disco
    cb();
}

//Javascript  npx gulp js
function javascript(cb) {           // Llevar los archivos desde src/js a build/js
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())             // Comprimir codigo
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))
    cb();
}

//Ordenar al compilador mantenerse a la escucha de cambios *.scss
function dev(cb) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    cb();
}


//Exports

exports.css =       css;
exports.js =        javascript;
exports.imagen =    imagen;
exports.vwebp =     vwebp;
exports.vavif =     vavif;
//Series: ejecuta tareas en forma secuencial
//Parallel: ejecuta tareas en forma paralela
exports.dev = parallel(imagen, vwebp, vavif, javascript, dev);