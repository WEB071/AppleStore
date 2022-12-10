var url = window.location.href;
var swLocation = '/AppleStore/sw.js';


// Confirmar si podemos usar Service Worker
if ( navigator.serviceWorker ) {

    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    navigator.serviceWorker.register( swLocation)
}


// Confirmar si podemos usar Cache Storage
if ( window.caches ) {
    // Limpiar el cache de la app
    caches.open('prueba-1');
    caches.open('prueba-2');

    // Agregar elementos al cache
    caches.has('prueba-1').then( cache => {

        // 
        cache.addAll([
            '/index.html',
            '/css/style.css',
            '/img/manzana.jpg',
            '/js/app.js'
            ]

        );
    });


}