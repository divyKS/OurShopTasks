import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const useAxiosFetch = (URL) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { authToken: accessToken, refresh } = useAuth();

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()

        const getData = async () => {
            try{
                setIsLoading(true);
                const axiosConfigObject = { cancelToken: source.token, headers: { Authorization: `Bearer ${accessToken}` }};
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
                    if(e.response.status == 403){
                        try {
                            const responseAT = await refresh();
                            if(responseAT?.data?.accessToken){
                                try{
                                    const axiosConfigObject = { cancelToken: source.token, headers: { Authorization: `Bearer ${responseAT.data.accessToken}` }};
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
                                        console.log("GET /users error")
                                        setData([])
                                        setIsError(true)
                                        setError(e)
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e)
                            console.log("refresh() error");
                            setData([])
                            setIsError(true)
                            setError(e)
                        }
                    }
                    else{
                        setData([])
                        setIsError(true)
                        setError(e)
                    }
                }
            }
            finally{
                if(isMounted) setIsLoading(false)
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