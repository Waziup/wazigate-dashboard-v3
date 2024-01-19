import { Box, SelectChangeEvent } from '@mui/material';
import ontologies from '../../assets/ontologies.json';
import SelectElementString from '../shared/SelectElementString';
import React from 'react';
interface Props{
    newSensOrAct: {name:string,type:string,quantity:string,unit?:string},
    handleSelectChange:(event: SelectChangeEvent<string>)=>void
}
export default function CreateSensorModal({newSensOrAct,handleSelectChange}:Props) {
    const [quantitiesCondition,setQuantitiesCondition]=React.useState<string[]>([]);
    const [unitsCondition,setUnitsCondition]=React.useState<string[]>([]);
    React.useEffect(()=>{
        if(newSensOrAct.type){
            setQuantitiesCondition((ontologies.sensingDevices)[newSensOrAct?.type as keyof typeof ontologies.sensingDevices].quantities);
        }else{
            setQuantitiesCondition([]);
        }
    },[newSensOrAct.type])
    React.useEffect(()=>{
        if(newSensOrAct.quantity){
            setUnitsCondition((ontologies.quantities)[newSensOrAct?.quantity as keyof typeof ontologies.quantities].units);
            
        }else{
            setUnitsCondition([]);
        }
    },[newSensOrAct.quantity])
    return (
        <>
            <Box my={1}>
                <SelectElementString
                    conditions={Object.keys(ontologies.sensingDevices)}
                    handleChange={handleSelectChange}
                    title="Sensor Type"
                    value={newSensOrAct.type}
                    name="type" 
                    id="type"
                />
            </Box>
            <Box sx={{display:'flex',alignItems:'center',my:1, justifyContent:'space-between'}}>
                <SelectElementString
                    conditions={quantitiesCondition}
                    handleChange={handleSelectChange}
                    title="Quantity"
                    value={newSensOrAct.quantity}
                    name="quantity" 
                    id="quantity"
                    widthPassed="45%"
                />
                <SelectElementString
                    conditions={unitsCondition}
                    handleChange={handleSelectChange}
                    title="Unit"
                    value={newSensOrAct.unit?newSensOrAct.unit:''}
                    name="unit" 
                    id="unit"
                    widthPassed="45%"
                />
            </Box>
        </>
    )
}
