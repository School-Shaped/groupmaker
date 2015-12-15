module.exports = function(sequelize, DataTypes) {
    var Student = sequelize.define('Student', {
        name: {
            type: DataTypes.STRING
        },
        male: {
            type: DataTypes.BOOLEAN
        },
        speed: {
            type: DataTypes.INTEGER
        },
        behavior: {
            type: DataTypes.INTEGER
        },
        leadership: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function(models) {
                Student.belongsTo(models.Class);                
            }
        }        
    })

    return Student
}