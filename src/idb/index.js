

/**
 * @param {Object} source 
 * @param {Object} destination 
 */
function proxyProperties(source, destination) {
  Object.keys(source).forEach((nameProperty) => {
    if (source.hasOwnProperty(nameProperty)) {
      Object.defineProperty(destination, nameProperty, {
        get () {
          return source[nameProperty];
        },

        set (value) {
          source[nameProperty] = value;
        }
      })
    }
  })
}

export class IDBPromise {

  /**
   * @type {IDBDatabase}
   */
  idbDatabase;

  /**
   * @param {idbDatabase} idbDatabase 
   */
  constructor(idbDatabase) {
    this.idbDatabase = idbDatabase;

    proxyProperties(idbDatabase, this);
  }

  transaction() {

  }

  createObjectStore() {

  }

  deleteObjectStore() {

  }

  close() {

  }
}

class IDBFactoryPromise {

  /**
   * @param {string} name 
   * @param {name} version 
   * @param {Object} callbacks
   */
  open(name, version, callbacks) {

    return new Promise((resolve, reject) => {

      try {
        const openRequest = window.indexedDB.open(name, version);

        openRequest.addEventListener('error', (event) => {
          reject();
        });

        openRequest.addEventListener('success', (event) => {
          const idbPromise = new IDBPromise(openRequest.result);
          resolve(idbPromise);
        });

        openRequest.addEventListener('upgradeneeded', function (event) {
          const idbPromise = new IDBPromise(openRequest.result);

          callbacks.upgradeneeded(idbPromise);
        });

        openRequest.addEventListener('blocked', function (event) {
          reject(new Error('blocked'));
        })

      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * @param {String} name
   * @returns {Promise}
   */
  deleteDatabase(name) {

  }

  /**
   * @returns {Promise}
   */
  databases() {

  }
}

export default new IDBFactoryPromise();