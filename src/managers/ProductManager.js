import { readFile, writeFile } from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = this._generateId(products);
        products.push(product);
        await this._saveProducts(products);
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...products[productIndex], ...updatedFields };
            products[productIndex] = updatedProduct;
            await this._saveProducts(products);
            return true;
        }
        return false;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        if (updatedProducts.length < products.length) {
            await this._saveProducts(updatedProducts);
            return true;
        }
        return false;
    }

    _generateId(products) {
        if (products.length === 0) {
            return 1;
        }
        const lastProductId = products[products.length - 1].id;
        return lastProductId + 1;
    }

    async _saveProducts(products) {
        const data = JSON.stringify(products);
        await writeFile(this.path, data);
    }
}

export default ProductManager;
