exports.up = function (db, callback) {
  db.createTable(
    'products',
    {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      name: { type: 'string', notNull: true },
      price: { type: 'decimal', precision: 10, scale: 2, notNull: true },
      category: { type: 'string' }
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('products', callback);
};
