
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "bolepa";
var revision = '1';
var urlsToCache = [
    "img/icon.png",
    "img/avatar.jpg",
    "nav.html",
    "index.html",
    "match.html",
    "pages/home.html",
    "pages/about.html",
    "pages/contact.html",
    "pages/saved.html",
    "css/materialize.min.css",
    "js/materialize.min.js",
    "css/materialize.css",
    "js/materialize.js",
    "scripts.js",
    "js/idb.js",
    "js/db.js",
    "js/notif.js",
    "js/nav.js",
    "js/api.js",
    "manifest.json",
    "favicon.ico",
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
];

var urlObject = [];
urlsToCache.forEach(url => {
    urlObject.push({ url, revision });
});

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute(urlObject, {
    ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script',
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style',
    new workbox.strategies.CacheFirst({
        cacheName: 'css-cache',
    })
);
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            })
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    new RegExp('/match.html'),
    new workbox.strategies.CacheFirst({
        ignoreURLParametersMatching: [/.*/]
    })
);


workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message tanpa payload';
    }
    var options = {
        body: body,
        icon: '/img/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
