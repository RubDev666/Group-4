'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import AvatarImg from "./AvatarImg";

import { User } from "firebase/auth";
import firebase from "@/src/firebase/firebase";

import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import {
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";

import { Settings, Logout, Create } from "@mui/icons-material";

import themeColors from "@/src/utilities/themeColors";

type UserOptionsProps = {
    theme: string;
    usuario: User;
}

//este es solo si queremos modificar el tooltip acorde al tema del usuario
interface ColoresProps extends TooltipProps {
    themeMode?: string;
}

const CustomTooltip = styled(({ className, themeMode, ...props }: ColoresProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, themeMode }) => ({
    /*[`& .${tooltipClasses.arrow}`]: {
        color: themeColors.color[themeMode]
    },*/
    [`& .${tooltipClasses.tooltip}`]: {
        color: '#fff',
        backgroundColor: '#ff2600',
        fontSize: theme.typography.pxToRem(14),
    },
}));

export default function UserOptions({ theme, usuario }: UserOptionsProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const menuItemHover = { ":hover": { backgroundColor: `${themeColors.itemHover[theme]}` } };

    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const logout = async () => await firebase.cerrarSesion();

    return (
        <>
            <CustomTooltip
                title="Ver opciones del perfil"
                themeMode={theme}
            >
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <AvatarImg
                        size={32}
                        fontSize={20}
                        user={usuario}
                    />
                </IconButton>
            </CustomTooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            backgroundColor: themeColors.bgColor[theme],
                            color: themeColors.color[theme],
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: themeColors.bgColor[theme],
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => router.push(`/u/${usuario.displayName}`)} sx={menuItemHover}>
                    <AvatarImg
                        size={32}
                        fontSize={20}
                        user={usuario}
                    />

                    {'u/' + usuario.displayName}
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => router.push('/create')} sx={menuItemHover}>
                    <ListItemIcon>
                        <Create className="primary-color" fontSize="small" />
                    </ListItemIcon>
                    Crear publicacion
                </MenuItem>

                <MenuItem onClick={() => router.push('/edit-profile')} sx={menuItemHover}>
                    <ListItemIcon>
                        <Settings className="primary-color" fontSize="small" />
                    </ListItemIcon>
                    Editar perfil
                </MenuItem>

                <MenuItem onClick={logout} sx={menuItemHover}>
                    <ListItemIcon>
                        <Logout className="primary-color" fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesion
                </MenuItem>
            </Menu>
        </>
    )
}