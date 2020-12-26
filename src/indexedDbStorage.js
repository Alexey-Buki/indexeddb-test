// const supportStabilityIndexedDb = !!window.indexedDB;
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// const notSupportIndexedbDb = !!indexedDB;
// const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const READ_WRITE = 'readwrite';
const READ_ONLY = 'readonly';

const objectStoreName = 'file_storage';

/**
 * @param {string} name 
 * @param {number} version 
 * @return {IDBDatabase}
 */
function connect(name, version) {

  return new Promise((resolve, reject) => {
    const DBOpenRequest = indexedDB.open(name, version);

    DBOpenRequest.addEventListener('blocked', (...args) => {
      console.warn('blobcked', args);
    });

    DBOpenRequest.addEventListener('error', (event) => {
      reject();
    });
    
    DBOpenRequest.addEventListener('success', (event) => {
      const db = DBOpenRequest.result;
      
      db.addEventListener('abort', (error) => {
        console.log('abort db', error);
      })

      db.addEventListener('error', (error) => {
        console.log('error db', error);
      })

      db.addEventListener('close', function (event) {
        console.error('close', event);
      })

      db.addEventListener('versionchange', function (event) {
        console.error('versionchange', event);
        db.close();
      })

      resolve(db);
    });

    DBOpenRequest.addEventListener('upgradeneeded', (event) => {
      var db = event.target.result;
    
      var objectStore = db.createObjectStore(objectStoreName, { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("id", "id");
    });
  })
}

/**
 * @param {IDBDatabase} db
 * @param {Blob} blob
 */
async function write(db, blob) {

  return new Promise(function (resolve, reject) {
    let id = null;
    console.log('start write transaction');
    const transaction = db.transaction([objectStoreName], READ_WRITE);

    transaction.addEventListener('abort', function (event) {
      console.error('an abort transaction write', event, transaction);
      reject(event);
    })

    transaction.addEventListener('error', function (event) {
      console.error('an error transaction write', event, transaction);
      reject(event);
    })

    transaction.addEventListener('complete', function (event) {
      console.log('complete transaction', event, transaction);
      resolve(id);
    })

    const objectStore = transaction.objectStore(objectStoreName);

    console.log('put file', blob);
    const objectStoreRequest = objectStore.put(blob);

    objectStoreRequest.addEventListener('success', function (event) {
      id = objectStoreRequest.result;
      console.log('id = ' + id);
      console.log('write: object store request success', event, objectStoreRequest, objectStore);
    })

    objectStoreRequest.addEventListener('error', function (event) {
      console.error('write: object store request error', event, objectStoreRequest, objectStore );
    })
  })
}

/**
 * @param {IDBDatabase} db
 * @param {number} id
 */
function read(db, id) {

  return new Promise(function (resolve, reject) {
    let file = null;
    debugger;
    console.log('start read transaction');
    const transaction = db.transaction([objectStoreName], READ_ONLY);

    transaction.addEventListener('abort', function (event) {
      console.error('an abort transaction read', event, transaction);
      reject(event);
    })

    transaction.addEventListener('error', function (event) {
      console.error('an error transaction read', event, transaction);
      reject(event);
    })

    transaction.addEventListener('complete', function (event) {
      console.log('complete read transaction', event, transaction);
      resolve(file);
    })

    const objectStore = transaction.objectStore(objectStoreName);
    
    console.log('get file', id);
    const objectStoreRequest = objectStore.get(id);

    objectStoreRequest.addEventListener('success', function (event) {
      file = objectStoreRequest.result;
      console.log('read: object store request success', event, objectStoreRequest, objectStore);
    })

    objectStoreRequest.addEventListener('error', function (event) {
      console.error('read: object store request error', event, objectStoreRequest, objectStore );
    })
  })
}

/**
 * @param {IDBDatabase} db
 */
function getAll(db) {
  return new Promise(function(resolve, reject) {
    let files = [];
    console.log('start read all transaction');
    const transaction = db.transaction([objectStoreName], READ_ONLY);

    transaction.addEventListener('abort', function (event) {
      console.error('an abort transaction read all', event, transaction);
      reject(event);
    })

    transaction.addEventListener('error', function (event) {
      console.error('an error transaction read all', event, transaction);
      reject(event);
    })

    transaction.addEventListener('complete', function (event) {
      console.log('complete read all transaction', event, transaction);
      resolve(files);
    })

    const objectStore = transaction.objectStore(objectStoreName);
    const storeGetAll = objectStore.getAll();

    storeGetAll.addEventListener('success', function (event) {
      console.log('request get all', event);
      files = storeGetAll.result;
    })

    storeGetAll.addEventListener('error', function (event) {
      console.error('error request get all', event);
      reject(event);
    })
  })
}

/**
 * @param {IDBDatabase} db
 * @param {number} id
 */
function remove(db, id) {
  return new Promise(function (resolve, reject) {
    console.log('start remove transaction');
    const transaction = db.transaction([objectStoreName], READ_WRITE);

    transaction.addEventListener('abort', function (event) {
      console.error('an abort transaction remove', event, transaction);
      reject(event);
    })

    transaction.addEventListener('error', function (event) {
      console.error('an error transaction remove', event, transaction);
      reject(event);
    })

    transaction.addEventListener('complete', function (event) {
      console.log('complete remove transaction', event, transaction);
      resolve(id);
    })

    const objectStore = transaction.objectStore(objectStoreName);
    const objectStoreRequest = objectStore.delete(id);

    objectStoreRequest.addEventListener('success', function (event) {
      id = objectStoreRequest.result;
      console.log('id = ' + id);
      console.log('remove: object store request success', event, objectStoreRequest, objectStore);
    })

    objectStoreRequest.addEventListener('error', function (event) {
      console.error('remove: object store request error', event, objectStoreRequest, objectStore );
    })
  })
}

const name = 'test';
const version = 1;

async function putFile(blob) {
  const db = await connect(name, version);
  const id = await write(db, blob);
  const readableBlob = await read(db, id);

  if (!(readableBlob instanceof Blob) || blob.size === 0) {
    throw new Error('can not save file');
  }
  return id;
}

async function getFile(id) {
  const db = await connect(name, version);
  const readableBlob = await read(db, id);

  if (!(readableBlob instanceof Blob) || readableBlob.size === 0) {
    throw new Error('can not read file');
  }
  return readableBlob;
}

async function getFiles() {
  const db = await connect(name, version);
  return getAll(db);
}

async function removeFile(id) {
  const db = await connect(name, version);
  return remove(db, id);
}

async function deleteDb() {
  const db = await connect(name, version);

  db.close();

  return new Promise(function (resolve, reject) {
    try {
      console.log('start remove db');
      const dbDeleteRequest = indexedDB.deleteDatabase(name);

      dbDeleteRequest.onblocked = (event) => {
        console.warn('blocked remove db:', event, dbDeleteRequest);
        // reject(event);
      };

      dbDeleteRequest.onerror = (event) => {
        console.error('error remove db:', event, dbDeleteRequest);
        reject(event);
      };

      dbDeleteRequest.onsuccess = (event) => {
        if (!dbDeleteRequest.result) {
          console.log('remove db:', event, dbDeleteRequest);
          return resolve(event);
        }
        console.error('went wrong', event, dbDeleteRequest);
        reject(event);
      };

    } catch(error) {
      console.error('error remove db', error);
      reject(error);
    }
  });
}

export {
  putFile,
  getFile,
  getFiles,
  deleteDb,
  removeFile
};