// import React

// import styles
import styles from '../styles/Tasks.module.css'

// function Component(){} instead of const Component = () => {} because you can export default on arrow functions
// also most components will not ONLY return/render. Most will have JS code before returning
export default function Tasks ({ children }) { 

    return (
        <div className={styles.container}>
            {children}
            <div>Tasks</div>
        </div>
    )
}