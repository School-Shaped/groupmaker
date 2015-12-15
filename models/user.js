module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        googleId: {
            type: DataTypes.BIGINT,            
        },
        displayName: DataTypes.STRING        
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Class);                
            }
        }
    })

    return User
}