// import React
import { useState } from 'react'
// import styles
import styles from '../styles/NewTask.module.css'

// function Component(){} instead of const Component = () => {} because you can export default on arrow functions
// also most components will not ONLY return/render. Most will have JS code before returning
export default function NewTask () { 
    const [input, setInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        //http post request to /tasks in task-manager-api
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.box}>
                    <form onSubmit={handleSubmit}>
                        <input className={styles.input} value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Enter a new task..."/>
                    </form>
                </div>
            </div>
        </>
    )
}