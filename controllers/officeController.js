const connect = require('../connect/connect.js')

class officeController {

    async createOffice(req, res) {
        /*const name = req.body.nameOffice
        const newOffice = await connect.query('insert into offices (nameOffice) values ($1) returning *', [name])
        res.json(newOffice.rows[0])*/

    };

    async updateOffice(req, res) {
        /*const {id, name} = req.body
        const office = await connect.query('update offices set nameOffice = $1 where idOffice = $2 returning *', [name, id])
        res.json(office.rows[0])*/
    };

    async deleteOneOffice(req, res) {
        /*const id = req.params.idOffice
        const office = await connect.query('delete from offices where idOffice = $1', [id])
        res.json(office.rows[0])*/
    };

    async deleteOffice(req, res) {      
        /*const office = await connect.query('delete from offices')
        res.json(office.rows)*/
    };

    async getOffice(req, res) {
        /*const office = await connect.query('select * from offices')
        res.json(office.rows)*/
    };

    async getOneOffice(req, res) {
        /*const id = req.params.idOffice
        const office = await connect.query('select * from offices where idOffice = $1', [id])
        res.json(office.rows[0])*/
    };


}

module.exports = new officeController()