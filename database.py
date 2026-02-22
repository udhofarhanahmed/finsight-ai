import sqlite3

class Database:
    def __init__(self, db_name):
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()

    def create_table(self, table_name, columns):
        columns_with_types = ', '.join([f'{col} {col_type}' for col, col_type in columns.items()])
        self.cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({columns_with_types});')
        self.connection.commit()

    def insert(self, table_name, data):
        columns = ', '.join(data.keys())
        placeholders = ', '.join('?' * len(data))
        self.cursor.execute(f'INSERT INTO {table_name} ({columns}) VALUES ({placeholders});', tuple(data.values()))
        self.connection.commit()

    def read(self, table_name, conditions=None):
        query = f'SELECT * FROM {table_name}'
        if conditions:
            query += ' WHERE ' + ' AND '.join([f'{key} = ?' for key in conditions.keys()])
            self.cursor.execute(query, tuple(conditions.values()))
        else:
            self.cursor.execute(query)
        return self.cursor.fetchall()

    def update(self, table_name, data, conditions):
        update_clause = ', '.join([f'{key} = ?' for key in data.keys()])
        condition_clause = ' AND '.join([f'{key} = ?' for key in conditions.keys()])
        query = f'UPDATE {table_name} SET {update_clause} WHERE {condition_clause};'
        self.cursor.execute(query, tuple(data.values()) + tuple(conditions.values()))
        self.connection.commit()

    def delete(self, table_name, conditions):
        condition_clause = ' AND '.join([f'{key} = ?' for key in conditions.keys()])
        query = f'DELETE FROM {table_name} WHERE {condition_clause};'
        self.cursor.execute(query, tuple(conditions.values()))
        self.connection.commit()

    def close(self):
        self.connection.close()