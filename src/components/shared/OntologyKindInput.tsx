import { SyntheticEvent } from 'react';
import ontologies, { actingDevices,sensingDevices } from "../../assets/ontologies.json";
import ontologiesicons from '../../assets/ontologies.svg';
import { Box,Autocomplete, InputAdornment, TextField } from '@mui/material';
import SVGIcon from './SVGIcon';
interface Props{
    value: string;
    onChange: (name: string, value: string | null) => void;
    deviceType?: string;
    name: string
    title?: string;
}
type ActingDevice = typeof actingDevices[keyof typeof actingDevices];
type SensingDevice = typeof sensingDevices[keyof typeof sensingDevices];
export default function OntologyKindInput({deviceType,onChange,title,value,name}:Props) {
    let ontology: { [x: string]: ActingDevice | SensingDevice } | null = null
    switch (deviceType) {
        case "actuator": ontology = ontologies.actingDevices; break;
        default:
        case "sensor": ontology = ontologies.sensingDevices; break;
    }
    return (
        <Autocomplete
            value={value}
            options={Object.keys(ontology) as string[]}
            id='kind-select'
            onChange={(_event: SyntheticEvent<Element, Event>, value: string | null) => {
                if (typeof value === "string") {
                    onChange(name, value);
                } else {
                    onChange(name, "");
                }
            }}
            filterOptions={(options, params) => {
                const filtered = options.filter((option) => {
                    if (params.inputValue === "") {
                        return true;
                    }
                    return option.toLowerCase().includes(params.inputValue.toLowerCase());
                });
                return filtered;
            }}
            getOptionLabel={(option) => {
                if (option in ontology) {
                    return ontology[option].label;
                } else {
                    return option;
                }
            }}
            freeSolo
            clearOnEscape
            renderOption={(props, option, _state, ownerState) => {
                const { key, ...optionProps } = props;
                const defaultKindIcon = "meter";
                let icon: string;
                if (typeof option === "string") {
                    if (option in ontology) {
                        icon = ontology[option].icon;
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
                        {ownerState.getOptionLabel(option)}
                    </Box>
                )
            }}
            renderInput={(params) => {
                let icon = 'meter';
                if (value in ontology) {
                    icon = ontology[value].icon;
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
                params.inputProps.autoComplete = 'new-password';
                // (params.inputProps)["className"] = `${(params.inputProps as any)["className"]} ${classes.input}`;
                return (
                    <TextField
                        {...params}
                        label={deviceType == "actuator" ? title || "Actuator Type" : title || "Sensor Type"}
                        placeholder="no kind"
                        variant='standard'
                    />
                )
            }}
        />
    )
}
