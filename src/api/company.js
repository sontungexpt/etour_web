import { API_ENDPOINT } from '@/constant/api';
import axios from 'axios';
import apiInstance from './instance';

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

export const updateCompanyInformation = async (data, id) => {
    try {
        const res = await apiInstance.put(`${API_ENDPOINT.COMPANY}/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};
