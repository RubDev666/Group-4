import { Avatar } from "@mui/material";

import type { AvatarProps } from "@/src/types/components-props";

export default function AvatarImg({ size, fontSize, user }: AvatarProps) {
    const initialLetter = user.displayName?.charAt(0).toLocaleUpperCase();

    return (
        <>
            {(user.photoURL?.charAt(0) === '#') && (
                <Avatar
                    sx={{
                        width: size,
                        height: size,
                        color: '#fff',
                        backgroundColor: user.photoURL,
                        fontSize
                    }}
                >
                    {initialLetter}
                </Avatar>
            )}

            {(user.photoURL?.includes('https')) && (
                <Avatar
                    alt="img-user"
                    src={user.photoURL}
                    sx={{ width: size, height: size }}
                />
            )}
        </>
    )
}
