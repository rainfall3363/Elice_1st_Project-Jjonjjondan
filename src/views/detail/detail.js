const dbReq = indexedDB.open('shopping', 1);
let db;
dbReq.addEventListener('success', function (event) {
  db = event.target.result;
});

dbReq.addEventListener('error', function (event) {
  const error = event.target.error;
  console.log('error', error.name);
});

dbReq.addEventListener('upgradeneeded', function (event) {
  db = event.target.result;
  let oldVersion = event.oldVersion;
  if (oldVersion < 1) {
    db.createObjectStore('order', {
      keyPath: 'id',
      autoIncrement: true,
    });
  }
});
