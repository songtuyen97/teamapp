const mogoose = require("../common/mongoose");

function getListDoanhThu(fn_result) {
    mogoose.model_dichvu.find({"role.name_role":"store"}).select("dichvu.doanhthu dichvu.ten information").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var listdoanhthu = [];
            var index = 0;
            result.forEach(function(elem_result) {
                var doanhthu = elem_result.dichvu.doanhthu;
                mogoose.model_order.find({_id: {"$in": doanhthu.order}, trangthai:"dagiao"}, function(err, orders) {
                    if(err) fn_result(false);
                    else {   
                        index++;     
                        tongtien = 0;
                        if(doanhthu.tongdoanhthu != undefined) tongtien = doanhthu.tongdoanhthu;                       
                        var data = {
                            _id: elem_result._id,
                            ten: elem_result.dichvu.ten,
                            ten_chu_quan: elem_result.information.name,
                            soluongorder: orders.length,
                            tongtien: tongtien
                        }
                        listdoanhthu.push(data);
                        if(index == result.length) fn_result(listdoanhthu);
                    }
                    
                })
            })
            
        }
    })
}
module.exports = {
    getListDoanhThu: getListDoanhThu
}