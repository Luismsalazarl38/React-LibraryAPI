import React, { useState, useEffect } from "react"
import { getAllTask } from "../api/task.api";
import { UserCard } from "./UserCard";


export function TaskList() {

    const [users,setUsers] = useState([])


    useEffect(() => {
        
        async function loadTask(){
            const res = await getAllTask()
            setUsers(res.data)
        }

        loadTask()

    }, [])


    return <div>
        {users.map(user => (
           <UserCard key={user.id} user={user}/>
        ))}
        </div>

}