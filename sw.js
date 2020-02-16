var CACHE_NAME = 'site-cache-v1';
var urlsToCache = [
    '/',
    '/styles/main.css',
    '/script/main.js'
];

// Installation of the serviceWorker (cache urls above)
self.addEventListener('install', function(event) {
    // open cache, cache files, and confirm
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then( function(cache) {
                console.log('Opened Cache.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch handler
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request) 
            .then(function(response) {
                // cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

