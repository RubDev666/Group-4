import Image from "next/image";

export default function ImgHero() {
    return (
        <div className="img-hero relative overflow-h w-full">
            <Image 
                src='/images/hero.jpg'
                alt="img-hero"
                priority
                fill
                className="w-full h-full"
            />

            <div className="relative w-full h-full">
                <h1 className="absolute">Explora, comparte, expresa y habla lo que quieras.</h1>
            </div>
        </div>
    )
}