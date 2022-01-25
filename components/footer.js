import React, {Component} from 'react'; 
import styles from '../styles/footer.module.css'

const Footer = () => {
    return(
        <div className="main-footer">
            <div className = {styles.container}>
            <div className = "container">
            <div className = {styles.content}>
                <div className = "row">
                    <p className = "col-sm">
                        Made with 💙 by the dev team
                    </p>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}

export default Footer;
