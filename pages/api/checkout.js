import { create } from "domain";
import { initMongoose } from "../../lib/mongoose";
import Product from "../../models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import Order from "../../models/Order";


export default async function handler(req, res) {
    await initMongoose();

    if(req.method !== "POST"){
        res.json("should be a post request, but it is not!");
        return;
    }

    const {email, name, address, city} = req.body;
    if(!email || !name || !address || !city) {
      return res.status(400).send("Please fill in all required fields.")
    }
    const productsIds = req.body.products.split(",");
    const uniqueIds = [...new Set(productsIds)];
    const products = await Product.find({_id:{$in:uniqueIds}}).exec();
      let line_items = []
    for(let productId of uniqueIds) {
      const quantity = productsIds.filter(id => id === productId).length;
      {console.log(quantity)}
      const product = products.find(p => p._id.toString() === productId);
      line_items.push({
        quantity,
        price_data: {
          currency: "EUR",
          product_data: {name:product.name},
          unit_amount: product.price * 100,
        }
      })
    }

    const order = await Order.create(
      {
        products: line_items,
        name,
        email,
        address,
        city,
        paid: 0
      }
    
    )
    
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {orderId: order._id.toString()}
      });
      res.redirect(303, session.url);

}