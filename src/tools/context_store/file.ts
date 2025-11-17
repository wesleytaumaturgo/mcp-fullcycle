import { ContextStore } from '../../types';
import { logger } from '../logger';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Implementação baseada em arquivo do armazenamento de contexto.
 * Persiste dados em arquivos JSON no diretório especificado.
 */
export class FileContextStore implements ContextStore {
  private baseDir: string;

  constructor(baseDir = './context') {
    this.baseDir = baseDir;
  }

  private getFilePath(key: string): string {
    return path.join(this.baseDir, `${key}.json`);
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      const filePath = this.getFilePath(key);
      const data = JSON.stringify(value, null, 2);
      await fs.writeFile(filePath, data, 'utf-8');
      logger.debug({ key, filePath }, 'Contexto armazenado em arquivo');
    } catch (error) {
      logger.error(error as Error, 'Erro ao armazenar contexto em arquivo');
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const filePath = this.getFilePath(key);
      const data = await fs.readFile(filePath, 'utf-8');
      const value = JSON.parse(data);
      logger.debug({ key, filePath }, 'Contexto recuperado do arquivo');
      return value;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.debug({ key }, 'Contexto não encontrado no arquivo');
        return undefined;
      }
      logger.error(error as Error, 'Erro ao recuperar contexto do arquivo');
      throw error;
    }
  }

  async purge(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
      logger.debug({ key, filePath }, 'Contexto removido do arquivo');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        logger.error(error as Error, 'Erro ao remover contexto do arquivo');
        throw error;
      }
    }
  }
}
