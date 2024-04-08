import React from 'react'
import { useNavigate } from 'react-router-dom'

const Note = ({ noteData }) => {
    const navigate = useNavigate()
    
    const handleEdit = () => navigate(`/dashboard/notes/${noteData.id}`)

    const created = new Date(noteData.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
    const updated = new Date(noteData.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

    return (
        <>
            <tr>
                <td>{noteData.completed ? <span>Completed</span>: <span>Pending</span> }</td>
                <td>{noteData.username}</td> {/* the username we put in in backend  */}
                <td>{created}</td>
                <td>{updated}</td>
                <td>{noteData.title}</td>
                <td>
                    <button onClick={handleEdit}>Edit</button>
                </td>
            </tr>
        </>
    )
}

export default Note