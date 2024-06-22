import { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
    const [tryingToGetNewAT, setTryingToGetNewAT] = useState(true);
    const {auth, persist} = useAuth();
    const refresh = useRefreshToken();

    useEffect(()=>{
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                setTryingToGetNewAT(true);
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                if(isMounted){
                    setTryingToGetNewAT(false);
                }
            }
        }

        if(!auth?.accessToken && persist){
            // only if we do not have the AT and we want to persist, we do not want to keep refreshing
            verifyRefreshToken();
        }
        else{
            setTryingToGetNewAT(false);
        }

        return () => {
            isMounted = false;
        }

    }, []);

    useEffect(()=>{
        console.log("trying to refresh the access token: " + tryingToGetNewAT);
        console.log("the new access token: " + auth?.accessToken);
    }, [tryingToGetNewAT]);

    if(!persist || persist && !tryingToGetNewAT){
        return <Outlet />
    }
    if(persist && tryingToGetNewAT){
        return <p>Loading...</p>
    }
}

export default PersistLogin