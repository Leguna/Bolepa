var objectStoreName = "matches";
var dbPromised = idb.open("bolepa", 1, function (upgradeDb) {
    var matchesObjectStore = upgradeDb.createObjectStore("matches", { keyPath: "id" });
    var index = matchesObjectStore.createIndex("match_id", "match_id", { unique: true });
});
function checkIfExist(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction(objectStoreName, "readonly");
                var store = tx.objectStore(objectStoreName);
                return store.get(parseInt(id));
            })
            .then(function (data) {
                if (data != undefined) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
    });
}
function saveForLater(match) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction(objectStoreName, "readwrite");
            var store = tx.objectStore(objectStoreName);
            store.put(match);
            return tx.complete;
        })
        .then(function () {
            console.log("Match berhasil disimpan.");
            location.reload();
        });
}

function deleteSaved(id) {
    dbPromised
        .then(function (db) {

            var tx = db.transaction(objectStoreName, "readwrite");
            var store = tx.objectStore(objectStoreName);
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function () {
            console.log("Match berhasil didelete.");
            location.reload();
            // window.location.replace("/index.html#saved");
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction(objectStoreName, "readonly");
                var store = tx.objectStore(objectStoreName);
                return store.getAll();
            })
            .then(function (matches) {
                resolve(matches);
            });
    });
}
function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction(objectStoreName, "readonly");
                var store = tx.objectStore(objectStoreName);
                return store.get(parseInt(id));
            })
            .then(function (match) {
                resolve(match);
            });
    });
}
