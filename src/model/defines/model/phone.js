import Sequelize from 'sequelize';

export default {
    name: 'phone',
    description: {
        id: {
            type: Sequelize.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: Sequelize.STRING(11)
        },
        blockNum: {
            type: Sequelize.BIGINT(11)
        }
    }
};
