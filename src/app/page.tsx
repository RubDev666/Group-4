import type { Metadata } from "next";

import Main from "../pageComponents/Main";

export const metadata: Metadata = {
    title: "Group 4 | Explore, share, and express",
    description: "Explore, share, and express what you want with everyone",
}; 

export default function Home() {
    return <Main />;
}
