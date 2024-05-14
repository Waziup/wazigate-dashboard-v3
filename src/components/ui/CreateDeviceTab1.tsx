import { Box, FormControl, Typography, Radio, InputLabel, MenuItem, Select, SelectChangeEvent, } from "@mui/material"
import { Device } from "waziup";
export const DropDownCreateDeviceTab1 = ({handleChangeSelect,options,value}:{ handleChangeSelect:(e:SelectChangeEvent<string>)=>void,  options:{id:string,name:string,imageurl:string}[], value: string})=>(
    <FormControl variant="standard" sx={{p:0,mt:2, border:'none', width: '100%', }}>
        <InputLabel id="demo-simple-select-helper-labe/l">Select board Type</InputLabel>
        <Select sx={{width:'100%',py:0,border:'none'}} labelId="demo-simple-select-helper-label"
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
                                <Box component={'img'} sx={{width:20,mx:1, height:20}} src={op.imageurl} />
                                <Typography fontSize={14} color={'#325460'} >{op.name}</Typography>
                            </Box>
                            <Radio
                                checked={value===op.id}
                                // onChange={handleChangeSelect}
                                value={op.id}
                                size='small'
                                sx={{color:'primary.main',fontSize:20}}
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </MenuItem>
                    ))
                }
        </Select>
        
    </FormControl>
);
import WaziDevIcon from './wazidev.svg';
import WaziActIcon from './WaziAct.svg';
export default function CreateDeviceTab1({handleChange,newDevice,handleChangeSelect,}:{newDevice:Device,blockOnClick:(va:string)=>void,handleChange:(event: React.ChangeEvent<HTMLInputElement>)=>void,handleChangeSelect:(event: SelectChangeEvent<string>)=>void}){
    return(
            <Box>
                <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid #292F3F'}}>
                    <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                    <input 
                        autoFocus 
                        onInput={handleChange} 
                        name="name" placeholder='Enter device name' 
                        value={newDevice.name}
                        required
                        style={{border:'none',width:'100%',padding:'6px 0', outline:'none'}}
                    />
                </FormControl>
                <DropDownCreateDeviceTab1 
                    value={newDevice.meta.type}
                    handleChangeSelect={handleChangeSelect}
                    options={[{name:'Wazidev Board',id:'wazidev', imageurl:WaziDevIcon},{id:'genericboard',name:'Generic board',imageurl:WaziActIcon}]} 
                />
                
            </Box>
        
    )
}