import { supabase } from './supabase';

export interface Exoplanet {
  disc_year: number;
  pl_name: string;
  hostname: string;
  sy_dist?: number;
  pl_rade?: number;
  pl_masse?: number;
}

export interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  media_type: string;
}

export interface EPICImage {
  image: string;
  date: string;
  caption?: string;
}

async function fetchFromProxy(endpoint: string, options?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('nasa-proxy', {
    body: { endpoint, options },
  });

  if (error) {
    throw new Error(`Failed to invoke nasa-proxy: ${error.message}`);
  }
  if (data.error) {
    throw new Error(`Proxy error for ${endpoint}: ${data.error}`);
  }
  return data;
}

export const nasaAPI = {
  async getAPOD() {
    return fetchFromProxy('apod');
  },

  async getNeoWs() {
    return fetchFromProxy('neows');
  },

  async getEONET() {
    return fetchFromProxy('eonet');
  },

  async getDONKI() {
    return fetchFromProxy('donki');
  },

  async getEPIC() {
    return fetchFromProxy('epic');
  },

  getEPICImageUrl(image: EPICImage) {
    const date = image.date.split(' ')[0].replace(/-/g, '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${image.image}.png`;
  },

  async getMarsRoverPhotos() {
    return fetchFromProxy('mars');
  },

  async getExoplanets(limit = 10) {
    const data: Exoplanet[] = await fetchFromProxy('exoplanet');
    return data.filter(p => p.disc_year).sort((a, b) => b.disc_year - a.disc_year).slice(0, limit);
  },

  async getTechport() {
    return fetchFromProxy('techport');
  },

  async getTechTransfer() {
    return fetchFromProxy('techtransfer');
  }
};

  

