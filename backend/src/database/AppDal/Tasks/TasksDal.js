class TasksDal {
    constructor({ sqliteDb }) {
        this.db = sqliteDb;
    }

    async createTable_taskCategories() {
        try {
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS taskCategories (
                    id        INTEGER          PRIMARY KEY AUTOINCREMENT,
                    userUuid  TEXT    NOT NULL,
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

    async ensureIndexes_taskCategories() {
        const status = {};
        let encounteredError = false;

        try {
            const statement_userUuid = this.db.prepare(`SELECT name FROM sqlite_master WHERE type='index' AND name='taskCategories_userUuid'`);
            const result_userUuid = statement_userUuid.get();
            if (result_userUuid) {
                status['taskCategories_userUuid'] = 'ALREADY_EXISTS';
            } else {
                this.db.exec(`CREATE INDEX taskCategories_userUuid ON taskCategories (userUuid)`);
                status['taskCategories_userUuid'] = 'CREATED';
            }

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
            console.error('Error: Failed to create indexes for "taskCategories"', e);
        }

        if (encounteredError) {
            return [new Error('Error: Failed to create indexes for "taskCategories")'), status];
        } else {
            return [null, status];
        }
    }

    async createCategory({ userUuid, title, createdAt }) {
        try {
            const statement = this.db.prepare(`
                INSERT INTO taskCategories ( userUuid,  title,  createdAt)
                VALUES                     (@userUuid, @title, @createdAt)
            `);
            const result = statement.run({   userUuid,  title,  createdAt });
            return [null, result];
        } catch (e) {
            console.error(
                'Error: Failed to insert into "taskCategories"',
                JSON.stringify({ title, createdAt }),
                e
            );
            return [e];
        }
    }

    async listCategories({ userUuid }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM taskCategories WHERE userUuid = ? ORDER BY title ASC`);
            const result = statement.all(userUuid);

            return [null, result];
        } catch (e) {
            console.error('Error: Failed to list records from table "taskCategories"', e);
            return [e];
        }
    }

    async countCategories({ userUuid }) {
        try {
            const statement = this.db.prepare(`SELECT COUNT(*) AS count FROM taskCategories WHERE userUuid = ?`);
            const result = statement.get(userUuid);
            return [null, result.count];
        } catch (e) {
            console.error('Error: Failed to count records in table "taskCategories"', e);
            return [e];
        }
    }

    async deleteCategories({ userUuid, taskCategoryId }) {
        try {
            // `LIMIT 1` is not required as such. Keeping it for safety for future changes.
            const statement = this.db.prepare(`DELETE FROM taskCategories WHERE id = ? AND userUuid = ? LIMIT 1`);
            const result = statement.run(taskCategoryId, userUuid);
            const recordsDeletedCount = result.changes;
            return [null, recordsDeletedCount];
        } catch (e) {
            console.error('Error: Failed to delete record from table "taskCategories"', taskCategoryId, e);
            return [e];
        }
    }
}

export { TasksDal };
