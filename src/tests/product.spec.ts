import { BaseProduct, Product, ProductStore } from '../models/product';

const productStore = new ProductStore();



  async function deleteProduct(id: number) {
    return productStore.deleteProduct(id);
  }

  it('should have an index method', () => {
    expect(productStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(productStore.read).toBeDefined();
  });

  it('should have a add method', () => {
    expect(productStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(productStore.deleteProduct).toBeDefined();
  });

  

