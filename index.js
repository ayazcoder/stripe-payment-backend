const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")("sk_test_51OFUHJH4P3rnRvyQ4UGFmx0v06kkAFPg7ymSgEyL8O79EGBdeuW3ISBE9tyoRNL4U5okufE6Ecivfg7VAe2VDieC00yhyyVCiY")
const cors = require("cors")

app.use(express.json())
app.use(cors({ origin: '*' }))
app.post("/checkout", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items: req.body.items.map(item => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: (item.price) * 100,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: "http://localhost:3000/#/booknow",
            cancel_url: "http://localhost:3000/#/review",

        })
        res.json({ url: session.url })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})
app.listen(8000)