'use client';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import themeColors from "@/src/utilities/themeColors";

import {
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
} from "@mui/material";
import { MoreHoriz, Delete, Edit } from '@mui/icons-material';

import type { CommentOptionsProps } from '@/src/types/components-props';

export default function CommentOptions({deleteF, setEdit}: CommentOptionsProps) {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    return (
        <>
            {(mounted && theme) && (
                <>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2, padding: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <MoreHoriz
                            sx={{
                                fontSize: 30,
                                borderRadius: '100%',
                                cursor: 'pointer',
                                color: themeColors.color[theme],
                                padding: 0
                            }}
                            className='bg-hover-2'
                        />
                    </IconButton>

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
                        <MenuItem 
                            sx={{ ":hover": { backgroundColor: `${themeColors.itemHover[theme]}` } }}
                            onClick={() => setEdit(true)}
                        >
                            <ListItemIcon>
                                <Edit className="primary-color" fontSize="small" />
                            </ListItemIcon>
                            Editar comentario
                        </MenuItem>

                        <MenuItem 
                            sx={{ ":hover": { backgroundColor: `${themeColors.itemHover[theme]}` } }}
                            onClick={() => deleteF()}
                        >
                            <ListItemIcon>
                                <Delete className="primary-color" fontSize="small" />
                            </ListItemIcon>
                            Borrar comentario
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    )
}