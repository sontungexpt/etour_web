import { API } from '@/constant/api';

const AVATAR_IMAGE_PLACEHOLDER: string =
    'https://i.ibb.co/mXW0BSM/Screenshot-2023-06-11-145619.png';
const IMAGE_PLACEHOLDER: string = 'https://i.ibb.co/Sv1Wrm7/Screenshot-2023-06-11-150019-min.png';
const VOUCHER_IMAGE_PLACEHOLDER: string =
    'https://i.ibb.co/r6p6NF8/kisspng-coupon-discounts-and-allowances-computer-icons-coupon-vector-5adc48cd532174-3159344815243859.png';

const COMPANY_IMAGE_PLACEHOLDER: string =
    'https://i.ibb.co/M9jCpnv/kisspng-business-company-building-organization-economy-5ac1d028b0b523-5689799215226511767238-min.png';
export function toDot(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function imageStorage(id: string) {
    return id ? API.image + '/' + id : IMAGE_PLACEHOLDER;
}

export function avatarStorage(id: string) {
    if (id.includes('file://') || id.includes('blob') || id.includes('http')) return id;
    return id ? API.image + '/' + id : AVATAR_IMAGE_PLACEHOLDER;
}

export function voucherStorage(id: string) {
    return id ? API.image + '/' + id : VOUCHER_IMAGE_PLACEHOLDER;
}

export function companyStorage(id: string) {
    return id ? API.image + '/' + id : COMPANY_IMAGE_PLACEHOLDER;
}

export function capitalize(str: string, all: boolean = false): string {
    if (all)
        return str
            .split(' ')
            .map((s) => capitalize(s))
            .join(' ');
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function randomUUID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
