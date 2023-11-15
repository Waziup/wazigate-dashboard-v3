import { MoreVert,Router, SettingsTwoTone } from "@mui/icons-material";
import { Box,Breadcrumbs,Button,FormControl,Grid,  NativeSelect,  Typography } from "@mui/material";
import RowContainerBetween from "../components/RowContainerBetween";
import { Link, useLocation } from "react-router-dom";
import { ChangeEvent } from "react";
import { DEFAULT_COLORS } from "../constants";
export interface HTMLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    handleChange:(event: ChangeEvent<HTMLSelectElement>)=>void,
    title:string,
    conditions:string[] | number[], 
    value: string
    isDisabled?:boolean
    matches?:boolean
}
export const SelectElement = ({handleChange,title,conditions,isDisabled, value}:HTMLSelectProps)=>(
    <Box minWidth={120} mx={2}>
        <Typography  fontSize={12} color={DEFAULT_COLORS.secondary_black}>{title}</Typography>
        <FormControl disabled={isDisabled} fullWidth>
            <NativeSelect
                defaultValue={30}
                inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                }}
                sx={{fontWeight:'bold'}}
                value={value}
                onChange={handleChange}
            >
                {conditions.map((condition,index)=>(
                    <option key={index} value={condition}>{condition}</option>
                ))}
            </NativeSelect>
        </FormControl>
    </Box>
);
export default function DeviceSettings(){
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const {state} = useLocation();
    // const navigate = useNavigate()
    console.log(state);
    return(
        <Box mx={2} m={2}>
            <RowContainerBetween additionStyles={{mx:2}}>
                <Box>
                    <Typography fontWeight={700} color={'black'}>fdfd</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link style={{color:'black'}} state={{title:'Devices'}} color="inherit" to="/devices">
                                Devices
                            </Link>
                            
                            <Link
                                color="inherit"
                                state={{title:state.name}}
                                to={`/devices/${state.id}`}
                            >
                                {state.name?state.name.slice(0,10)+'...':''}
                            </Link>
                            <Typography color="text.primary">
                                Settings
                            </Typography>
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button  color="info" variant={'contained'}>
                    <SettingsTwoTone sx={{color:'#fff'}}/>
                    <Typography color={'#fff'}>Settings</Typography>
                </Button>
            </RowContainerBetween>
            <Grid m={2} container spacing={2}>
                <Grid bgcolor={'#fff'} item md={6} lg={4} xl={4} sm={8} xs={12}>
                    <RowContainerBetween>
                        <Box display={'flex'} my={1} alignItems={'center'}>
                            <Router sx={{ fontSize: 17, color:'#292F3F' }} />
                            <Typography fontWeight={500} fontSize={16} color={'#292F3F'}>LoRaWAN Settings</Typography>
                        </Box>
                        <MoreVert sx={{color:'black', fontSize:20}} />
                    </RowContainerBetween>
                    <Box>
                        <SelectElement title={'Application Type'} handleChange={()=>{}} conditions={['Tempeature','Level','Humidity']} value={'Temperature'} />
                        <SelectElement title={'Condition'} handleChange={()=>{}} conditions={['>','<','==']} value={'>'} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}