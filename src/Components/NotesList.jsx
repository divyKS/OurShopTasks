import React, { useState, useEffect } from 'react'
import useAxiosFetch from '../Hooks/useAxiosFetch'
import Note from './Note'

const NotesList = () => {
  const { data, isLoading, isSuccess, isError, error } = useAxiosFetch('http://localhost:3500/notes')

  const [notes, setNotes] = useState([])

  useEffect(()=>{
    if(data){
        const updatedData = data.reduce((accumulator, note) => {
            const {_id, ...rest} = note;
            const newNoteObject = {
                id: _id,
                ...rest
            }
            accumulator.push(newNoteObject)
            return accumulator
        }, [])
        setNotes(updatedData)
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
    
    const tableContent = notes.map((note)=>(
      <Note key={note.id} noteData={note}></Note>
    ))

    return (
        <>
            <table>
                <thead>
                    <th>Status</th>
                    <th>Username</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Title</th>
                    <th>Edit</th>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>        
        </>
    )
  }

}

export default NotesList