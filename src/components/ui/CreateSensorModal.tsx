import { Box, SelectChangeEvent,  } from '@mui/material';
import ontologies from '../../assets/ontologies.json';
import SelectElementString from '../shared/SelectElementString';
import React from 'react';
import OntologyKindInput from '../shared/OntologyKindInput';
interface Props{
    newSensOrAct: {name:string,kind:string,quantity:string,unit?:string},
    handleSelectChange:(name:string,value: string)=>void
}
export default function CreateSensorModal({newSensOrAct,handleSelectChange}:Props) {
    const [quantitiesCondition,setQuantitiesCondition]=React.useState<string[]>([]);
    const [unitsCondition,setUnitsCondition]=React.useState<string[]>([]);
    React.useEffect(()=>{
        if(newSensOrAct.kind){
            const quantitiesCondition=(ontologies.sensingDevices)[newSensOrAct?.kind as keyof typeof ontologies.sensingDevices]? (ontologies.sensingDevices)[newSensOrAct?.kind as keyof typeof ontologies.sensingDevices].quantities:[];
            setQuantitiesCondition(quantitiesCondition);
        }else{
            setQuantitiesCondition([]);
        }
    },[newSensOrAct.kind])
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
                <OntologyKindInput
                    value={newSensOrAct.kind}
                    onChange={(name, value) => handleSelectChange(name, value as string)}
                    deviceType="sensor"
                    name="kind" 
                />
            </Box>
            <Box sx={{display:'flex',alignItems:'center',my:1, justifyContent:'space-between'}}>
                <SelectElementString
                    conditions={quantitiesCondition}
                    handleChange={(event: SelectChangeEvent<string>) => handleSelectChange('quantity', event.target.value)}
                    title="Quantity"
                    value={newSensOrAct.quantity}
                    name="quantity" 
                    id="quantity"
                    widthPassed="45%"
                />
                <SelectElementString
                    conditions={unitsCondition}
                    handleChange={(event: SelectChangeEvent<string>) => handleSelectChange('unit', event.target.value)}
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
