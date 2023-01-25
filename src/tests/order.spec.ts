import {OrderStore } from '../models/order';


const orderStore = new OrderStore();


describe('Order Model', () => {
  it('should have an index method', () => {
    expect(orderStore.getOrder).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.read).toBeDefined();
  });

  it('should have a add method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(orderStore.deleteOrder).toBeDefined();
  });
});


