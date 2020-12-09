import React, {useState, useEffect} from 'react';
import {putFile, getFiles} from './indexedDbStorage';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);

  useEffect( () => {
    getFiles().then(function (files) {
      setFiles(files);
    });
  }, [])

  async function handleFile(event) {
    const file = event.target.files[0];
    try {
      await putFile(file);
      setFiles(await getFiles());
    } catch(error) {
      console.error(error);
    }
  }

  console.log(files);

  return (
    <div className="App">
      <div>
        <ul>
          {files.map((file) => {
            return <li key={file.id}>{file.name}</li>
          })}
        </ul>
      </div>
      <div>
        <label>Input file: </label>
        <input type="file" onChange={handleFile} />
      </div>
    </div>
  );
}

export default App;
