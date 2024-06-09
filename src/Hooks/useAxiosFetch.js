import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

function useAxiosFetch(URL) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const {authToken: accessToken} = useAuth();

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()

        const getData = async () => {
            try{
                setIsLoading(true);
                const axiosConfigObject = {
                    cancelToken: source.token,
                    headers: { Authorization: `Bearer ${accessToken}` }
                };
                const response = await axios.get(URL, axiosConfigObject);
                if(isMounted){
                    setData(response.data)
                    setIsError(null)
                    setError(null)
                    setIsSuccess(true)
                }
            }
            catch(e){
                if(isMounted){
                    setData([])
                    setIsError(true)
                    setError(e)
                }
            }
            finally{
                if(isMounted){
                    setIsLoading(false)
                }
            }
        }

        getData()

        const cleanUp = () => {
            if(isMounted){
                isMounted = false
                source.cancel()
            }
        }

        return cleanUp
    }, [URL])

    return { data, isLoading, isSuccess, isError, error }
}

export default useAxiosFetch