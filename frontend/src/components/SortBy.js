// import React

// import styles
import styles from '../styles/SortBy.module.css'

// function Component(){} instead of const Component = () => {} because you can export default on arrow functions
// also most components will not ONLY return/render. Most will have JS code before returning
export default function SortBy () { 
    const azHandler = () => {
        console.log('az')
        document.getElementById("az").classList.add(styles.selected)
        document.getElementById("za").classList.remove(styles.selected)
        document.getElementById("newold").classList.remove(styles.selected)
        document.getElementById("oldnew").classList.remove(styles.selected)
    }
    const zaHandler = () => {
        console.log('za')
        document.getElementById("az").classList.remove(styles.selected)
        document.getElementById("za").classList.add(styles.selected)
        document.getElementById("newold").classList.remove(styles.selected)
        document.getElementById("oldnew").classList.remove(styles.selected)
    }
    const newOldHandler = () => {
        console.log('newold')
        document.getElementById("az").classList.remove(styles.selected)
        document.getElementById("za").classList.remove(styles.selected)
        document.getElementById("newold").classList.add(styles.selected)
        document.getElementById("oldnew").classList.remove(styles.selected)
    }
    const oldNewHandler = () => {
        console.log('oldnew')
        document.getElementById("az").classList.remove(styles.selected)
        document.getElementById("za").classList.remove(styles.selected)
        document.getElementById("newold").classList.remove(styles.selected)
        document.getElementById("oldnew").classList.add(styles.selected)
    }

    return (
        <div className={styles.container}>
            <span className={styles.sortby}>Sort by:</span>
            <button className={styles.az} onClick={azHandler} id="az">A-Z</button>
            <button className={styles.za} onClick={zaHandler} id="za">Z-A</button>
            <button className={styles.newold} onClick={newOldHandler} id="newold">New-Old</button>
            <button className={styles.oldnew} onClick={oldNewHandler} id="oldnew">Old-New</button>
        </div>
    )
}