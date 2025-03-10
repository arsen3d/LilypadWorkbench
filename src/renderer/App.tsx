import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, createTheme, CssBaseline } from '@mui/material';
import '@fontsource/open-sans';
import '@fontsource/open-sans/800.css';
import '@fontsource/open-sans/600.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { LilypadList } from './pages/LilypadList';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/system';
import { Ipfs } from './pages/Ipfs';
import { Notebook } from './pages/Notebook';
import { Code } from './pages/Code';
import { SiMyanimelist } from 'react-icons/si';
import icon from '../../assets/icon.svg';
import { Flow } from './pages/Flow';
import { Transactions } from './pages/Transactions';
import { Gen } from './pages/Gen';
import { Agent } from './pages/Agent';
import { Gradio } from './pages/Gradio';
import  Data  from './pages/Data';

const queryClient = new QueryClient();
window.lilypad = function (command) {
  //console.error('window.onerror', message, source, lineno, colno, error);
  console.log(command)
  window.electron.runShellCommand('Alpine run ' + command)
  return ""
}
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((previousMode) => !previousMode);
  };

  useEffect(() => {
    window.electron.getAppPath().then((appPath) => {
      console.log('App Path:', appPath);
      // window.electron.runShellCommand('docker run -d --name=colab --gpus=all --rm -p 8081:8081 sorokine/docker-colab-local:latest')
      // window.electron.runShellCommand('docker run -d --name=colab --gpus=all --rm -p 8081:8081 ghcr.io/sokrypton/colabfold:1.5.5-cuda11.8.0')
      //ghcr.io/sokrypton/colabfold:1.5.5-cuda11.8.0
      window.electron.runShellCommand('docker run -d --name=flow  --gpus=all --rm -p 3965:3000 elestio/flowiseai')
      window.electron.runShellCommand('docker run -d --name=code   --gpus=all  -v '+ appPath +'/shared:/shared -v /var/run/docker.sock:/var/run/docker.sock  --privileged -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8443:8443  --restart unless-stopped lscr.io/linuxserver/code-server:latest')
      window.electron.runShellCommand('docker run    --name=jupyter --gpus all -d -it  --rm -p 8848:8888 -v '+ appPath +'/shared:/home/jovyan/shared -e GRANT_SUDO=yes -e JUPYTER_TOKEN="lilypad" -e JUPYTER_ENABLE_LAB=yes --user root cschranz/gpu-jupyter:v1.7_cuda-12.2_ubuntu-22.04')
      // window.electron.runShellCommand('docker run    --name=jupyter --gpus all -d -it  --rm -p 8848:8888 -v '+ appPath +'/shared:/home/jovyan/shared -e GRANT_SUDO=yes -e JUPYTER_TOKEN="lilypad" -e JUPYTER_ENABLE_LAB=yes --user root ghcr.io/sokrypton/colabfold:1.5.5-cuda11.8.0')
      //ghcr.io/sokrypton/colabfold:1.5.5-cuda11.8.0

      //b5655dc0cee3bfa726e55d11324e48666db16c331d2cc171
      //4e297a3249c74d4d067df74a3e01a2dce2991ec8d78ae7c9
      // window.electron.runShellCommand('docker run -d --name=code-server -v /path/to/appdata/config:/config -v /var/run/docker.sock:/var/run/docker.sock --gpus=all --privileged -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8444:8080  --restart unless-stopped code:latest')

    });
    // window.electron.runShellCommand('Alpine run ipfs daemon')

    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode !== null) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <CssBaseline />

          <div className={isDarkMode ? 'gradient-dark' : 'gradient-light'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/module-list" element={<LilypadList />} />
              <Route path="/ipfs" element={<Ipfs />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/code" element={<Code />} />
              <Route path="/gen" element={<Gen />} />
              <Route path="/agent" element={<Agent />} />
              <Route path="/flow" element={<Flow />} />
              <Route path="/gradio" element={<Gradio/>} />
              <Route path="/data" element={<Data/>} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </div>
          <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
