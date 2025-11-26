// VARIABLE VNPAY
const secretArray = {
  vnp_TmnCode: "CS2TOYXS",
  vnp_HashSecret: "PM9V1IDB6LMRQ12BTNI788D90QOSP0CH",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:8888/order/vnpay_return",
};

const express = require("express");

const bodyParser = require("body-parser");
const moment = require("moment");
const cors = require("cors");
const axios = require("axios");

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/create_payment", (req, res) => {
  let amount = Number(req.body.amount);
  amount += 30000;
  let userId = req.body.user_id;
  let receiver_name = req.body.receiver_name; //DB
  let receiver_phone = req.body.receiver_phone; //DB
  let receiver_address = encodeURIComponent(req.body.receiver_address); //DB

  let encoded_name = encodeURIComponent(receiver_name);
  let encoded_address = encodeURIComponent(receiver_address);
  let encoded_phone = encodeURIComponent(receiver_phone);
  // process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.remoteAddress ||
    req.socket.remoteAddress ||
    req.socket.remoteAddress;

  let tmnCode = secretArray.vnp_TmnCode;
  let secretKey = secretArray.vnp_HashSecret;
  let vnpUrl = secretArray.vnp_Url;
  let returnUrl =
    secretArray.vnp_ReturnUrl +
    `?user_id=${userId}&name=${encoded_name}&address=${encoded_address}&phone=${encoded_phone}`;

  let orderId = moment(date).format("DDHHmmss");
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  // if (bankCode !== null && bankCode !== "") {
  //   vnp_Params["vnp_BankCode"] = bankCode;
  // }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl);
});

router.get("/order/vnpay_return", (req, res) => {
  //   res.json(req.query);
  let amount = req.query.vnp_Amount;
  let userId = req.query.user_id; //DB
  let orderCode = generateOrderCode(); //DB
  let receiver_name = decodeURIComponent(req.query.name); //DB
  let receiver_phone = decodeURIComponent(req.query.phone); //DB
  let receiver_address = decodeURIComponent(req.query.address); //DB
  //   let receiver_name = "Lê Minh Quốc Bảo"; //DB
  //   let receiver_phone = "0939625549"; //DB
  //   let receiver_address = "Cần Thơ"; //DB
  let order_date = getOrderDateISO(); //DB
  let status = "Processing"; //DB

  let userCurrent = [];
  let cartList = [];
  let cartCurrent = [];

  let productList = [];

  if (req.query.vnp_TransactionStatus == "00") {
    axios.get(`http://localhost:3000/users/${userId}`).then((response) => {
      if (response.status == 200) {
        userCurrent = response.data;

        axios.get("http://localhost:3000/carts").then((cartRes) => {
          if (cartRes.status == 200) {
            axios.get(`http://localhost:3000/products`).then((proRes) => {
              if (proRes.status == 200) {
                productList = proRes.data;
                cartList = cartRes.data;

                cartCurrent = cartList.find((item) => item.user_id == userId);

                let itemsToCreate = [];

                if (cartCurrent) {
                  cartCurrent.items.forEach((cartItem) => {
                    let proCurrent = productList.find(
                      (proItem) => proItem.id == cartItem.product_id
                    );

                    if (proCurrent) {
                      let variants = proCurrent.variants;

                      let variantCurrent = variants.find(
                        (vari) => vari.variant_id == cartItem.variant_id
                      );

                      if (variantCurrent) {
                        let unitPrice =
                          proCurrent.base_price + variantCurrent.price_modifier;

                        let newItem = {
                          product_id: proCurrent.id,
                          variant_id: variantCurrent.variant_id,
                          product_name: proCurrent.name,
                          image_url: proCurrent.image_url,
                          quantity: cartItem.quantity,
                          unit_price: unitPrice,
                          total_price: unitPrice * cartItem.quantity,
                        };

                        itemsToCreate.push(newItem);
                      }
                    }
                  });
                }

                // Push Vô DB
                let objectToPost = {
                  order_id: orderCode,
                  user_id: userId,
                  receiver_name: receiver_name,
                  receiver_phone: receiver_phone,
                  receiver_address: receiver_address,
                  order_date: order_date,
                  status: status,
                  items: itemsToCreate,
                  shipping_fee: 30000,
                  grand_total: Number(amount) / 100,
                };

                axios
                  .post("http://localhost:3000/orders", objectToPost)
                  .then((postRes) => {
                    if (postRes.status == 201) {
                      let cartUpdate = {
                        user_id: userId,
                        items: [],
                      };
                      axios
                        .put(
                          "http://localhost:3000/carts/" + cartCurrent.id,
                          cartUpdate
                        )
                        .then((putRes) => {
                          if (putRes.status == 200) {
                            res.render(
                              "payment_success",
                              (data = objectToPost)
                            );
                          }
                        });
                    }
                  })
                  .catch((err) => console.error(err));
              }
            });
          }
        });
      }
    });
  } else {
    res.render("payment_error");
  }
});

function generateOrderCode() {
  const now = new Date();

  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  const orderCode = `ORD${day}${month}${year}${hour}${minute}${second}`;

  return orderCode;
}

function getOrderDateISO() {
  const now = new Date();

  let isoString = now.toISOString();

  isoString = isoString.substring(0, isoString.indexOf(".")) + "Z";

  return isoString;
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;
