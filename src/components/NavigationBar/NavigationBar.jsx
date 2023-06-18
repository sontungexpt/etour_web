import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '@/assets/logo.svg';
import { ReactComponent as Route } from '@/assets/route.svg';
import { ReactComponent as Tour } from '@/assets/tour.svg';
import { ReactComponent as HOME } from '@/assets/home.svg';

import ENDPOINT from '@/constant/endponint';
import NavigationButton from '../NavigationButton/NavigationButton';
import styles from '@/pages/BasePage/BasePage.module.scss';
import { isPathNameInNeedToAuthPage } from '../../constant/need-to-auth-page';

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRender, setIsRender] = React.useState(false);
    useEffect(() => {
        setIsRender(
            !isPathNameInNeedToAuthPage({
                pathname: location.pathname,
            })
        );
    }, [location.pathname]);

    return (
        <>
            {isRender && (
                <div className={styles.drawer}>
                    <button
                        type="button"
                        className={styles.logo}
                        onClick={() => navigate(ENDPOINT.HOME)}
                    >
                        <img src={LOGO} alt="" />
                    </button>
                    <div className={styles.navButtonGroup}>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.HOME)}
                            isHighlighted={location.pathname == ENDPOINT.HOME}
                            icon={HOME}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                padding: '0.5rem 2rem',
                            }}
                        >
                            Home
                        </NavigationButton>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.TOURIST_ROUTE)}
                            isHighlighted={location.pathname == ENDPOINT.TOURIST_ROUTE}
                            icon={Route}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                padding: '0.5rem 2rem',
                            }}
                        >
                            Tourist route
                        </NavigationButton>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.TOUR)}
                            isHighlighted={location.pathname == ENDPOINT.TOUR}
                            icon={Tour}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                padding: '0.5rem 2rem',
                            }}
                        >
                            Tour
                        </NavigationButton>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavigationBar;
