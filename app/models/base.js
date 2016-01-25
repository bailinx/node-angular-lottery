function base(model) {
    this.model = model || {};

    // 新增
    this.model.prototype.create = function (doc, callback) {
        this.model.create(doc, function (error, model) {
            if (error) return callback(error, null);
            return callback(null, model);
        });
    };

    // 查询
    this.model.prototype.getById = function (id, callback) {
        this.model.findOne({_id: id}, function (error, model) {
            if (error) return callback(error, null);
            return callback(null, model);
        });
    };

    // 获取单条数据
    this.model.prototype.getSingle = function (query, callback) {
        this.model.findOne(query, function (error, model) {
            if (error) return callback(error, null);
            return callback(null, model);
        });
    }

    // 获取总数
    this.model.prototype.countByQuery = function (query, callback) {
        this.model.count(query, function (error, model) {
            if (error) return callback(error, null);
            return callback(null, model);
        });
    };

    // 条件查询
    this.model.prototype.getByQuery = function (query, fileds, opt, callback) {
        this.model.find(query, fileds, opt, function (error, model) {
            if (error) return callback(error, null);

            return callback(null, model);
        });
    };

    // 查询所有
    this.model.prototype.getAll = function (callback) {
        this.model.find({}, function (error, model) {
            if (error) return callback(error, null);

            return callback(null, model);
        });
    };

    // 删除
    this.model.prototype.delete = function (query, callback) {
        this.model.remove(query, function (error) {
            if (error) return callback(error);

            return callback(null);
        });
    };

    // 更新
    this.model.prototype.update = function (conditions, update, options, callback) {
        this.model.update(conditions, update, options, function (error) {
            if (error) return callback(error);
            return callback(null);
        });
    };

    return this.model;
}


module.exports = base;