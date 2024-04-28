//import { Metadata } from "next";
import { redirect } from "next/navigation";

/*export const metadata: Metadata = {
    title: "404 Pagina no encontrada",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
}; */

const page = () => {
    /*return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
        </div>
    )*/
    
    redirect('/');
}

export default page