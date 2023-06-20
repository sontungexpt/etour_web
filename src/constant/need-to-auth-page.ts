import ENDPOINT from './endponint';

export const NEED_TO_AUTH_PAGE: string[] = [
    ENDPOINT.AUTHENTICATION,
    ENDPOINT.ON_BOARDING,
    ENDPOINT.REGISTER,
    ENDPOINT.VALIDATE_COMPANY,
    ENDPOINT.UPDATE_REGISTER,
];

interface IPath {
    pathname: string;
    except?: string | string[];
}

export const isPathNameInNeedToAuthPage = (path: IPath) => {
    const { pathname, except } = path;
    if (!except) return NEED_TO_AUTH_PAGE.includes(pathname);
    if (Array.isArray(except)) {
        return NEED_TO_AUTH_PAGE.filter((t) => !except.includes(t)).includes(pathname);
    }
    return NEED_TO_AUTH_PAGE.filter((t) => t !== except).includes(pathname);
};
