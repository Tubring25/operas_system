var Sequelize = require('sequelize');

exports.sequelize = function () {
	return new Sequelize('steam_schema', 'root', '123456', {host: 'localhost', port:3306, logging:console.log});
}
