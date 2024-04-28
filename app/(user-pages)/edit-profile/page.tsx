import type { Metadata } from "next";

import { UserForm } from "@/app/_components/forms";

export const metadata: Metadata = {
    title: "Group 4 | Edita tu perfil",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
};

export default function Home() {
    return (
        <UserForm typeForm="editProfile" />
    );
}
