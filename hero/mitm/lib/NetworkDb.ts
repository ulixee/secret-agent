import * as Database from 'better-sqlite3';
import { Database as SqliteDatabase, Transaction } from 'better-sqlite3';
import SqliteTable from '@ulixee/commons/SqliteTable';
import Log from '@ulixee/commons/Logger';
import CertificatesTable from '../models/CertificatesTable';

const { log } = Log(module);

export default class NetworkDb {
  public readonly certificates: CertificatesTable;
  private db: SqliteDatabase;
  private readonly batchInsert: Transaction;
  private readonly saveInterval: NodeJS.Timeout;
  private readonly tables: SqliteTable<any>[] = [];

  constructor(baseDir: string) {
    this.db = new Database(`${baseDir}/network.db`);
    this.certificates = new CertificatesTable(this.db);
    this.saveInterval = setInterval(this.flush.bind(this), 5e3).unref();

    this.tables = [this.certificates];

    this.batchInsert = this.db.transaction(() => {
      for (const table of this.tables) {
        try {
          table.runPendingInserts();
        } catch (error) {
          log.error('NetworkDb.flushError', {
            sessionId: null,
            error,
            table: table.tableName,
          });
        }
      }
    });
  }

  public close(): void {
    if (this.db) {
      clearInterval(this.saveInterval);
      this.flush();
      this.db.close();
    }
    this.db = null;
  }

  public flush(): void {
    if (!this.db || this.db.readonly) return;
    this.batchInsert.immediate();
  }
}
