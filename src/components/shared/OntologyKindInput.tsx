import { SyntheticEvent, useMemo } from 'react';
import ontologies from "../../assets/ontologies.json";
import ontologiesicons from '../../assets/ontologies.svg';
import { Box,Autocomplete, InputAdornment, TextField, createFilterOptions } from '@mui/material';
import SVGIcon from './SVGIcon';
import { InputField } from '../../pages/Login';
interface Props{
    value: string;
    onChange: (name: string, value: string | null) => void;
    deviceType?: string;
    name: string
    title?: string;
}
const filter = createFilterOptions<string>();
export default function OntologyKindInput({deviceType,onChange,title,value,name}:Props) {
    const {ontology,options} = useMemo<{
        ontology: { [key: string]: { label: string; icon: string } },
        options: string[]
    }>(()=>{
        return {
            ontology: deviceType=='actuator'? ontologies.actingDevices: ontologies.sensingDevices,
            options: deviceType==='actuator'? Object.keys(ontologies.actingDevices): Object.keys(ontologies.sensingDevices)
        }
    },[deviceType])
    
    return (
        <Autocomplete
            value={value??null}
            options={options}
            id='kind-select'
            onChange={(_event: SyntheticEvent<Element, Event>, newValue: string | null) => {
                if(typeof newValue === "string" && newValue?.startsWith('use ')){
                    const newKind = newValue?.replaceAll('use ','');
                    onChange(name, (newKind as string).replace(/"/g, ''));
                }else if (typeof newValue === "string") {
                    onChange(name, newValue);
                } else {
                    onChange(name, "");
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // const { inputValue } = params;
                // // Suggest the creation of a new value
                // const isExisting = options.some((option) => inputValue === option);
                // if (inputValue !== '' && !isExisting) {
                //     filtered.push(`use "${inputValue}"`);
                // }
                return filtered;
            }}
            getOptionLabel={(option) => {
                if (ontology && option in ontology) {
                    return ontology[option].label;
                } 
                return option;
            }}
            selectOnFocus
            handleHomeEndKeys
            clearOnBlur
            clearOnEscape
            renderOption={(props, option, _state, ownerState) => {
                const { key, ...optionProps } = props;
                const defaultKindIcon = "meter";
                let icon: string;
                if (typeof option === "string") {
                    if (ontology &&  option in ontology) {
                        icon = (ontology && ontology[option]).icon;
                    } else {
                        icon = defaultKindIcon;
                    }
                } else {
                    icon = defaultKindIcon;
                }
                return (
                    <Box key={key} sx={{display:'flex',cursor:'pointer',alignItems:'center',}} component="li"  {...optionProps}>
                        <SVGIcon
                            style={{ width: 25, height: 25, margin: 5 }}
                            src={`${ontologiesicons}#${icon}`}
                        />
                        {ownerState.getOptionLabel(option)? ownerState.getOptionLabel(option): option}
                    </Box>
                )
            }}
            freeSolo
            renderInput={(params) => {
                let icon = 'meter';
                if (ontology && value in ontology) {
                    icon = (ontology && ontology[value]).icon;
                } else {
                    icon = 'meter';
                }
                params.InputProps.startAdornment = (
                    <>
                        {params.InputProps.startAdornment || null}
                        <InputAdornment position="start">
                            {icon && <SVGIcon
                                style={{ width: 25, height: 25, margin: 5 }}
                                src={`${ontologiesicons}#${icon}`}
                            />}
                        </InputAdornment>
                    </>
                );
                return (
                    <InputField mendatory label={deviceType == "actuator" ? title || "Actuator Type" : title || "Sensor Type"}>
                        <TextField
                            {...params}
                            // value={ontology[value] && ontology[value].label && <Box ml={1}>{ontology[value].label}</Box>}
                            // label={deviceType == "actuator" ? title || "Actuator Type" : title || "Sensor Type"}
                            // placeholder={(ontology && ontology[value]) ? (ontology && ontology[value]).label : value}
                            value={value}
                            variant='standard'
                            color='primary'
                        />
                    </InputField>
                )
            }}
        />
    )
}
