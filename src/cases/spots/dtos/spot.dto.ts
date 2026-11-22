export interface SpotDto {
  id: string;
  name: string;
  active: boolean;
}

export interface CreateSpotDto {
  name: string;
}

export interface UpdateSpotDto {
  name?: string;
  active?: boolean;
}
