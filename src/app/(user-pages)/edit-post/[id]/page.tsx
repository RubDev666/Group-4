import type { Metadata } from "next";

import { EditPostForm } from "@/src/components/forms";

import type { Params } from "@/src/types/components-props";

export const metadata: Metadata = {
    title: "Group 4 | Edit post",
    description: "Explore, share, and express what you want with everyone",
};

export default function Page({ params }: Params) {
    return (
        <EditPostForm idPost={params.id} />
    )
}
