import React, { useEffect, useState } from "react"
import { CartState } from "../context/Context";
import { ListGroup,Button ,Row,Col,Form,Image} from "react-bootstrap";
import Rating from "./Rating";
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'


const Cart = () => {
  const {state:{cart},dispatch} = CartState();

  const [total,setTotal] =useState();

  useEffect(() => {
    setTotal(cart.reduce((acc,curr)=> acc+Number(curr.price) * curr.qty,0));
  })



  const handleCheckout = async () => {
    const stripe = await loadStripe("pk_test_51PHX2WSELyXIcG9qx0D3rtrCLvB75bVuUUoflf0ge5buknY2xmVY3JUt4M70MAYk61Gjhqwu9zfwlmNLEjofKaVn00EMYyFvEg")

    const lineItems = cart.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // because stripe interprets price in cents
            },
            quantity: item.qty
        }
    })

    const { data } = await axios.post('http://localhost:5000/checkout', { lineItems })

   

    await stripe.redirectToCheckout({ sessionId: data.id })
}
  return (
  <div className="home">
    <div className="productContainer">
      <ListGroup>
        {
          cart.map((prod) => (
           <ListGroup.Item key={prod.id}>
            <Row>

            <Col md={2}>
                  <Image src={prod.image} alt={prod.name} fluid rounded />
                </Col>
              <Col md={2}>
                <span>{prod.name}</span>
              </Col>
              <Col md={2}>
              ₹ {prod.price}
              </Col>
              <Col md={2}>
              <Rating rating={prod.ratings}/>
              </Col>
              <Col md={2}>
                  <Form.Control
                    as="select"
                    value={prod.qty}
                    onChange={(e) =>
                      dispatch({
                        type: "CHANGE_CART_QTY",
                        payload: {
                          id: prod.id,
                          qty: e.target.value,
                        },
                      })
                    }
                  >
                    {[...Array(prod.inStock).keys()].map((x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: prod,
                      })
                    }
                  >
                    <AiFillDelete fontSize="20px" />
                  </Button>
                </Col>
            </Row>
           </ListGroup.Item>
          ))
        }
      </ListGroup>
    </div>
    <div className="filters summary">
      <span className="title"> subtotal ({cart.length}) items</span>
      <span style={{ fontWeight: 700, fontSize: 20 }}>Total: ₹ {total}</span>
        <Button type="button" disabled={cart.length === 0} onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
    </div>
  </div>
  
  )
};
export default Cart