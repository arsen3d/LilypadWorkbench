import axios from 'axios';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { create } from 'ipfs-http-client';
import Modal from 'react-modal';
export function Home() {
  const [output, setOutput] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [droppedFiles, setDroppedFiles] = useState<FileList | null>(null);
  //const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [cid, setCid] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [cidResult, setCidResult] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState('dev');
  const [selectedWallet, setSelectedWallet] = useState('b3994e7660abe5f65f729bb64163c6cd6b7d0b1a8c67881a7346e3e8c7f026f5');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');

  const ipfs = create({ url: 'http://localhost:5001' });

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
  setOptions(response.data);
}

  useEffect(() => {
    getAllLilypad();
    const extractCid = (text: string) => {
      const regex = /https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/;
      const match = text.match(regex);
      return match ? match[1] : null;
    };
/* */
    window.electron.onShellCommandResponse((data: string, d: any) => {

      if(d.indexOf("https://ipfs.io/ipfs") !== -1){
        setLoading(false);
        const cid = extractCid(d);
        if (cid != null) {
          setCidResult(cid);
          console.log("CID", cid);
          copyFile(cid, 'default-name');

          // navigate("/ipfs/#" + cid);
        }else{
          // alert("Job Failed");
        }
      }



    });

  }, []);
  const handleAddTextFile = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (textInput) {
      const blob = new Blob([textInput], { type: 'text/plain' });
      const file = new File([blob], "newFile.txt", { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      let files = dataTransfer.files;
      setDroppedFiles(files);

      // const files = event.dataTransfer.files;
      setDroppedFiles(files);

      // Handle the dropped files here
      for (const file of Array.from(files)) {
        try {
          const added = await ipfs.add(file.stream());
          console.log('Added file:', added);
          // Pass the file name to the copyFile function
          copyFile(added.cid.toString(), file.name);
          // Set the CID input value
          setCid(added.cid.toString());
        } catch (error) {
          console.error('Error adding file to IPFS:', error);
        }
      }


      setTextInput('');
      setIsModalOpen(false);
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    setDroppedFiles(files);

    // Handle the dropped files here
    for (const file of Array.from(files)) {
      try {
        const added = await ipfs.add(file.stream());
        console.log('Added file:', added);
        // Pass the file name to the copyFile function
        copyFile(added.cid.toString(), file.name);
        // Set the CID input value
        setCid(added.cid.toString());
      } catch (error) {
        console.error('Error adding file to IPFS:', error);
      }
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setDroppedFiles(files);
      for (const file of Array.from(files)) {
        try {
          const added = await ipfs.add(file.stream());
          console.log('Added file:', added);
          copyFile(added.cid.toString(), file.name);
          setCid(added.cid.toString());
        } catch (error) {
          console.error('Error adding file to IPFS:', error);
        }
      }
    }
  };

  const pin = async (cid: string) => {
    try {
      const response = await axios.post('http://localhost:5001/api/v0/pin/add', null, {
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

  const copyFile = async (cid: string, fileName: string) => {
    try {
      const response = await axios.post('http://localhost:5001/api/v0/files/cp', null, {
        params: {
          arg: ['/ipfs/' + cid, '/' + fileName]
        },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat', encode: true });
        }
      });
      pin(cid);

      console.log(response.data);
    } catch (error) {
      console.error('Error copying file:', error);
    }
  };

  const clone = () => {
    setOutput([]); // Clear previous output
    window.electron.runShellCommand('Alpine run ./install.txt'); // Example command
  };

  const run = () => {
    setOutput([]); // Clear previous output
    setLoading(true);
    // const command = "export WEB3_PRIVATE_KEY=b3994e7660abe5f65f729bb64163c6cd6b7d0b1a8c67881a7346e3e8c7f026f5;" +
    const command = "source ~/.profile;  export WEB3_PRIVATE_KEY=" + selectedWallet + //d03723153abb475a44ed4957226526cd18bdcb94acae5aa37b5ca03aad6e5546;" +
    "; cd ~/lilypad" +
      "; go run . --network  "+selectedNetwork+" run "+
      selectedTest
      // "github.com/Lilypad-Tech/lilypad-module-cowsay:v0.0.4"
      // "github.com/arsenum/GPU:test6";
    console.log(command);
    window.electron.runShellCommand('wsl -d alpine  sh -c " ' + command  +'"'); // Example command
    // window.electron.runShellCommandWithCallback('Alpine run  ' + command, async (data: string) => {  // Example command
    //   console.log("data: ", data);
    // });
  };

  return (
    <div>
      <h1>Run Model</h1>

      <Modal
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark overlay
        },

        content: {
        background:"black",
        width: '500px',
        height: '500px',
        margin: 'auto',
        padding: '20px',
      }}}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Text Input Modal"
      >
        <h2>Enter text for the new file</h2>
        <textarea
          style={{ width: '100%', height: '300px' }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <button onClick={handleModalSubmit}>Submit</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
      <select value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)}>
        <option value="b3994e7660abe5f65f729bb64163c6cd6b7d0b1a8c67881a7346e3e8c7f026f5">Dev  Wallet</option>
        <option value="d03723153abb475a44ed4957226526cd18bdcb94acae5aa37b5ca03aad6e5546">Testnet Wallet</option>
      </select>
      <select value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)}>
        <option value="dev">Dev</option>
        <option value="testnet">Testnet</option>
      </select>
      <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
         <option value="" disabled>Select a model</option>

         <option value="github.com/mavericb/lilypad-module-rick-morty-llama3-8b-finetuning:main" >github.com/mavericb/lilypad-module-rick-morty-llama3-8b-finetuning:main</option>
         <option value="github.com/Lilypad-Tech/lilypad-module-sdxl-pipeline:v1.0-base-lilypad3" >github.com/Lilypad-Tech/lilypad-module-sdxl-pipeline:v1.0-base-lilypad3</option>
         <option value="github.com/Lilypad-Tech/lilypad-module-sdxl-pipeline:main" >github.com/Lilypad-Tech/lilypad-module-sdxl-pipeline:main</option>
         <option value="github.com/arsenum/GPU:main" >github.com/arsenum/GPU:main</option>
         <option value="github.com/Lilypad-Tech/lilypad-module-sdxl:main" >github.com/Lilypad-Tech/lilypad-module-sdxl:main</option>
         <option value="github.com/Lilypad-Tech/lilypad-module-cowsay:main" >github.com/Lilypad-Tech/lilypad-module-cowsay:main</option>

        {/*<option value="github.com/arsenum/GPU:test6">github.com/arsenum/GPU:test6</option> */}
        {options.map((option, index) => (
        <option key={index} value={option.ModuleId.substring(8)+":"+option.Version}>{option.ModuleId.substring(8)}:{option.Version}</option>
        // <></>
        ))}
      </select>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleDivClick}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          margin: '20px',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {droppedFiles ? (
          <div>
            <h3>Dropped Files:</h3>
            <ul>
              {Array.from(droppedFiles).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Click or drag files here to upload</p>
        )}
      </div>

      <pre>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </pre>


      <button onClick={handleAddTextFile}>PROMT</button>
      <input
        type="text"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        placeholder="CID Input"
        style={{ margin: '20px', padding: '10px', width: '300px' }}
      />
      <button onClick={run}>Run</button>
      {loading ? (
        <div style={{ position: "fixed", left: "50%", top: "50%" }}>
          <TailSpin
            height="45"
            width="45"
            color="#00BFFF"
            ariaLabel="loading"
          />
        </div>
      ) : null}

      <input
        type="text"
        value={cidResult}
        onChange={(e) => setCid(e.target.value)}
        placeholder="CID Result"
        style={{ margin: '20px', padding: '10px', width: '300px' }}
      />
    </div>
  );
}
