//初始化map存储购物车内的商品
const carts = new Map();
//初始化购物车内商品数量
const carts_quantity = new Map();
const app = new Vue({
    el: '#app',
    data: {
        goods: [
            {"id": 1, "product": "罗技M185鼠标", "price": 80, "colour": "黑色", "quantity": 893, "rate": 98},
            {"id": 2, "product": "微软键盘", "price": 150, "colour": "黑色", "quantity": 8888, "rate": 59},
            {"id": 3, "product": "苹果12Pro", "price": 8888, "colour": "蓝色", "quantity": 1000, "rate": 88}
        ],
        cart: [],
        price_array: [],
        total_price: 0.0
    },
    computed: {
        computedPrice: function () {
            let result = 0.0;
            for (let i = 0; i < this.cart.length; i++) {
                result += this.cart[i].price * this.cart[i].quantity;
            }
            return result;
        }
    },
    methods: {
        //添加到购物车
        addToCart: function (index) {
            //检查购物车内是否有该商品
            if (carts.get(app.goods[index].id) === undefined) {
                let good = app.goods[index];
                //克隆对象
                let target = JSON.parse(JSON.stringify(good));
                //对库存进行操作
                target.quantity = 1;
                good.quantity--;
                //将对象存储到cart数组
                app.cart.push(target);
                //将添加到购物车的商品添加到cartsMap中
                carts.set(good.id, good);
                carts_quantity.set(target.id, target.quantity);
            } else {
                //添加商品数量
                let good = app.goods[index];
                if (good.quantity !== 0){
                    for (let i = 0; i < this.cart.length; i++) {
                        if (this.cart[i].id === good.id) {
                            this.cart[i].quantity++;
                            good.quantity--;
                            carts_quantity.set(good.id, parseInt(this.cart[i].quantity));
                            carts_quantity.set(this.cart[i].id, this.cart[i].quantity);
                        }
                    }
                }
            }
        },
        addGood: function (index) {
            //库存
            let item = null;
            let qu = this.cart[index];
            $.each(app.goods, function (i, value) {
                if (value.id === qu.id) {
                    item = value;
                }
            })
            if (item.quantity > 0) {
                this.cart[index].quantity++;
                carts_quantity.set(item.id, this.cart[index].quantity);
                item.quantity--;
            }
        },
        subtractGood: function (index) {
            //库存
            let item = null;
            let qu = this.cart[index];
            $.each(app.goods, function (i, value) {
                if (value.id === qu.id) {
                    item = value;
                }
            })
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
                carts_quantity.set(item.id, this.cart[index].quantity);
                item.quantity++;
            }
        },
        removeToCart: function (id, index) {
            //对仓储还原
            let current_quantity = this.cart[index].quantity;
            carts.get(id).quantity += parseFloat(current_quantity);
            //删除购物车map中的数据，清空购物车数组
            carts.delete(id);
            this.cart.splice(index, 1);
        },
        changQuantity: function (id, quantity, index) {
            //判断是否修改过购物车
            if (carts_quantity.get(id) === undefined) {
                //判断添加的数量是否超过总数
                if (parseInt(quantity) > carts.get(id).quantity) {
                    this.cart[index].quantity = carts.get(id).quantity + 1;
                    //如果未修改过则添加到map中
                    carts_quantity.set(id, parseInt(this.cart[index].quantity));
                    carts.get(id).quantity = carts.get(id).quantity + 1 - this.cart[index].quantity;
                } else {
                    carts_quantity.set(id, parseInt(this.cart[index].quantity));
                    carts.get(id).quantity = carts.get(id).quantity + 1 - quantity;
                }
            } else {
                //如果添加的数量小于原有的数量
                if (carts_quantity.get(id) > parseInt(quantity)) {
                    //判断购买的的数值是否小于1
                    if (parseInt(quantity) < 1) {
                        this.cart[index].quantity = 1;
                        carts.get(id).quantity = (carts_quantity.get(id) - 1) + carts.get(id).quantity;
                        carts_quantity.set(id, 1);
                    } else {
                        //设置购物车商品数量为当前的值
                        this.cart[index].quantity = parseInt(quantity);
                        carts.get(id).quantity = (carts_quantity.get(id) - parseInt(quantity)) + carts.get(id).quantity;
                        carts_quantity.set(id, parseInt(quantity));
                    }
                } else if (carts_quantity.get(id) < parseInt(quantity)) {
                    //判断是否超出库存
                    if (parseInt(quantity) > (carts_quantity.get(id) + carts.get(id).quantity)) {
                        this.cart[index].quantity = carts_quantity.get(id) + carts.get(id).quantity;
                        carts.get(id).quantity = 0;
                        carts_quantity.set(id, parseInt(this.cart[index].quantity));
                    } else {
                        this.cart[index].quantity = parseInt(quantity);
                        carts.get(id).quantity = +carts.get(id).quantity - (parseInt(quantity) - carts_quantity.get(id));
                        carts_quantity.set(id, parseInt(quantity));
                    }
                }
            }
        },
        commit(price) {
            let action = confirm('您确定要付款吗？');
            if (action) {
                alert('进入支付流程，付款：' + price + '元')
            } else {
                alert('取消支付')
            }
        }

    },
    filters: {
        //格式化金钱
        formatPrice(price) {
            return "￥" + price.toFixed(2);
        },
        //格式化好评
        formatRate(rate) {
            return rate.toFixed(2) + "%";
        }
    }
})

