import type { Metadata } from "next";

import { EditPostForm } from "@/app/_components/forms";

export const metadata: Metadata = {
    title: "Group 4 | Editar publicacion",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
};

export default function Page({ params }: { params: { idPost: string }}) {
    return (
        <EditPostForm idPost={params.idPost} />
    )
}
