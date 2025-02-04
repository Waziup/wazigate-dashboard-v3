import { Box, FormControl, Typography, InputLabel, MenuItem, Select, SelectChangeEvent, } from "@mui/material"
import { Device } from "waziup";
export const DropDownCreateDeviceTab1 = ({name,handleChangeSelect,title,options,mt,my,value}:{my?:number,mt?:number,name?:string, title?:string, handleChangeSelect:(e:SelectChangeEvent<string>)=>void,  options:{id:string,name:string}[], value: string})=>(
    <FormControl variant="standard" sx={{p:0,mt:mt??2,my:my??0, border:'none', width: '100%', }}>
        <InputLabel id="demo-simple-select-helper-labe/l">{title?title:'Select board Type'}</InputLabel>
        <Select name={name} sx={{width:'100%',py:0,border:'none'}} labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper" onClose={()=>{
                setTimeout(() => {
                    if (document?.activeElement) {
                        (document.activeElement as HTMLElement).blur();
                    }
                }, 0);
            }} value={value} label={'Cr'} required onChange={handleChangeSelect}>
                {
                    options.map((op,idx)=>(
                        <MenuItem key={idx} value={op.id} sx={{display:'flex',width:'100%', justifyContent:'space-between'}}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Typography fontSize={14} color={'#325460'} >{op.name}</Typography>
                                
                            </Box>
                            
                        </MenuItem>
                    ))
                }
        </Select>
    </FormControl>
);
export default function CreateDeviceTab1({handleChange,newDevice,handleChangeSelect,}:{newDevice:Device,blockOnClick:(va:string)=>void,handleChange:(event: React.ChangeEvent<HTMLInputElement>)=>void,handleChangeSelect:(event: SelectChangeEvent<string>)=>void}){
    return(
        <Box>
            <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #292F3F'}}>
                <Typography color={'#325460'} mb={.4} fontSize={14}>Device name</Typography>
                <input 
                    autoFocus 
                    onInput={handleChange} 
                    name="name" placeholder='Enter device name' 
                    value={newDevice.name}
                    required
                    style={{border:'none',width:'100%',fontSize:14,padding:'6px 0',color:'#325460', outline:'none'}}
                />
            </FormControl>
            <DropDownCreateDeviceTab1 
                value={newDevice.meta.type}
                handleChangeSelect={handleChangeSelect}
                options={[{name:'Wazidev Board',id:'WaziDev',},{id:'generic',name:'Generic board',}]} 
            />
            
        </Box>
    )
}