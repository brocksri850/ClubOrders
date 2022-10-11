import { models } from "../models/model";
import commonService from "./commonService";
import async = require("async");
import _ = require("lodash");

export interface EntityAttributes { }

export class ClubOrderRouter {

    public clubOrderImport(req: any, callback: Function) {

        var data: any = req.body;

        async.waterfall([
            function (waterfallCallback: Function) {
                async.parallel({
                    customerDetails: function (parallelCallback: Function) {
                        commonService.findAll({ where: {} }, models.Customer, function (err: Error, response: any) {
                            parallelCallback(err, response)
                        })
                    },
                    productDetails: function (parallelCallback: Function) {
                        commonService.findAll({ where: {} }, models.Product, function (err: Error, response: any) {
                            parallelCallback(err, response);
                        })
                    },
                    orderDetails: function (parallelCallback: Function) {
                        commonService.findAll({ where: {} }, models.OrderDetail, function (err: Error, response: any) {
                            parallelCallback(err, response);
                        })
                    },
                }, function (err, response) {
                    waterfallCallback(err, response);
                })
            },
            function (Details: any, waterfallCallback: Function) {

                var customers = Details.customerDetails;
                var products = Details.productDetails;
                var orders = Details.orderDetails;
                var resArray = [];

                resArray = clubOrderService.clubTable(orders, products, "product_id");
                resArray = clubOrderService.clubTable(resArray, customers, "customer_id");
                waterfallCallback(null, resArray);
            },
            function (clubOrders: any, waterfallCallback: Function) {

                const xl = require('excel4node');
                const wb = new xl.Workbook();
                const ws = wb.addWorksheet('Worksheet Name');

                const headingColumnNames = [
                    "customer_id",
                    "product_id",
                    "order_id",
                    "first_name",
                    "last_name",
                    "price",
                    "product_name",
                    "total_amount",
                ]

                let headingColumnIndex = 1;
                headingColumnNames.forEach(heading => {
                    ws.cell(1, headingColumnIndex++)
                        .string(heading)
                });

                let rowIndex = 2;
                clubOrders.forEach(record => {
                    let columnIndex = 1;
                    Object.keys(record).forEach(columnName => {
                        ws.cell(rowIndex, columnIndex++)
                            .string(record[columnName])
                    });
                    rowIndex++;
                });
                // wb.write('cluborder.xlsx');
                waterfallCallback(null, wb.write('cluborder.xlsx'))
            }
        ], function (err, result) {
            callback(err, result)
        })
    }


    public clubTable(array1 = [], array2 = [], key = '') {
        var newArray = [];
        array1.forEach(element => {
            array2.forEach(element1 => {
                if (element[key] == element1[key]) {
                    var newObj = { ...element, ...element1 }
                    newArray.push(newObj);
                }
            })
        })
        return newArray;
    }

}

export const clubOrderService = new ClubOrderRouter()
export default clubOrderService