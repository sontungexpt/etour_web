import { API_ENDPOINT } from '@/constant/api';
import axios from 'axios';

export const registerAdminFromCompany = async (data) => {
    try {
        const res = await axios.post(API_ENDPOINT.REGISTER, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};
