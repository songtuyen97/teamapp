const mongoose = require("../common/mongoose");
const config = require("config");
function addCheckoutToOrders(user, CheckoutAll, fn_result){
    if(!CheckoutAll || typeof CheckoutAll != 'object') return fn_result(false);
    Checkout = CheckoutAll.monan;
    if(typeof Checkout == 'object') {
        var orders = [];
        mongoose.model_dichvu.find({"role.name_role": "store"}).exec(function(err, stores) {
            if(err) fn_result(false);
            else {
                try{
                Checkout.forEach(function(elem_Checkout){
                    var trangThaiSameStore = false;  
                    stores.forEach(function(elem_Store) {
                        elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                            elem_Danhmuc.monan.forEach(function(elem_Monan) {
                                if(elem_Monan._id == elem_Checkout.id_monan) {
                                    var order = {};
                                    if(orders.length == 0) {
                                        var phonenumber = user.phonenumber;
                                        var ten = user.ten;
                                        try {
                                            if(CheckoutAll.phonenumber && CheckoutAll.phonenumber.trim().length != 0) phonenumber = CheckoutAll.phonenumber;
                                            if(CheckoutAll.ten && CheckoutAll.ten.trim().length != 0) ten = CheckoutAll.ten;
                                        } catch (error) {
                                            
                                        }
                                        order.tongtien = elem_Checkout.soluong * elem_Monan.gia;
                                        order.giodat = new Date();
                                        order.trangthai = "chuagiao";
                                        order.address = CheckoutAll.diachi;
                                        order.order_detail = [{
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                ten: elem_Monan.ten,
                                                id: elem_Monan._id
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        }]
                                        order.information = {
                                            ten: ten,
                                            id: user._id,
                                            phonenumber: phonenumber
                                        }
                                        order.dichvu = [{
                                            ten: elem_Store.dichvu.ten,
                                            id: elem_Store._id,
                                            phonenumber: elem_Store.dichvu.phonenumber
                                        }]
                                        orders.push(order);
                                        if(elem_Checkout === Checkout[Checkout.length - 1]) {
                                            createOrdersOfCheckout(orders, user, function(result) {
                                                if(!result) fn_result(false);
                                                else fn_result(true);
                                            })
                                        };
                                        return;
                                    }
                                    var index = 0;                                   
                                    orders.forEach(function(elem_Order) {
                                        if(elem_Order.dichvu[0].id == String(elem_Store._id)) {
                                            trangThaiSameStore = true;
                                            return;
                                        }
                                        index++;
                                    })
                                    if(trangThaiSameStore == false) {
                                        var phonenumber = user.phonenumber;
                                        var ten = user.ten;
                                        try {
                                            if(CheckoutAll.phonenumber && CheckoutAll.phonenumber.trim().length != 0) phonenumber = CheckoutAll.phonenumber;
                                            if(CheckoutAll.ten && CheckoutAll.ten.trim().length != 0) ten = CheckoutAll.ten;
                                        } catch (error) {
                                            
                                        }               
                                        order.tongtien = elem_Checkout.soluong * elem_Monan.gia;
                                        order.giodat = new Date();
                                        order.trangthai = "chuagiao";
                                        order.address = CheckoutAll.diachi;
                                        order.order_detail = [{
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                id: elem_Monan._id,
                                                ten: elem_Monan.ten
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        }]
                                        order.information = {
                                            ten: ten,
                                            id: user._id,
                                            phonenumber: phonenumber
                                        }
                                        order.dichvu = [{
                                            ten: elem_Store.dichvu.ten,
                                            id: elem_Store._id,
                                            phonenumber: elem_Store.dichvu.phonenumber
                                        }]
                                        orders.push(order);
                                        
                                    }else {
                                        var detail_Order = {
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                id: elem_Monan._id,
                                                ten: elem_Monan.ten
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        };
                                        orders[index].order_detail.push(detail_Order);
                                        orders[index].tongtien = orders[index].tongtien + detail_Order.tongtien;
                                        trangThaiSameStore = false;
                                    }                                                          
                                    if(elem_Checkout === Checkout[Checkout.length - 1]) {       
                                        createOrdersOfCheckout(orders, user, function(result) {
                                            if(!result) fn_result(false);
                                            else fn_result(true);
                                        })
                                    };
                                }
                            })
                        })
                    })
                }); 
                }catch(error){
                    fn_result(false);
                }
            }
        })           
    }else fn_result(false);
}
function createOrdersOfCheckout(orders, user, fn_result) {
    addOrderForStore(orders, function(result) {
        if(!result) fn_result(false);
        else {
            if(result.length != 0) {
                try{
                var phonenumber = user.phonenumber;
                var ten = user.ten;
                try {
                    if(orders[0].information.phonenumber) phonenumber = orders[0].information.phonenumber;
                    if(orders[0].information.ten) ten = orders[0].information.ten;          
                } catch (error) {
                }      
                console.log(phonenumber);
                var order = {};
                order.giodat = new Date();
                order.trangthai = "chuagiao";
                order.address = orders[0].address;
                order.order_detail = [];
                order.information = {
                    ten: ten,
                    id: user._id,
                    phonenumber: phonenumber
                };
                order.dichvu = [];
                var tongtien = 0;
                orders.forEach(function(elem_Order) {
                    elem_Order.order_detail.forEach(function(elem_OD) {
                        order.order_detail.push(elem_OD);
                    })
                    elem_Order.dichvu.forEach(function(elem_DV) {
                        order.dichvu.push(elem_DV);
                    })
                    tongtien += elem_Order.tongtien;
                })
                order.tongtien = tongtien;
                order.lienket = result;
                mongoose.model_order.create(order, function(err, result_Order){
                    mongoose.model_dichvu.findOneAndUpdate({_id: user._id}, {$push: {"information.order": result_Order._id}},
                    {safe: true, upsert: true, new : true}, function(err, result_2) {
                        if(err) fn_result(false);
                        else {
                            fn_result(true);
                        }
                    });
                })
                }catch(error){
                    fn_result(false);
                }
            }
        }
    })
}
function addOrderForStore(orders, fn_result) {
    var id_Orders = [];
    mongoose.model_order.collection.insert(orders, function(err, result) {
        if(err) fn_result(false);
        else {
            result.ops.forEach(function(elem_Order) {
                mongoose.model_dichvu.findOneAndUpdate({_id: elem_Order.dichvu[0].id}, {$push: {"dichvu.doanhthu.order": elem_Order._id}},
                {safe: true, upsert: true, new : true}, function(err, result_1) {
                    if(err) fn_result(false);
                });
            
                id_Orders.push(String(elem_Order._id));
            });
            fn_result(id_Orders);
        }
    })
}
var listOrder = [];
function getListOrder(id, page, fn_result) {
    mongoose.model_dichvu.findOne({_id : id}).select("information.order").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            mongoose.model_order.find({_id: {"$in": result.information.order}})
            .select("_id giodat trangthai address order_detail dichvu tongtien").exec(function(err, orders){
                if(err) fn_result(false);
                else {
                    // var rs_Order = [];
                    // orders.forEach(function(elem_Order) {
                    //     var data = {};
                    //     data.address = elem_Order.address;
                    //     var order_Detail = elem_Order.order_detail;
                    //     var ten_SoLuong_Monan = "";
                    //     // var soluong_Monan = null;
                    //     order_Detail.forEach(function(elem_OrderDetail) {
                    //         console.log(elem_OrderDetail.monan.ten)
                    //         ten_SoLuong_Monan += elem_OrderDetail.monan.ten +"- "+ elem_OrderDetail.soluong + " phần";
                    //         if(elem_OrderDetail !== order_Detail[order_Detail.length - 1]) ten_SoLuong_Monan += ", "; 
                    //     })
                    //     data.ten_monan = ten_SoLuong_Monan;
                    //     data.tongtien = elem_Order.tongtien;
                    //     data.trangthai = elem_Order.trangthai;
                    //     data._id = elem_Order._id;
                    //     data.giodat = elem_Order.giodat;
                    //     rs_Order.push(data);
                    // })
                    var fiveOrders = [];
                    if(page == 1 || listOrder.length == 0) listOrder = orders;
                    if(listOrder) {
                        if(listOrder.length >= page* config.get("paginate")){
                            for(i = (page - 1) *config.get("paginate"); i < page *config.get("paginate"); i++) {
                                fiveOrders.push(listOrder[i]);
                            }
                        }else {
                            for(i = (page - 1) *config.get("paginate"); i < listOrder.length; i++) {
                                fiveOrders.push(listOrder[i]);
                            }
                        }
                    }
                    fn_result(fiveOrders);
                }
            })
            
            
        }
    });
}
module.exports = {
    addCheckoutToOrders: addCheckoutToOrders,
    getListOrder: getListOrder
}