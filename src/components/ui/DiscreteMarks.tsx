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

export default function DiscreteMarks({ matches, onSliderChange, value }: { value: string, onSliderChange: (value: string) => void, matches: boolean }) {
    const handleChange = (_event: Event, newValue: number | number[]) => {
        onSliderChange(labels[newValue as number]);
    }
    return (
        <Box sx={{ width: '90%', mx: matches ? 2 : 'auto' }}>
            <Slider
                defaultValue={4}
                valueLabelFormat={valueLabelFormat}
                sx={{ color: DEFAULT_COLORS.orange, fontSize: 10, width: 1, fontWeight: 100 }}
                getAriaValueText={valuetext}
                value={labels.indexOf(value)}
                aria-labelledby="sync-interval-input"
                step={null}
                max={marks.length - 1}
                onChange={handleChange}
                valueLabelDisplay="auto"
                marks={marks.map((label, value) => ({ value, label }))}
            />
        </Box>
    );
}
