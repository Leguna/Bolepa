
// // Periksa service worker
// if (!('serviceWorker' in navigator)) {
//     console.log("Service worker tidak didukung browser ini.");
// } else {
//     registerServiceWorker()
//         .then(function (reg) {
//             reg.addEventListener('updatefound', () => {
//                 const newWorker = reg.installing;
//                 newWorker.addEventListener('statechange', () => {
//                     if (newWorker.state == "activated") {
//                         requestPermission();
//                         return reg;
//                     }
//                 });
//             });
//             if (reg.active)
//                 requestPermission();
//         })
// }

// Periksa service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('workbox.js')
            .then(function (reg) {
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state == "activated") {
                            requestPermission();
                            return reg;
                        }
                    });
                });
                if (reg.active)
                    requestPermission();
            })
    });
}
console.log("Halo :)");

// // Register service worker
// function registerServiceWorker() {
//     return navigator.serviceWorker.register('workbox.js')
//         .then(function (registration) {
//             console.log('Registrasi service worker berhasil.');
//             return registration;
//         })
//         .catch(function (err) {
//             console.error('Registrasi service worker gagal.', err);
//         });
// }

