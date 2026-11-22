import { api } from '@/lib/axios';
import type { CreateSpotDto, SpotDto, UpdateSpotDto } from '../dtos/spot.dto';

const ENDPOINT = '/spots';

export const SpotService = {
  async listAll(): Promise<SpotDto[]> {
    const result = await api.get<SpotDto[]>(ENDPOINT);
    return result.data;
  },

  async findOne(id: string): Promise<SpotDto> {
    const result = await api.get<SpotDto>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async create(dto: CreateSpotDto): Promise<SpotDto> {
    const result = await api.post<SpotDto>(ENDPOINT, dto);
    return result.data;
  },

  async update(id: string, dto: UpdateSpotDto): Promise<SpotDto> {
    const result = await api.patch<SpotDto>(`${ENDPOINT}/${id}`, dto);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
