import axios from './axios';
import { Publication, PublicationInput } from './publication';

const createPublication = async (publicationData: PublicationInput, token: string): Promise<Publication> => {
    const response = await axios.post<Publication>('/publications', publicationData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getPublications = async (token: string): Promise<Publication[]> => {
    const response = await axios.get<Publication[]>('/publications', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const deletePublication = async (uuid: string, token: string): Promise<void> => {
    await axios.delete(`/publication/${uuid}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const updatePublication = async (uuid: string, publicationData: Publication, token: string): Promise<Publication> => {
    const response = await axios.put(`/publication/${uuid}`, publicationData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};


export { createPublication, getPublications, deletePublication, updatePublication };
