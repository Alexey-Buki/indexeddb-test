import React, {useState, useEffect} from 'react';
import {putFile, getFiles, deleteDb, removeFile} from './indexedDbStorage';
import './App.css';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function App() {
  const [files, setFiles] = useState([]);
  const [attempts, setAttemprs] = useState(0);
  const [lastFile, setLastFile] = useState(null);
  const [storageInfo, setStorageInfo] = useState({});

  useEffect( () => {
    Promise.resolve().then( () => {
      return Promise.all([
        navigator.storage.persist(),
        navigator.storage.persisted(),
        navigator.storage.estimate()
      ])
    }).then(([persist, persisted, info]) => {
      setStorageInfo({persist, persisted, ...info});
    }).catch(console.error)
  }, [files]);

  useEffect( () => {
    getFiles().then(function (files) {
      setFiles(files);
    });
  }, [])

  async function handleFile(event) {
    const file = event.target.files[0];
    try {
      if (file) {
        await putFile(file);
        setFiles(await getFiles());
        setLastFile(file);
      }
    } catch(error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleFiles() {
    try {
      if (lastFile) {
        for (let i = 0; i < attempts; ++i) {
          await putFile(lastFile);
        }
        setFiles(await getFiles());
      }
    } catch(error) {
      console.error(error);
      alert(error);
    }
  }

  async function handlerClear() {
    try {
      await deleteDb();
      setFiles(await getFiles());
    } catch(error) {
      console.error(error);
    }
  }

  async function removeItem(id, event) {

    try {
      event.preventDefault();
      await removeFile(id);
      setFiles(await getFiles());
    } catch(error) {
      console.error(error);
    }
  }

  const details = Object.keys(storageInfo.usageDetails || {}).map(function (key) {
    return <li key={key}>{key}: {formatBytes(storageInfo.usageDetails[key])}</li>
  })

  return (
    <div className="App">
      <div className="item">
        <ul>
          <li>persist: {String(storageInfo.persist)}</li>
          <li>persisted: {String(storageInfo.persisted)}</li>
          <li>quota: {formatBytes(storageInfo.quota)}</li>
          <li>usege: {formatBytes(storageInfo.usage)}</li>
          <li>usege: <ol>{details}</ol></li>
        </ul>
      </div>
      <div className="item">
        <div><button type="button" onClick={handlerClear}>Clear</button></div>
        <div>
          <label>Input file: </label>
          <input type="file" onChange={handleFile} />
        </div>
        <div>
          <label>Input file: </label>
          <input type="text" value={attempts} onChange={(event) => {setAttemprs(event.target.value)}} />
          <button type="button" onClick={handleFiles}>Save</button>
        </div>
        <div>
          <h2>Count {files.length}</h2>
          <ul>
            {files.map((file) => {
              return <li key={file.id}>{file.name} <a href="#" onClick={removeItem.bind(null, file.id)} key={file.id}>Remove</a></li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
