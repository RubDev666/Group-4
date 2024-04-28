import { Skeleton as SkeletonMUI } from "@mui/material";

type SkeletonProps = {
    variant: 'circular' | 'rectangular';
    width: number;
    height: number;
}

export default function Skeleton({ variant, width, height }: SkeletonProps) {
    return (
        <SkeletonMUI
            sx={{ backgroundColor: '#b1b1b1' }}
            width={width}
            height={height}
            variant={variant}
        />
    )
}