import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { DEFAULT_COLORS } from '../../constants';

const marks = [
    {
        value: 0,
        label: 'instant',
    },
    {
        value: 20,
        label: '20s',
    },
    {
        value: 40,
        label: '40s',
    },
    {
        value: 60,
        label: '1m',
    },
    {
        value:80,
        label:'5m'
    },
    {
        value:100,
        label:'15m'
    },
    {
        value:120,
        label:'30m'
    },
    {
        value:140,
        label:'1h'
    },
];

function valuetext(value: number) {
  return `${value}°C`;
}

export default function DiscreteMarks({matches}:{matches:boolean}) {
    return (
        <Box sx={{ width: matches?'35%':'90%',mx:matches?2:'auto' }}>
            <Slider
                aria-label="Custom marks"
                defaultValue={40}
                getAriaValueText={valuetext}
                step={5}
                min={0}
                max={140}
                
                sx={{color:DEFAULT_COLORS.primary_blue,fontSize:10, width:1,fontWeight:100}}
                valueLabelDisplay="auto"
                marks={marks}
            />
        </Box>
    );
}
