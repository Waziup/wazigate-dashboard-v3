import { Box,Typography } from '@mui/material';
import { getContainerLogs,dlContainerLogs, getAllContainers, cInfo } from '../../utils/systemapi';
import { useEffect, useState } from 'react';
import PrimaryIconButton from '../shared/PrimaryIconButton';
interface Props{
    matches?:boolean
}
export default function LogsTabMaintenance({matches}:Props) {
    console.log(matches);
    const [data, setData] = useState<string>('');
    const [sysContainer, setSysContainer] = useState<cInfo | undefined>(undefined);
    const loopLoad = async ()=> {
        if(sysContainer?.Id){
            try{
                const res = await getContainerLogs(sysContainer?.Id as string, 50);
                setData(res);
            }catch(err){
                setData('Error Encountered, could not fetch logs '+err);
            }
        }
    }
    useEffect(() => {
        const cc = async()=>{
            const systemContainer = await getAllContainers();
            const sysContainerF = systemContainer.find((c)=>c.Names[0].includes('wazigate-system'));
            setSysContainer(sysContainerF as cInfo);
            if(sysContainerF){
                const id = sysContainerF.Id;
                const res = await getContainerLogs(id, 50);
                setData(res);
            }
        }
        cc();
        const interval = setInterval(loopLoad,4000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const downloadLogs = async ()=>{
        dlContainerLogs(sysContainer?.Id as string).then(
            (res) => {
              res.blob().then((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
      
                const today = new Date();
                const fileName =
                  sysContainer?.Names[0] +
                  "_" +
                  today.getFullYear() +
                  "-" +
                  (today.getMonth() + 1) +
                  "-" +
                  today.getDate() +
                  "_" +
                  today.getHours() +
                  "-" +
                  today.getMinutes() +
                  "-" +
                  today.getSeconds() +
                  ".logs";
      
                a.download = fileName;
                a.click();
              });
              alert('Downloaded');
            },
            (error) => {
                alert('Error Encountered, could not fetch logs '+error);
            }
          );
    }
    return (
        <Box>
            <Box sx={{bgcolor:'white',boxShadow: 3,width:'90%',p:3,m:2,borderRadius:2,position:'relative',}}>
                <Typography fontSize={10}>
                    {data}
                </Typography>
            </Box>
            <PrimaryIconButton onClick={downloadLogs} iconname='download' title={'Download Logs'} />
        </Box>
    )
}
