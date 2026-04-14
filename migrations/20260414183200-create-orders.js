exports.up = function (db, callback) {
  db.createTable(
    'orders',
    {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      user_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'orders_user_id_fk',
          table: 'users',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      status: { type: 'string', notNull: true },
      created_at: { type: 'timestamp', notNull: true, defaultValue: new String('now()') }
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('orders', callback);
};
