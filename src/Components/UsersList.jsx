import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../Hooks/useAxiosFetch'
import User from './User'

const UsersList = () => {
    
    const { data, isLoading, isSuccess, isError, error } = useAxiosFetch('http://localhost:3500/users')
    
    const [users, setUsers] = useState([])

    useEffect(()=>{
        if(data){
            const updatedData = data.reduce((accumulator, user) => {
                const {_id, ...rest} = user;
                const newUserObject = {
                    id: _id,
                    ...rest
                }
                accumulator.push(newUserObject)
                return accumulator
            }, [])
            setUsers(updatedData)
        }
    }, [data])

    if(isLoading){
        return (
            <>
                <p>Loading...</p>
            </>
        )
    }
    
    if(!isLoading && isError){
        return (
            <>
                <p>{error?.response?.data}</p>
                <p>{error?.response?.status}</p>
                <p>{error?.response?.headers}</p>
            </>
        )
    }

    if(!isLoading && !isError && isSuccess){
        const tableContent = users.map((user)=>(
            <User key={user.id} userData={user}></User>
        ))

        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Roles</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>        
            </>
        )
    }
}

export default UsersList