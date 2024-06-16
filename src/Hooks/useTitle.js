import { useEffect } from 'react'

const useTitle = (newTitle) => {
    useEffect(()=>{
        const prevTitle = document.title;
        document.title = newTitle;
        return ()=>{
            document.title = prevTitle;
        }
    }, [newTitle]);
}

export default useTitle;