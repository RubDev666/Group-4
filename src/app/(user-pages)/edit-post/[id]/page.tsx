import type { Metadata } from "next";

import { EditPostForm } from "@/src/components/forms";

import type { Params } from "@/src/types/components-props";

export const metadata: Metadata = {
    title: "Group 4 | Editar publicacion",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
};

export default function Page({ params }: Params) {
    return (
        <EditPostForm idPost={params.id} />
    )
}
