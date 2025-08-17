import { Button, Typography, Icon, ButtonOwnProps, SxProps, Theme  } from '@mui/material';

interface PrimaryIconButtonProps {
    title: string;
    iconName: string;
    fontSize?: number;
    type?: 'submit' | 'button'
    onClick?: () => void;
    hideText?: boolean
    disabled?: boolean
    additionStyles?: SxProps<Theme>,
    color?: ButtonOwnProps["color"],
    textColor?: string,
    variant?: "text" | "contained" | "outlined"

}

// const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
//     color: theme.palette.getContrastText(DEFAULT_COLORS.orange),
//     backgroundColor: DEFAULT_COLORS.orange,
//     // '&:hover': {
//     //   backgroundColor: purple[700],
//     // },
//   }));

export default function PrimaryIconButton( props : PrimaryIconButtonProps) {
    const { title, iconName, fontSize, type, onClick, hideText, disabled, additionStyles, color, textColor, variant } = props;
    
    return (
        <>
            {
                hideText ? (
                    <Button disableElevation startIcon={<Icon onClick={onClick} sx={{ color: textColor ?? '#fff', }} >{iconName}</Icon>} />
                ) : (
                    <Button
                        disableElevation
                        disabled={disabled ? disabled : false}
                        type={type}
                        startIcon={<Icon sx={{ fontSize: 16, color: textColor ?? '#fff' }} >{iconName}</Icon>}
                        sx={{ ...additionStyles }}
                        onClick={onClick} 
                        color={color ? color : "info"}
                        variant={variant ?? 'contained'}
                    >
                        <Typography color={textColor ?? '#fff'} fontSize={fontSize ? fontSize : 14} fontWeight={300}>{title}</Typography>
                    </Button>
                )
            }
        </>
    )
}
