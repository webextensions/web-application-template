import Database from 'better-sqlite3';

const getUsersConstructorParam = async function ({
    sqliteDbPath
}) {
    const sqliteDb = new Database(sqliteDbPath);
    sqliteDb.pragma('journal_mode = WAL');

    return { sqliteDb };
};

export { getUsersConstructorParam };
