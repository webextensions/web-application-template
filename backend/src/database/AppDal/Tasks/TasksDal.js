class TasksDal {
    constructor({ sqliteDb }) {
        this.db = sqliteDb;
    }

    async createTable_taskCategories() {
        try {
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS taskCategories (
                    id        INTEGER          PRIMARY KEY AUTOINCREMENT,
                    title     TEXT    NOT NULL UNIQUE,
                    createdAt INTEGER NOT NULL
                )
            `);
            return [null, 'Success: Created table "taskCategories"'];
        } catch (e) {
            console.error('Error: Failed to create table "taskCategories"', e);
            return [e];
        }
    }

    async ensureIndexes() {
        const status = {};
        let encounteredError = false;

        try {
            const statement_createdAt = this.db.prepare(`SELECT name FROM sqlite_master WHERE type='index' AND name='taskCategories_createdAt'`);
            const result_createdAt = statement_createdAt.get();
            if (result_createdAt) {
                status['taskCategories_createdAt'] = 'ALREADY_EXISTS';
            } else {
                this.db.exec(`CREATE INDEX taskCategories_createdAt ON taskCategories (createdAt)`);
                status['taskCategories_createdAt'] = 'CREATED';
            }
        } catch (e) {
            encounteredError = true;
            console.error('Error in creating indexes for "taskCategories"', e);
        }

        if (encounteredError) {
            return [new Error('Error in creating indexes for "taskCategories"'), status];
        } else {
            return [null, status];
        }
    }

    async createCategory({ title, createdAt }) {
        try {
            const statement = this.db.prepare(`
                INSERT INTO taskCategories ( title,  createdAt)
                VALUES                     (@title, @createdAt)
            `);
            const result = statement.run({   title,  createdAt });
            return [null, result];
        } catch (e) {
            console.error(
                'Error in inserting into "taskCategories"',
                JSON.stringify({ title, createdAt }),
                e
            );
            return [e];
        }
    }

    async listCategories() {
        try {
            const statement = this.db.prepare(`SELECT * FROM taskCategories ORDER BY title ASC`);
            const result = statement.all();
            return [null, result];
        } catch (e) {
            console.error('Error: Failed to list records from table "taskCategories"', e);
            return [e];
        }
    }

    async countCategories() {
        try {
            const statement = this.db.prepare(`SELECT COUNT(*) AS count FROM taskCategories`);
            const result = statement.get();
            return [null, result.count];
        } catch (e) {
            console.error('Error: Failed to count records in table "taskCategories"', e);
            return [e];
        }
    }

    async deleteCategories({ id }) {
        try {
            // `LIMIT 1` is not required as such. Keeping it for safety for future changes.
            const statement = this.db.prepare(`DELETE FROM taskCategories WHERE id = ? LIMIT 1`);
            const result = statement.run(id);
            const recordsDeletedCount = result.changes;
            return [null, recordsDeletedCount];
        } catch (e) {
            console.error('Error: Failed to delete record from table "taskCategories"', id, e);
            return [e];
        }
    }
}

export { TasksDal };
