import { useState, useEffect } from 'react';
import './Ipfs.css';
import { useLocation } from 'react-router-dom';
export function Code() {
  const [output, setOutput] = useState<string[]>([]);
  const location = useLocation();
  // useEffect(() => {
  //   window.electron.onShellCommandResponse((data: string,d:any) => {
  //      console.log(d);
  //     // setOutput((prevOutput) => [...prevOutput, d]);
  //   });
  // }, []);
  const clone = () => {
    setOutput([]); // Clear previous output
    window.electron.runShellCommand('Alpine run ./install.txt'); // Example command
    // window.electron.runShellCommand('wsl -d Alpine pwd');
    // window.electron.onShellCommandResponse((event, response) => {
      // alert(response);
    // });
  };
  const run = () => {
    setOutput([]); // Clear previous output
    window.electron.runShellCommand('Alpine run sh run.txt'); // Example command
    // window.electron.runShellCommand('wsl -d Alpine pwd');
    // window.electron.onShellCommandResponse((event, response) => {
      // alert(response);
    // });
  };
  return (
<div  id="myIframe" style={{width: "100%", height: "calc(100% - 65px)", position: "fixed", top: "0px"}}>
<iframe
allow="clipboard-read; clipboard-write"
src={"http://localhost:8443/?folder=/shared/"+location.hash.substring(1) +''} style={{border:0,width:"100%",height:"100%"}} ></iframe>
      {/* <h1>Run</h1>
      <p>Module</p>

      <button onClick={()=> window.electron.runShellCommand('Alpine run ipfs daemon')}>IPFS Daemon</button>
      <button onClick={clone}>Install</button>
      <button onClick={run}>Run Cowsay</button>
      <button onClick={run}>Resource Provider</button>
      <pre>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </pre> */}
    </div>
  );
}
