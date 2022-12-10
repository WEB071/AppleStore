

// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME  = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

// El limite de elementos que se pueden guardar en el cache dinamico
const CACHE_DYNAMIC_LIMIT = 50;

// limpiarCache
function limpiarCache( cacheName, numeroItems ) {


    caches.open( cacheName )
        .then( cache => {

            return cache.keys()
                .then( keys => {
                    
                    if ( keys.length > numeroItems ) {
                        cache.delete( keys[0] )
                            .then( limpiarCache(cacheName, numeroItems) );
                    }
                });

            
        });
}




self.addEventListener('install', e => {


    const cacheProm = caches.open( CACHE_STATIC_NAME )
        .then( cache => {

            return cache.addAll([
                // '/',
                '/index.html',
                '/css/style.css',
                '/img/manzana.png',
                '/js/app.js',
                '/pages/offline.html'
            ]);

        
        });

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
            .then( cache => cache.add('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css'));
    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );
});

// Borrar cache viejo
self.addEventListener('activate', e => {

   const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {

            if ( key !== CACHE_STATIC_NAME && key.includes('static') ) {
                return caches.delete(key);
            }
        });
        });
    e.waitUntil( );

});







// funcionalidad borrado de cache antiguo que se ejecuta en el proceso de activación del service worker

self.addEventListener('fetch', e => {

    // 2- Cache with Network Fallback
    const respuesta = caches.match( e.request )
        .then( res => {

            if ( res ) return res;

            // No existe el archivo
            // tengo que ir a la web

            console.log('No existe', e.request.url);

            return fetch( e.request ).then( newResp => {

                caches.open( CACHE_DYNAMIC_NAME )
                    .then( cache => {

                        cache.put( e.request, newResp );
                        limpiarCache( CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT );

                    });

                return newResp.clone();

            })
            .catch( err => {
                    // si no hay conexion a internet
                    if ( e.request.headers.get('accept').includes('text/html') ) {
                        return caches.match('/pages/offline.html');
                    }
            
            });

        });

    e.respondWith( respuesta );

});