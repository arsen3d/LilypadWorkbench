import { useState, useEffect,useRef } from 'react';
import './Ipfs.css';
import { useLocation } from 'react-router-dom';
let content = 0;
export function Gradio() {
  const [output, setOutput] = useState<string[]>([]);
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const [content, setContent] = useState<number | null>(0);

  const url = 'http://127.0.0.1:7860/';
  const checkUrlAndReload = async  () => {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        // window.location.reload();
        // iframeRef.current.src = iframeRef.current.src;
        // clearInterval(intervalId);
        const newContent = await response.text();
        // console.log('newContent:', newContent.length);
        // console.log('prevContent:', content);
        if(content != newContent.length)
        {
          // console.log("why?");
          if (iframeRef.current) {
             iframeRef.current.src = iframeRef.current.src;
          }
        }
        content = newContent.length;

        // setContent((prevContent) => {
        //   if (newContent.length != prevContent){
        //     console.log('prevContent:', prevContent); {
        //     if (iframeRef.current) {
        //       // iframeRef.current.src = iframeRef.current.src;
        //     }
        //     return newContent.length;
        //   }
        //   } else {
        //     console.log('No new content:', prevContent);
        //     return prevContent;
        //   }
        // });

      }else{

      }
    } catch (error) {
      console.log("Updating ")
      // console.error('Error fetching the URL:', error);
    }
  };


  useEffect(() => {
    const intervalId = setInterval(checkUrlAndReload, 1000);
    // const command = 'cmd /c  C:\\Users\\arsen\\repos\\electron\\LilypadWorkbench\\shared\\gradio\\test2_module\\run.bat';
    window.electron.getAppPath().then((appPath) => {
      console.log('App Path:', appPath);
    // const command ='powershell docker run -it -d  --name=gradio     -v /var/run/docker.sock:/var/run/docker.sock  -v '+ appPath +'/shared/gradio/test2_module:/shared  -p 7860:7860 $(docker build -q -f C:\\Users\\arsen\\repos\\electron\\LilypadWorkbench\\shared\\gradio\\test2_module\\Dockerfile C:\\Users\\arsen\\repos\\electron\\LilypadWorkbench\\shared\\gradio\\test2_module)';
    const command ='powershell docker run -it  -d   --name=gradio --rm -v /var/run/docker.sock:/var/run/docker.sock  -v '+ appPath +'\\shared\\'+location.hash.substring(1).replace("/","\\")+':/shared  -p 7860:7860 $(docker build -q -f '+appPath +'\\shared\\'+location.hash.substring(1).replace("/","\\")+'\\Dockerfile '+appPath +'\\shared\\'+location.hash.substring(1).replace("/","\\")+')';
    //location.hash.substring(1)
    console.log(command);
    window.electron.runShellCommandWithCallback(command, async (data: string) => {
      console.log("data: ",data);

      // return () => clearInterval(intervalId);
      // if (iframeRef.current) {
      //   iframeRef.current.src = iframeRef.current.src;
      // }

      })
    })
    // window.electron.onShellCommandResponse((data: string,d:any) => {
    //    console.log(d);
    //   // setOutput((prevOutput) => [...prevOutput, d]);
    // });
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
<div  id="myIframe" style={{width: "100%", height: "calc(100% - 65px)", position: "fixed", top: "0px"}}>
{/* <iframe  sandbox="allow-forms allow-scripts allow-same-origin" src="http://127.0.0.1:8081/?token=6fcba4f1a310dae254ba593878dded9ec19f4880ee8f3bf9" style={{border:0,width:"100%",height:"100%"}} ></iframe> */}
<iframe
allow="clipboard-read; clipboard-write"
src={"http://127.0.0.1:8443/?folder=/shared/"+location.hash.substring(1) +''} style={{border:0,width:"50%",height:"100%"}} ></iframe>

<iframe
 ref={iframeRef}
sandbox="allow-forms allow-scripts allow-same-origin" src={"http://127.0.0.1:7860/"} style={{border:0,width:"50%",height:"100%"}} ></iframe>
    </div>
  );
}
