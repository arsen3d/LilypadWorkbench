import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './Ipfs.css';
export function Ipfs() {
  const [output, setOutput] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
  //   window.electron.onShellCommandResponse((data: string,d:any) => {
  //      console.log(d);
  //     // setOutput((prevOutput) => [...prevOutput, d]);
  //   });
  const removeDivFromIframe = (iframeId, divSelector) => {
    const iframe = document.getElementById(iframeId);
    iframe.onload = () => {
      alert('iframe loaded');
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const divElement = iframeDocument.querySelector(divSelector);
      if (divElement) {
        divElement.parentNode.removeChild(divElement);
      }
    };
  };
  //

  // Example usage
  removeDivFromIframe('myIframe', '#root');
  }, []);
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
    //sandbox="allow-same-origin allow-scripts"
<div  id="myIframe" style={{width: "100%", background:"white", height: "calc(100% - 65px)", position: "fixed", top: "0px"}}>
  <iframe
   sandbox="allow-scripts allow-same-origin"
    // onLoad={(o) => {
    //   console.log(o);
    //   const iframe = o.target;
    //   const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    //   const divElement = iframeDocument.querySelector('#root');
    //   if (divElement) {
    //     divElement.parentNode.removeChild(divElement);
    //   }
    // }}

  src={"http://localhost:3000/#/files/"+location.hash.substring(1)} style={{border:0,width:"100%",height:"calc(100vh)"}} ></iframe>
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
