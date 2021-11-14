import React, {Component} from 'react'; 
import styles from '../styles/footer.module.css'

const Footer = () => {
    return(
        <div className="main-footer">
            <div className = {styles.container}>
            <div className = "container">
                <div className = "row">
                    {/* Column1 */}
                    <div className = "col-md-3 col-sm-6">
                        <h4>FarmersOnly</h4>
                        <ul className = "list-unstyled">
                            <li>Something</li>
                            <li>Something</li>
                            <li>Something</li>
                        </ul>
                    </div>
                    {/* Column2 */}
                    <div className = "col-md-3 col-sm-6">
                        <h4>Stuff</h4>
                        <ul className = "list-unstyled">
                            <li>Something</li>
                            <li>Something</li>
                            <li>Something</li>
                        </ul>
                    </div>
                    {/* Column3 */}
                    <div className = "col-md-3 col-sm-6">
                        <h4>Stuff</h4>
                        <ul className = "list-unstyled">
                            <li>Something</li>
                            <li>Something</li>
                            <li>Something</li>
                        </ul>
                    </div>
                    <div className = "row">
                        <p className = "col-sm">
                            &copy;{new Date().getFullYear} FarmersOnly
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Footer;