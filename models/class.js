module.exports = function(sequelize, DataTypes) {
    var Class = sequelize.define('Class', {
        name: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {
                Class.belongsTo(models.User);                
                Class.hasMany(models.Student);
            }
        },
        tableName: "Classes"
    })

    return Class
}