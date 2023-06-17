import ENDPOINT from './endponint';

export const NEED_TO_AUTH_PAGE = [
    ENDPOINT.AUTHENTICATION,
    ENDPOINT.ON_BOARDING,
    ENDPOINT.REGISTER,
    ENDPOINT.VALIDATE_COMPANY,
];

export const isPathNameInNeedToAuthPage = (pathname, except) => {
    return NEED_TO_AUTH_PAGE.filter((t) => t !== except).includes(pathname);
};
