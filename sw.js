//var CACHE_NAME = 'site-cache-v1';
var CACHE_NAME = 'pages-cache-v1';
var urlsToCache = [
    '/index.html',
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

// Fetch handler (only predefined list is cached 'urlsToCache')
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

// Activate handler to capture changes to the serviceWorker
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['pages-cache-v1'];

    // remove old caches for the change
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});