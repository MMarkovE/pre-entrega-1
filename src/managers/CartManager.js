import { readFile, writeFile } from 'fs/promises';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart(cart) {
        const carts = await this.getCarts();
        cart.id = this._generateId(carts);
        carts.push(cart);
        await this._saveCarts(carts);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const existingProduct = cart.products.find(product => product.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            await this._saveCarts(carts);
            return true;
        }
        return false;
    }

    async getCarts() {
        try {
            const data = await readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    _generateId(carts) {
        if (carts.length === 0) {
            return 1;
        }
        const lastCartId = carts[carts.length - 1].id;
        return lastCartId + 1;
    }

    async _saveCarts(carts) {
        const data = JSON.stringify(carts);
        await writeFile(this.path, data);
    }
}

export default CartManager;
