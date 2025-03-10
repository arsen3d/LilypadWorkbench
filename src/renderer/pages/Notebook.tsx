import { useState, useEffect } from 'react';
import './Ipfs.css';
import { useLocation } from 'react-router-dom';
export function Notebook() {
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
{/* <iframe  sandbox="allow-forms allow-scripts allow-same-origin" src="http://127.0.0.1:8081/?token=6fcba4f1a310dae254ba593878dded9ec19f4880ee8f3bf9" style={{border:0,width:"100%",height:"100%"}} ></iframe> */}
<iframe  sandbox="allow-forms allow-scripts allow-same-origin" src={"http://localhost:8848/lab/tree/shared/"+location.hash.substring(1) +"?token=lilypad"} style={{border:0,width:"100%",height:"100%"}} ></iframe>
    </div>
  );
}
