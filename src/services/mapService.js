import axios from 'axios';

const BASE_URL = 'https://clean-rochette-ricardozanandrea-57ed8226.koyeb.app/ws/point';



export async function getPoints(token) {
  try {
    console.log('Getting points with token:', token ? 'Token exists' : 'No token');
    console.log('GET URL:', BASE_URL);
    
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    });

    console.log('GET Response status:', response.status);
    console.log('GET Response data:', response.data);

    // Mocked response
    /*
    const response = {
      status: 200,
      data: [
      {
        id: 1,
        descricao: 'Avenida Paulista',
        latitude: -23.561684,
        longitude: -46.656139,
      },
      {
        id: 2,
        descricao: 'Parque Ibirapuera',
        latitude: -23.587416,
        longitude: -46.657634,
      },
      {
        id: 3,
        descricao: 'Mercadão Municipal',
        latitude: -23.541212,
        longitude: -46.627684,
      },
      {
        id: 4,
        descricao: 'Estação da Luz',
        latitude: -23.536578,
        longitude: -46.633309,
      },
      ],
    };
    */

    // o objeto response.data possui os campos latitude e longitude mas precisamos mudar os nomes para lat lng
    const points = response.data.map(point => ({
      id: point.id,
      title: point.description,
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
    }));

    if (response.status === 200) {
      return points;
    } else {
      throw new Error('Erro ao buscar pontos');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pontos');
  }
}

export async function postPoint(token, pointData) {
  try {
    console.log('Sending point data:', pointData);
    console.log('Using token:', token ? 'Token exists' : 'No token');
    console.log('API URL:', BASE_URL);
    
    // Let's test the API endpoint first
    console.log('Testing API connectivity...');
    
    const response = await axios.post(BASE_URL, pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 second timeout
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response headers:', response.headers);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Erro de rede - verifique sua conexão ou tente novamente');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout - servidor demorou para responder');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Token inválido ou expirado');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Acesso negado');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Erro no servidor');
    }
    
    throw new Error(error.response?.data || error.message || 'Erro ao cadastrar ponto');
  }
}