import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('cart.json');

router.post('/', async (req, res) => {
    try {
        const cart = req.body;
        await cartManager.createCart(cart);
        res.status(201).json({ message: 'Cart created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const result = await cartManager.addProductToCart(cartId, productId);

        if (result) {
            res.json({ message: 'Product added to cart successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found or Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
