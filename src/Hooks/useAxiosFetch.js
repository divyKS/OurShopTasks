import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const useAxiosFetch = (URL) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { authToken: accessToken, refresh, refreshSuccess } = useAuth();

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
                        console.log("your access token was expired, calling the function to refresh your AT if possible");
                        
                        try {
                            const response = await refresh();                            
                            console.log("the AT was re-freshed successfully, now making request again to get data");
                            if(refreshSuccess){
                                try{
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
                                        console.log("there was some error after refreshing the AT")
                                        setData([])
                                        setIsError(true)
                                        setError(e)
                                    }
                                }
                            }                            
                        } catch (e) {
                            console.log(e)
                            console.log("could not refresh the AT with the help of RT");
                            setData([])
                            setIsError(true)
                            setError(e)
                        }

                        // const newAccessToken = await getNewAccessToken();
                        // if(!rtIsError){
                        //     console.log("got new access token from the /refresh" + newAccessToken);
                        //     setAuthToken(newAccessToken);
                        //     console.log(accessToken);
                        //     setIsLoading(true);
                        //     console.log("check if the AT has changed in the headers automatically from hook")
                        //     console.log(axiosConfigObject.headers);
                        //     const response = await axios.get(URL, axiosConfigObject);
                        //     if(isMounted){
                        //         setData(response.data)
                        //         setIsError(null)
                        //         setError(null)
                        //         setIsSuccess(true)
                        //     }
                        // }
                        // else{
                        //     console.log("your both AT and RT have expired or are bad, please logout and login again");
                        //     setData([]);
                        //     setIsError(true);
                        //     setError(rtError);
                        // }
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