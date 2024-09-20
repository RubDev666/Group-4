'use client';
import { useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';

import themeColors from "@/src/utilities/themeColors";

import {
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
} from "@mui/material";
import { MoreHoriz, Delete, Edit } from '@mui/icons-material';
import firebase from '@/src/firebase/firebase';
import { GlobalContext } from "@/src/app/providers";

import type { PostProps } from '@/src/types/components-props';

export default function PostOptions({idPost}: PostProps) {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const path = usePathname();
    const router = useRouter();

    const {setRefresh, user} = useContext(GlobalContext);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const editPost = () => router.push('/edit-post/' + idPost);

    const deletePost = async () => {
        if(!user) return;

        try {
            await firebase.deletePost(idPost);
            await firebase.createPopularUser(user.uid);

            if(path.includes('/p/')) {
                setRefresh({refresh: true, redirectTo: '/'});
            } else {
                setRefresh({refresh: true, redirectTo: ''});  
            }
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        <>
            {(mounted && theme) && (
                <>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <MoreHoriz
                            sx={{
                                fontSize: 30,
                                borderRadius: '100%',
                                cursor: 'pointer',
                                color: themeColors.color[theme]
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
                            onClick={editPost}
                        >
                            <ListItemIcon>
                                <Edit className="primary-color" fontSize="small" />
                            </ListItemIcon>
                            Editar post
                        </MenuItem>

                        <MenuItem 
                            sx={{ ":hover": { backgroundColor: `${themeColors.itemHover[theme]}` } }}
                            onClick={deletePost}
                        >
                            <ListItemIcon>
                                <Delete className="primary-color" fontSize="small" />
                            </ListItemIcon>
                            Borrar Post
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    )
}