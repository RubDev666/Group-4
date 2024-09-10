import type { Metadata } from "next";

//import Index from "./_pages-components/Index";
import Main from "../pageComponents/Main";

export const metadata: Metadata = {
    title: "Group 4 | Explora, comparte y expresa",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
}; 

export default function Home() {
    return (
        <Main />
    );
}
