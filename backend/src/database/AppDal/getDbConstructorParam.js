import Database from 'better-sqlite3';

const getDbConstructorParam = async function ({
    sqliteDbPath
}) {
    const sqliteDb = new Database(sqliteDbPath);
    sqliteDb.pragma('journal_mode = WAL');

    return { sqliteDb };
};

export { getDbConstructorParam };
