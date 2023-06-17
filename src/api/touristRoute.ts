import { API_ENDPOINT } from '@/constant/api';
import apiInstance from './instance';

export async function deleteTouristRouteAPI(id: string) {
    const response = await apiInstance.delete(`${API_ENDPOINT.DELETE_TOURIST_ROUTE}/${id}`);
    return response.data;
}
