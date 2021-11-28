const { QueryTypes } = require('sequelize');
const connect = require('../connect/connect.js')

class officeController {

    async createOffice(req, res) {
        if (!req.body.nameOffice) {
            res.status(400).json('Неверный формат данных')
            return
        }

        const newOffice = await connect.query('INSERT INTO offices (name) values (?) returning *',
            {
                replacements: [req.body.nameOffice],
                type: QueryTypes.SELECT
            })
        res.json(newOffice[0])
    };

    async updateOffice(req, res) {
        const {id, nameOffice} = req.body
        if (!id || !nameOffice) {
            res.status(400).json('Неверный формат данных')
            return
        }
        const office = await connect.query('UPDATE offices SET name = ? WHERE id = ? RETURNING *',
            {
                replacements: [nameOffice, id],
                type: QueryTypes.UPDATE
            })
        res.json(office[0])
    };

    async deleteOffice(req, res) {
        if (!req.body.officeId) {
            res.status(400).json('Неверный формат данных')
            return
        }
        connect.query('DELETE FROM offices WHERE id = ?', {
            replacements: [req.body.officeId],
            type: QueryTypes.DELETE
        })
    };

    async getOffice(req, res) {
        const office = await connect.query('select * from offices')
        res.json(office)
    };

    async getOneOffice(req, res) {
        if (!req.body.idOffice) {
            res.status(400).json('Неверный формат данных')
            return
        }

        const office = await connect.query('SELECT * FROM offices WHERE id = ?',  {
            replacements: [req.body.idOffice],
            type: QueryTypes.SELECT
        })
        res.json(office[0])
    };


}

module.exports = new officeController()
