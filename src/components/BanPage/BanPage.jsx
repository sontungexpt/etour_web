import React from 'react';
import styles from './BanPage.module.scss';

const BanPage = () => {
    return (
        <div className={styles.container}>
            <h1>Your company is being banned.</h1>
            <p>Please contact our support center to get help.</p>
            <p>
                Email to
                <a
                    style={{
                        textDecoration: 'underline',
                    }}
                    href="mailto:21522266@gm.uit.edu.vn"
                >
                    this!
                </a>
            </p>
        </div>
    );
};

export default BanPage;
