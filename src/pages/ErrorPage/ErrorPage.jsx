/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import styles from './ErrorPage.module.scss';
import ImageButton from '@/components/ImageButton/ImageButton';

export default function ErrorPage({}) {
    const navigate = useNavigate();
    const error = useRouteError();

    return (
        <div className={styles.container}>
            <div className={styles.error}>
                <h1>{error?.cause || 'Something went wrong'}</h1>
                <p>{error?.message}</p>
                <ImageButton
                    onClick={() => {
                        navigate('');
                    }}
                    icon={null}
                >
                    Go back to home
                </ImageButton>
            </div>
        </div>
    );
}
