import { Skeleton as SkeletonMUI } from "@mui/material";

import type { SkeletonProps } from "@/src/types/components-props";

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