import axios from 'axios';
import { useState, useEffect } from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';


export function Home() {
  const [output, setOutput] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {



    // window.electron.runShellCommand("docker run -it --gpus=all --rm -p 8081:8081 sorokine/docker-colab-local")
    const  extractCid = (text:string) => {
      // Use a regular expression to find the IPFS link and extract the CID
      const regex = /https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/;
      const match = text.match(regex);

      // If a match is found, return the CID, otherwise return null
      return match ? match[1] : null;
  }
    window.electron.onShellCommandResponse((data: string,d:any) => {
      //  console.log("CID", extractCid(d));
       const cid = extractCid(d);
       if(cid !=null){
        console.log("CID",cid);
        copyFile(cid);
        //setOutput((prevOutput) => [...prevOutput, extractCid(d)]);
       }
      // setOutput((prevOutput) => [...prevOutput, d]);
    });
  }, []);

  const pin = async (cid:string) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/v0/pin/add', null, {
        params: {
          recursive: true,
          stream: true,
          arg: cid
        }
      });
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error pinning:', error);
    }
  };

  const copyFile = async (cid:string) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/v0/files/cp', null, {
        params: {
          arg: ['/ipfs/'+cid, '/' + cid]
        }
        ,
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat', encode: true });
        }
      });
      pin(cid);
      navigate("/ipfs/#"+cid);
      console.log(response.data);
    } catch (error) {
      console.error('Error copying file:', error);
    }
  };
  //http://127.0.0.1:5001/api/v0/files/cp?arg=%2Fipfs%2FQmWnrw31zabUQPU1bbyR28Do8Q5xsjZb2uDbu1KyXAwMEk&arg=%2FQmWnrw31zabUQPU1bbyR28Do8Q5xsjZb2uDbu1KyXAwMEk
  //http://127.0.0.1:5001/api/v0/files/cp?arg=/ipfs/QmWnrw31zabUQPU1bbyR28Do8Q5xsjZb2uDbu1KyXAwMEk&arg=/QmWnrw31zabUQPU1bbyR28Do8Q5xsjZb2uDbu1KyXAwMEk
  const clone = () => {
    setOutput([]); // Clear previous output
    window.electron.runShellCommand('Alpine run ./install.txt'); // Example command
    // window.electron.runShellCommand('wsl -d Alpine pwd');
    // window.electron.onShellCommandResponse((event, response) => {
      // alert(response);
    // });
  };
  // --query-gpu=name --format=csv,noheader
  const run = () => {
    setOutput([]); // Clear previous output
    setLoading(true);
    const command = "export WEB3_PRIVATE_KEY=b3994e7660abe5f65f729bb64163c6cd6b7d0b1a8c67881a7346e3e8c7f026f5;"+
                    "cd ~/lilypad;"+
                    "go run . --network dev run github.com/arsenum/GPU:test6"
                    //"go run . --network dev run github.com/lilypad-tech/lilypad-module-lilysay:0.1.0 -i Message='Hello my cow!!!"+ Math.random() +"'";
    window.electron.runShellCommand('Alpine run  '+ command); // Example command


    //http://127.0.0.1:5001/ipfs/bafybeifeqt7mvxaniphyu2i3qhovjaf3sayooxbh5enfdqtiehxjv2ldte/#/files/QmP7RXgBLBm5FQf7FvGnoyXJh2gbnvstsmbwRBrmXjtr3n
    // window.electron.runShellCommand('wsl -d Alpine pwd');
    // window.electron.onShellCommandResponse((event, response) => {
      // alert(response);
    // });
  };
  return (
    <div>

      <h1>Run!</h1>
      <p>Module</p>
      <button onClick={run}>Run GPU Test </button> {loading ? (
        <TailSpin
          height="45"
          width="45"
          color="#00BFFF"
          ariaLabel="loading"

        />
      ):null}
      {/* <button onClick={pin}>Pin</button>
      <button onClick={()=>copyFile("QmWnrw31zabUQPU1bbyR28Do8Q5xsjZb2uDbu1KyXAwMEk")}>copyFile</button> */}

      {/* //http://127.0.0.1:5001/api/v0/pin/add?recursive=true&stream=true&arg=QmRurcQDCuVHX7yTAzzfdBGE1zhPMzvtEGHgVQtmMnK7W4 */}
      {/* <button onClick={()=> window.electron.runShellCommand('Alpine run ipfs daemon')}>IPFS Daemon</button>
      <button onClick={clone}>Init</button>

      <button onClick={()=> window.electron.runShellCommand('docker run --gpus=all --rm -p 8081:8081 sorokine/docker-colab-local:latest')}>Notebook</button>
      <button onClick={()=> window.electron.runShellCommand('docker run --gpus=all --rm -p 3965:3000 elestio/flowiseai')}>Flow</button> */}


      <pre>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </pre>
    </div>
  );
}
