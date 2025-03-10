import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Typography,
} from '@mui/material';
import { UseGetAllLilypad } from 'queries/LilypadQueries';
import './LilypadList.css';
import axios, { all } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { readdirSync } from 'fs';

// eslint-disable-next-line import/prefer-default-export
export function LilypadList() {
  const [images, setImages] = useState<string[]>([]);
  const [data, setMods] = useState<any[]>([]);
  const [useIpfs, setUseIpfs] = useState<boolean>(false);


  // data = null
   var isLoading =null
  const getAllLilypad = async () => {
    const allLilypadURL = 'https://raw.githubusercontent.com/arsenum/module-allowlist/main/allowlist.json'
    const response = await axios.get(allLilypadURL);

    for (const module of response.data) {
      if(module.ModuleId.startsWith("http")){
        const moduleUrl = module.ModuleId.replace("github.com","raw.githubusercontent.com") + "/main/lilypad_module.json.tmpl"
        const responseModule = await axios.get(moduleUrl ,{ responseType: 'text' });
        try{
        const cleanedJsonString = responseModule.data.toString().match(/"Image":\s*"([^"]+)"/)[1];//.replace(/{{.*?}}/g, '');
        module.image = cleanedJsonString;
      }catch(e){
        console.log(e)
      }
    }

  }
  setMods(response.data);
  console.log("getAllLilypad",response.data);
  //return response.data;
}
  useEffect(() => {
    //window.electron.runShellCommand('docker images --format "\'{{.Repository}}:{{.Tag}}\'",');
    // window.electron.runShellCommandWithCallback('docker images --format """{{.Repository}}:{{.Tag}}""",', async (data: string) => {
      window.electron.runShellCommandWithCallback('docker images --format """{{.Repository}}""",', async (data: string) => {
      console.log("["+data+"\"\"]")
      console.log(JSON.parse("["+data+"\"\"]"));
      setImages(JSON.parse("["+data+"\"\"]"));
      getAllLilypad();
      //setMods(await getAllLilypad());
      // const mods =  async () =>{return await getAllLilypad()}
      //console.log("getAllLilypad",await getAllLilypad());
      }
    );

  }, []);


  // const { data, isLoading } = UseGetAllLilypad();

  if (isLoading) {
    return <div>loading...</div>;
  }
  const cache = () => {
    console.log(data);
    data?.map(async (module:any) => {
      if(module.ModuleId.startsWith("http")){
        const moduleUrl = module.ModuleId.replace("github.com","raw.githubusercontent.com") + "/main/lilypad_module.json.tmpl"
        const response = await axios.get(moduleUrl ,{ responseType: 'text' });
        try{
        const cleanedJsonString = response.data.toString().match(/"Image":\s*"([^"]+)"/)[1];//.replace(/{{.*?}}/g, '');
        module.image = cleanedJsonString;
        console.log(cleanedJsonString)
        if(useIpfs && module.Cid){
          window.electron.runShellCommand('ipfs get ' + module.Cid + '; docker load -i ' + module.Cid);
        }else{
          window.electron.runShellCommand('docker pull ' + cleanedJsonString);
        }


      }
      catch(e){
        console.log(response.data.toString())
      }
        //console.log(cleanedJsonString)
        // try {
        //   console.log(JSON.parse(cleanedJsonString))
        // }catch(e){
        //   // console.log(e)
        //   console.log(cleanedJsonString)
        // }
        // console.log(JSON.parse(cleanedJsonString));
      }


      //console.log(module.ModuleId.replace("github.com","raw.githubusercontent.com") + "/main/lilypad_module.json.tmpl")
      //window.electron.runShellCommand('Alpine run ' + module.ModuleId)
    })
    // data?.map((module:any) => {
    //   //window.electron.runShellCommand('Alpine run ' + module.ModuleId)

  }
  const ipfsToggle = () => {
    setUseIpfs(!useIpfs);
  }
  return (
    <div className="module-list-container" style={{ overflowY: "auto" }}>
      <h1 className="page-title">Lilypad Modules</h1>
      {/* <div>
        <div>

        </div>
      </div> */}
      <div className="side-by-side-container">
        <div className="left-div">
          <h1 className="page-title">
            <label>
              <input
                type="checkbox"
                checked={useIpfs}
                onClick={(e) => setUseIpfs(e.target.checked)}
              />
              Pin to IPFS
            </label>
            <br />
            <button onClick={cache}>Save Docker Images</button>
          </h1>
          <div style={{ maxHeight: "calc(100vh - 650px)", overflowY: "auto" }}>
            <ul>
              {images.map((image, i) => (
                <li key={i}>
                  <Checkbox defaultChecked />
                  {image}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="center-div">
          <h1 className="page-title"><ModuleTypeList/></h1>
          < ListDirectories />
        </div>
        <div className="right-div">
          <h1 className="page-title">
            <label>
              <input
                type="checkbox"
                checked={useIpfs}
                onClick={(e) => setUseIpfs(e.target.checked)}
              />
              Use IPFS
            </label>
            <br />
            <button onClick={getAllLilypad}>Load Allow List Modules</button><input type="text" value="https://raw.githubusercontent.com/arsenum/module-allowlist/main/allowlist.json" placeholder="Allow List URL" />
          </h1>
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <ul>
              {data?.map((module: any, i: number) => (
                <li key={i}>
                  {images.includes(module?.image?.split(":")[0]) || images.includes(module?.ModuleId.substring(8)?.split(":")[0]) ? (
                    <Checkbox defaultChecked />
                  ) : (
                    <Checkbox />
                  )}
                  {module.ModuleId} ({module?.image})
                </li>
              ))}
            </ul>
            <button onClick={cache}>Cache Allow List Modules</button>
          </div>
        </div>
      </div>
      <br />
      <div style={{ alignContent: "center" }}>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
function ModuleTypeList() {
  const [moduleName, setModuleName] = useState('');
  const [moduleType, setModuleType] = useState('code');
  const navigate = useNavigate();
  return (
    // <div className="module-list-container" style={{ overflowY: "auto" }}>
    //   <h1 className="page-title">Lilypad Modules</h1>
    //   <div>
        <div>
          <input
            type="text"
            placeholder='Module Name'
            id="moduleName"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />
          <select
            id="moduleType"
            value={moduleType}
            onChange={(e) => setModuleType(e.target.value)}
          >
            <option value="code">Code</option>
            <option value="notebook">Notebook</option>
            <option value="media">Media</option>
            <option value="gradio">Gradio</option>
            <option value="agent">Agent</option>
          </select>
          <br />
          <button onClick={async () => {
              console.log(await window.electron.getAppPath() )
              const appPath = await window.electron.getAppPath()
              const command = 'xcopy ' + appPath + '\\module_template\\'+ moduleType + ' ' +appPath +'\\shared\\'+moduleType+'\\'+moduleName+'_module /E /I';
              console.log(command)
               window.electron.runShellCommandWithCallback(command, async (data: string) => {
                window.electron.runShellCommand("echo "+moduleName+" > "+appPath+"\\shared\\"+moduleType+"\\"+moduleName+"_module\\module_name.txt");
                // console.log("["+data+"\"\"]")
                // console.log(JSON.parse("["+data+"\"\"]"));
                // setImages(JSON.parse("["+data+"\"\"]"));
                // setMods(await getAllLilypad());
                // const mods =  async () =>{return await getAllLilypad()}
                //console.log("getAllLilypad",await getAllLilypad());
                })
            //images/docker-code-server
            console.log("Module Name:", moduleName);
            console.log("Module Type:", moduleType);
            switch(moduleType){
              case "code":
                navigate("/code/#"+moduleType+'/'+moduleName +  "_module");
              break;
              case "notebook":
                navigate("/notebook/#"+moduleType+'/'+moduleName +  "_module");
                break
              break;
              case "media":
              case "gradio":
            }


          }}>Create Module</button>





        </div>
    //   </div>

    // </div>
  );
}
function ListDirectories() {
  const [code, setCodeFiles] = useState<string[]>([]);
  const [notebook, setNotebookFiles] = useState<string[]>([]);
  const [gradio, setGradioFiles] = useState<string[]>([]);
  // const [code, setCodeFiles] = useState<string[]>([]);
  const navigate = useNavigate();
  // const directories = readdirSync('/path/to/directory');
  useEffect(() => {
    const fetchDirectoryFiles = async () => {
      // const files = await window.electron.readDirectory('shared/code');
      setCodeFiles( await window.electron.readDirectory('shared/code'));
      setNotebookFiles( await window.electron.readDirectory('shared/notebook'));
      setGradioFiles( await window.electron.readDirectory('shared/gradio'));
    };

    fetchDirectoryFiles();
  }, []);
//  navigate("/code/#"+moduleType+'/'+moduleName +  "_module");
  return (
    <div>
      {/* <h2>List of Directories:</h2> */}
      <h3>Code</h3>
      <ul>
        {code.map((name, index) => (
          <li onClick={()=>navigate("/code/#code/"+name)} key={index}>{name}</li>
        ))}
      </ul>
      <h3>Notebook</h3>
      <ul>
        {notebook.map((name, index) => (
          <li onClick={()=>navigate("/notebook/#notebook/"+name)} key={index}>{name}</li>
        ))}
      </ul>
      <h3>Gradio</h3>
      <ul>
        {gradio.map((name, index) => (
            <li onClick={()=>navigate("/gradio/#gradio/"+name)} key={index}>{name}</li>
        ))}
      </ul>
      <button>Publish Allow List</button>
    </div>
  );
}
