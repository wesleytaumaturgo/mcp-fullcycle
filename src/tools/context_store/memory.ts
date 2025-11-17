import { ContextStore } from '../../types';
import { logger } from '../logger';

/**
 * Implementação em memória do armazenamento de contexto.
 * Armazena dados temporariamente na memória do processo.
 */
export class MemoryContextStore implements ContextStore {
  private store = new Map<string, any>();

  async set(key: string, value: any): Promise<void> {
    try {
      this.store.set(key, value);
      logger.debug({ key }, 'Contexto armazenado em memória');
    } catch (error) {
      logger.error(error as Error, 'Erro ao armazenar contexto em memória');
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const value = this.store.get(key);
      logger.debug({ key, found: value !== undefined }, 'Contexto recuperado da memória');
      return value;
    } catch (error) {
      logger.error(error as Error, 'Erro ao recuperar contexto da memória');
      throw error;
    }
  }

  async purge(key: string): Promise<void> {
    try {
      this.store.delete(key);
      logger.debug({ key }, 'Contexto removido da memória');
    } catch (error) {
      logger.error(error as Error, 'Erro ao remover contexto da memória');
      throw error;
    }
  }
}
