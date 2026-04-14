exports.up = function (db, callback) {
  db.createTable(
    'users',
    {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      first_name: { type: 'string', notNull: true },
      last_name: { type: 'string', notNull: true },
      password_digest: { type: 'string', notNull: true }
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('users', callback);
};
