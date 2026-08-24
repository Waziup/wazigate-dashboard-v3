import { Button, ButtonOwnProps, SxProps, Theme, } from '@mui/material';

interface PrimaryButtonProps {
    title: string;
    onClick?: () => void;
    type?: 'submit' | 'button';
    disabled?: boolean;
    additionStyles?: SxProps<Theme>;
    color?: ButtonOwnProps['color'];
    textColor?: string;
    variant?: 'text' | 'contained' | 'outlined';
}

export default function PrimaryButton({
    title,
    type = 'button',
    disabled = false,
    additionStyles = {},
    color = 'info',
    variant = 'contained',
    onClick,
}: PrimaryButtonProps) {
    return (
        <Button
            type={type}
            disabled={disabled}
            sx={{ mx: 1, ...additionStyles }}
            onClick={onClick}
            disableElevation
            color={color}
            variant={variant}
        >
            {title}
            {/* <Typography color={textColor}>{title}</Typography> */}
        </Button>
    );
}
