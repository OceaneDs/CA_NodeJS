const excel = require("node-xlsx");
const models = require('../models');
const Association = models.Association;
class ExcelParserHelper {

    static async parseExcelAndInsertInDatabase() {
        const res = excel.parse(process.env.uploadFile+'arup-2019.xlsx');
        //console.log(res[0].data[1][0]);
        const data = res[0].data;
        for(let i = 1; i < data.length; i++){
            const assoc = await Association.create({
                name:data[i][0],
               // description:data[i][2],
                description:" Pour l'instant la valeur est trop long on vverra comment faire après",
                city:data[i][4]
            });
        }
    }

}
module.exports = ExcelParserHelper;
