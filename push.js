var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "<< PUBLIC KEY >>",
    "privateKey": " << PRIVATE KEY >>"
};


webPush.setVapidDetails(
    'mailto:asdas@mail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "<< END POINT >>",
    "keys": {
        "p256dh": "<< p256dh >>",
        "auth": "<< auth >>"
    }
};
var payload = 'Ini notifikasinya! Hehehe...!';
var options = {
    gcmAPIKey: '<< gcmAPIKEY >>',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);