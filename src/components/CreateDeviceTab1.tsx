import { Box, FormControl, Typography, Radio } from "@mui/material"
import RowContainerNormal from "./RowContainerNormal"
const deviceContainer={
    cursor:'pointer',
    width:'50%',
    height:250,
    mx:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    // border: '1px solid #499dff',
}
const deviceTypeImageDiv={
    borderRadius:2,
    // border: '1px solid #499dff',
    height:'90%', 
    width:'100%',
    component:'img',
    cursor:'pointer',
    // bgcolor: '#E5F1FF',
    // border: '1px solid #499dff',
    padding:2,
    mx:1,
    ":hover":{
        bgcolor: '#E5F1FF',
        borderRadius:2,
    },
}
export default function CreateDeviceTab1({blockOnClick,handleChange,deviceName,handleChangeSelect,selectedValue}:{deviceName:string,blockOnClick:(va:string)=>void,handleChange:(event: React.ChangeEvent<HTMLInputElement>)=>void,selectedValue:string,handleChangeSelect:(event: React.ChangeEvent<HTMLInputElement>)=>void}){
    return(
            <Box>
                <FormControl sx={{my:1,width:'100%', borderBottom:'1px solid black'}}>
                    <Typography color={'primary'} mb={.4} fontSize={12}>Device name</Typography>
                    <input autoFocus onInput={handleChange} name="name" placeholder='Enter device name' value={deviceName} style={{border:'none',width:'100%',padding:'6px 0', outline:'none'}}/>
                </FormControl>
                <RowContainerNormal>
                    <Box sx={deviceContainer}   onClick={()=>{blockOnClick('a')}}>
                        <Box borderRadius={selectedValue==='a'?2:0} border={selectedValue==='a'?'1px solid #499dff':''} bgcolor={selectedValue==='a'?'#E5F1FF':''} src='wazidev.svg' sx={deviceTypeImageDiv} component={'img'}/>
                        <Typography fontSize={13}>WaziDev</Typography>
                        <Radio
                            checked={selectedValue === 'a'}
                            onChange={handleChangeSelect}
                            value="a"
                            size='small'
                            sx={{color:'primary.main',fontSize:20}}
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                        />
                    </Box>
                    <Box sx={deviceContainer}  onClick={()=>{blockOnClick('b')}}>
                        <Box border={selectedValue==='b'?'1px solid #499dff':''} borderRadius={selectedValue==='b'?2:0} bgcolor={selectedValue==='b'?'#E5F1FF':''} src='/WaziAct.svg' sx={deviceTypeImageDiv} component={'img'}/>
                        <Typography fontSize={13}>WaziAct</Typography>
                        <Radio
                            checked={selectedValue === 'b'}
                            onChange={handleChangeSelect}
                            value="b"
                            size='small'
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'B' }}
                        />
                    </Box>
                </RowContainerNormal>
            </Box>
        
    )
}