import IDBFactoryPromise, {IDBPromise} from './index.js';
// const {IDBFactoryPromise, IDBPromise} = require('./index.js');
// const expect = require('expect');

describe('Create database', () => {
  const testDbName = 'test_db';
  const testDbVersion = 1;

  afterEach(async () => {
    // const databases = await indexedDB.databases();

    // databases.forEach(async (databaseInfo) => {
    //   indexedDB.deleteDatabase(databaseInfo.name);
    // })
  })

  it('version db cannot less than 1', async () => {
    try {
      await IDBFactoryPromise.open(testDbName, 0);
      throw new Error('here expected throw exception from opening db');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }

    try {
      await IDBFactoryPromise.open(testDbName, -1);
      throw new Error('here expected throw exception from opening db');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  })

  it('name db should be specified', async () => {
    try {
      await IDBFactoryPromise.open();
      throw new Error('here expected throw exception from opening db');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }

    try {
      await IDBFactoryPromise.open(undefined, testDbVersion);
      throw new Error('here expected throw exception from opening db');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  })

  it('Upgrade database', async () => {
    const db = await IDBFactoryPromise.open(testDbName, testDbVersion, {
      upgradeneeded: (db) => {}
    });

    expect(db).toBeInstanceOf(IDBPromise);
    expect(db.idbDatabase).toBeInstanceOf(IDBDatabase);
  })

})
