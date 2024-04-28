export default function NotFound({message}: {message: string}) {
    return (
        <div className="not-found-container w-full all-center text-center direction-column">
            <h2 className="error-title logo-font">Error 40<span>4</span></h2>
            <p>{message}</p>
        </div>
    )
}
