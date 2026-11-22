import type { SpotDto } from '@/cases/spots/dtos/spot.dto';

export type GuestCheckStatus = 'OPENED' | 'CLOSED';

export interface GuestCheckDto {
  id: string;
  createdAt: string;
  status: GuestCheckStatus;
  spot: SpotDto;
}
