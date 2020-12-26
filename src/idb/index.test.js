import IDBFactoryPromise, {IDBPromise} from './index.js';

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
      console.log(error);
    }
    
  })

  it('Upgrade database', async (done) => {
    // const db = await IDBFactoryPromise.open(testDbName, testDbVersion, {
    //   upgradeneeded: (db) => {
        
    //   }
    // });

    // expect(db).toBeInstanceOf(IDBPromise);
    // expect(db.originDb).toBeInstanceOf();
  })

})
