export class IDBPromise {

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