// import React

// import styles
import styles from '../styles/ShowBy.module.css'

// function Component(){} instead of const Component = () => {} because you can export default on arrow functions
// also most components will not ONLY return/render. Most will have JS code before returning
export default function ShowBy () { 
    const allHandler = () => {
        console.log('all')
        document.getElementById("all").classList.add(styles.selected)
        document.getElementById("open").classList.remove(styles.selected)
        document.getElementById("closed").classList.remove(styles.selected)
    }
    const openHandler = () => {
        console.log('open')
        document.getElementById("all").classList.remove(styles.selected)
        document.getElementById("open").classList.add(styles.selected)
        document.getElementById("closed").classList.remove(styles.selected)
    }
    const closedHandler = () => {
        console.log('closed')
        document.getElementById("all").classList.remove(styles.selected)
        document.getElementById("open").classList.remove(styles.selected)
        document.getElementById("closed").classList.add(styles.selected)
    }

    return (
        <div className={styles.container}>
            <span className={styles.show}>Show:</span>
            <button className={styles.all} onClick={allHandler} id="all">All</button>
            <button className={styles.open} onClick={openHandler} id="open">Open</button>
            <button className={styles.closed} onClick={closedHandler} id="closed">Closed</button>
        </div>
    )
}