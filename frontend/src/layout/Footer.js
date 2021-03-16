// import styles
import styles from '../styles/Footer.module.css'

// function Component(){} instead of const Component = () => {} because you can export default on arrow functions
// also most components will not ONLY return/render. Most will have JS code before returning
export default function Footer () { 

    return (
        <>
            <footer className={styles.container}>
                <h3 className={styles.text}>Designed and developed by Jonnie Oak.</h3>
            </footer>
        </>
    )
}