import Skeleton from "./Skeleton";

export default function SkeletonUser() {
    return (
        <div className="flex skeleton-user">
            <Skeleton
                variant="circular"
                width={30}
                height={30}
            />

            <Skeleton
                variant="rectangular"
                width={100}
                height={30}
            />
        </div>
    )
}