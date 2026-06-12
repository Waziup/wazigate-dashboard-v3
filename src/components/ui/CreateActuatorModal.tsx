import { Box } from "@mui/material"
import SelectElementString from "../shared/SelectElementString";
import ontologies from '../../assets/ontologies.json';
import React from "react";
import OntologyKindInput from "../shared/OntologyKindInput";
interface Props{
    newSensOrAct: {name:string, kind:string,quantity:string,unit?:string},
    handleSelectChange:(name:string,value: string)=>void
}
export default function CreateActuatorModal({newSensOrAct,handleSelectChange}:Props) {
    const [quantitiesCondition,setQuantitiesCondition]=React.useState<string[]>([]);
    const [unitsCondition,setUnitsCondition]=React.useState<string[]>([]);
    React.useEffect(()=>{
        if(newSensOrAct.kind){
            const quantitiesCondition=(ontologies.actingDevices)[newSensOrAct?.kind as keyof typeof ontologies.actingDevices]? (ontologies.actingDevices)[newSensOrAct?.kind as keyof typeof ontologies.actingDevices].quantities:[];
            setQuantitiesCondition(quantitiesCondition);
        }else{
            setQuantitiesCondition([]);
        }
    },[newSensOrAct.kind])
    React.useEffect(()=>{
        if(newSensOrAct.quantity){
            const unitsCondition=(ontologies.quantities)[newSensOrAct?.quantity as keyof typeof ontologies.quantities] ? (ontologies.quantities)[newSensOrAct?.quantity as keyof typeof ontologies.quantities].units: [];
            setUnitsCondition(unitsCondition);
        }else{
            setUnitsCondition([]);
        }
    },[newSensOrAct.quantity])
    return (
        <>
            <OntologyKindInput
                value={newSensOrAct.kind}
                onChange={(name, value) => handleSelectChange(name, value as string)}
                deviceType="actuator"
                name="kind"
            />
            <Box sx={{display:'flex',alignItems:'center',my:1, justifyContent:'space-between'}}>
                <SelectElementString
                    conditions={quantitiesCondition}
                    handleChange={(event) => handleSelectChange('quantity', event.target.value)}
                    title="Quantity"
                    value={newSensOrAct.quantity}
                    id="quantity"
                    widthPassed="48%"
                    name="quantity"
                />
                <SelectElementString
                    conditions={unitsCondition}
                    handleChange={(event) => handleSelectChange('unit', event.target.value)}
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
