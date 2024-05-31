import { SelectChangeEvent,Box } from "@mui/material"
import SelectElementString from "../shared/SelectElementString";
import ontologies from '../../assets/ontologies.json';
import React from "react";
interface Props{
    newSensOrAct: {name:string, kind:string,quantity:string,unit?:string},
    handleSelectChange:(event: SelectChangeEvent<string>)=>void
}
export default function CreateActuatorModal({newSensOrAct,handleSelectChange}:Props) {
    const [quantitiesCondition,setQuantitiesCondition]=React.useState<string[]>([]);
    const [unitsCondition,setUnitsCondition]=React.useState<string[]>([]);
    React.useEffect(()=>{
        if(newSensOrAct.kind){
            setQuantitiesCondition((ontologies.actingDevices)[newSensOrAct?.kind as keyof typeof ontologies.actingDevices].quantities);
        }
    },[newSensOrAct.kind])
    React.useEffect(()=>{
        if(newSensOrAct.quantity){
            setUnitsCondition((ontologies.quantities)[newSensOrAct?.quantity as keyof typeof ontologies.quantities].units);
        }
    },[newSensOrAct.quantity])
    return (
        <>
            <SelectElementString
                conditions={Object.keys(ontologies.actingDevices)}
                handleChange={handleSelectChange}
                title="Actuator Type"
                value={newSensOrAct.kind}
                id="kind"
                name="kind"
            />
            <Box sx={{display:'flex',alignItems:'center',my:1, justifyContent:'space-between'}}>
                <SelectElementString
                    conditions={quantitiesCondition}
                    handleChange={handleSelectChange}
                    title="Quantity"
                    value={newSensOrAct.quantity}
                    id="quantity"
                    widthPassed="48%"
                    name="quantity"
                />
                <SelectElementString
                    conditions={unitsCondition}
                    handleChange={handleSelectChange}
                    title="Unit"
                    value={newSensOrAct.unit?newSensOrAct.unit:''}
                    widthPassed="48%"
                    id="unit"
                    name="unit"
                />
            </Box>
        </>
    )
}
