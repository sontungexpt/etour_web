import React from 'react';
import style from './Loading.module.scss';
const Loading = () => {
    return (
        <div className={style.container}>
            <div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Loading;
