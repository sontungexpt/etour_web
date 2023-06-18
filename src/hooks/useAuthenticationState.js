import AUTHENTICATION_STATE from '@/constant/authenticationState';

export default function useAuthenticationState() {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return AUTHENTICATION_STATE.UNAUTHENTICATED;

    return AUTHENTICATION_STATE.AUTHENTICATED;
}
