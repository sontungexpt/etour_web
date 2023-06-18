import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import useAuthenticationState from './useAuthenticationState';
import AUTHENTICATION_STATE from '@/constant/authenticationState';
import ENDPOINT from '@/constant/endponint';
import { useContext, useEffect } from 'react';
import { isPathNameInNeedToAuthPage } from '../constant/need-to-auth-page';
import SocketContext from '@/contexts/SocketContext';

export default function useAuthenticationNavigate() {
    const navigate = useNavigate();
    const location = useLocation();
    const authenticationState = useAuthenticationState();
    const { socket } = useContext(SocketContext);
    useEffect(() => {
        console.log({ authenticationState1: authenticationState });
        if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED) {
            if (
                !isPathNameInNeedToAuthPage({
                    pathname: location.pathname,
                    except: ENDPOINT.ON_BOARDING,
                })
            )
                navigate(ENDPOINT.ON_BOARDING);
        }
    }, [location.pathname, authenticationState]);
}
