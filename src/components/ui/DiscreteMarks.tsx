import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { DEFAULT_COLORS } from '../../constants';

function valuetext(value: number) {
    return labels[value];
}

function valueLabelFormat(value: number) {
    return labels[value];
}
const labels = ["0s", "5s", "10s", "20s", "30s", "1m", "2m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "12h", "1D", "2D", "10D"];
const marks = ["instant", "", "", "20s", "", "1m", "", "5m", "", "15m", "", "1h", "", "4h", "", "1D", "", "10D"];

export default function DiscreteMarks({matches,onSliderChange,value}:{value:string, onSliderChange:(value:string)=>void, matches:boolean}) {
    
    return (
        <Box sx={{ width: matches?'35%':'90%',mx:matches?2:'auto' }}>
            <Slider
                aria-labelledby="sync-interval-input"
                defaultValue={4}
                getAriaValueText={valuetext}
                valueLabelFormat={valueLabelFormat}
                step={null}
                max={marks.length-1}
                value={labels.indexOf(value)}
                onChange={(_e,value)=>onSliderChange(value.toString())}
                sx={{color:DEFAULT_COLORS.primary_blue,fontSize:10, width:1,fontWeight:100}}
                valueLabelDisplay="auto"
                marks={marks.map((label, value) => ({ value, label }))}
            />
        </Box>
    );
}
