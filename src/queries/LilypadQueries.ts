import { useQuery } from '@tanstack/react-query';
import axios, { all } from 'axios';


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
  // const moduleUrl = module.ModuleId.replace("github.com","raw.githubusercontent.com") + "/main/lilypad_module.json.tmpl"
  // const responseModule = await axios.get(moduleUrl ,{ responseType: 'text' });
  // try{
  // const cleanedJsonString = response.data.toString().match(/"Image":\s*"([^"]+)"/)[1];//.replace(/{{.*?}}/g, '');
  // module.image = cleanedJsonString;

  return response.data;

};

export const UseGetAllLilypad = () => {
  const { isLoading, data } = useQuery(['allLilypad'], getAllLilypad);
  return { data, isLoading };
};
