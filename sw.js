// TODOS:
// 
// 1. Allow credentials/authentication to be handled cleanly by the serviceWorker
// 2. Allow caching of pages that may change (1 way would be to change the serviceWorker and delete old caches on activate)
// 3. 



//var CACHE_NAME = 'site-cache-v1';
var PRECACHE = 'pages-cache-v1';
var RUNTIME = "runtime";
var urlsToCache = [
    '/index.html',
    '/styles/main.css',
    '/script/main.js'
];

// Installation of the serviceWorker (cache urls above)
self.addEventListener('install', event => {
    // open cache, cache files, and confirm
    event.waitUntil(
        caches.open(PRECACHE)
            .then( cache => {
                console.log('Opened Cache.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch handler (only predefined list is cached 'urlsToCache')
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request) 
            .then(cachedResponse => {
                // cache hit on PRECACHE - return cachedResponse
                if (cachedResponse) {
                    return cachedResponse;
                }

                // if cache miss - put the request in the RUNTIME cache
                return caches.open(RUNTIME).then( cache => {
                    return fetch(event.request).then( response => {
                        return cache.put(event.request, response.clone()).then( () => {
                            return response;
                        });
                    });
                });
            })
    );
});

// Activate handler to capture changes to the serviceWorker
self.addEventListener('activate', function(event) {
    const current_caches = [PRECACHE, RUNTIME];

    // clear caches on activate
    event.waitUntil(
        caches.keys().then( cacheNames => {
           return cacheNames.filter( cacheName => !current_caches.includes(cacheName));
        }).then( cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then( () => self.clients.claim() )
    );
});