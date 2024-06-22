import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <>
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <Link to="/">Visit Our Homepage</Link>
        </>
    )
}

export default Missing
