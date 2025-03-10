import { useState, useEffect } from 'react';
import './Ipfs.css';
export function Gen() {
  const [output, setOutput] = useState<string[]>([]);

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
{/* <iframe  sandbox="allow-forms allow-scripts allow-same-origin" src="http://127.0.0.1:8081/?token=0aaea342ddfe7c12e9dae8a317b7653641421f2efc698f62" style={{border:0,width:"100%",height:"100%"}} ></iframe> */}
<iframe  sandbox="allow-forms allow-scripts allow-same-origin allow-modals" src="http://127.0.0.1:8188/" style={{border:0,width:"100%",height:"100%"}} ></iframe>
    </div>
  );
}
