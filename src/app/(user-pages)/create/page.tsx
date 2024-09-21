import type { Metadata } from "next";

import { UserForm } from "@/src/components/forms";

export const metadata: Metadata = {
    title: "Group 4 | Create Post",
    description: "Explore, share, and express what you want with everyone",
};

export default function Home() {
    return <UserForm typeForm="createPost" />
}
