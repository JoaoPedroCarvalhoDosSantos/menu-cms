import { isAxiosError } from 'axios';

// Extrai a mensagem de erro devolvida pela API NestJS (string ou lista de strings).
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (!error.response) return 'Não foi possível conectar à API.';
  }
  return 'Ocorreu um erro inesperado.';
}
