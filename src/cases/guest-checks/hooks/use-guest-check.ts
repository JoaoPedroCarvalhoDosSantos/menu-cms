import { useQuery } from '@tanstack/react-query';
import { GuestCheckService } from '../services/guest-check.service';

// Comandas em aberto (item 3.4 do enunciado)
export function useOpenedGuestChecks() {
  return useQuery({
    queryKey: ['guest-checks', 'OPENED'],
    queryFn: () => GuestCheckService.listAll('OPENED'),
  });
}
