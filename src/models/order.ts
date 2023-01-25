import Client from '../database';

export interface OrderProduct {
  product_id: number;
  quantity: number;
}

export interface BaseOrder {
  products: OrderProduct[];
  user_id: number;
  status: boolean;
}

export interface Order extends BaseOrder {
  id: number;
}

export class OrderStore {
  async getOrder(): Promise<Order[]> {
    try {
      const con = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const { rows } = await con.query(sql);
      const orderProductsSql =
        'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
      const orders = [];
      for (const order of rows) {
        const { rows: orderProductRows } = await con.query(orderProductsSql, [order.id]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }
      con.release();
      return orders;
    } catch (err) {
      throw new Error(`Could not get all orders of user.  ${err}`);
    }
  }

  async create(order: BaseOrder): Promise<Order> {
    const { products, status, user_id } = order;

    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const con = await Client.connect();
      const { rows } = await con.query(sql, [user_id, status]);
      const order = rows[0];
      const orderProductsSql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const orderProducts = [];

      for (const product of products) {
        const { product_id, quantity } = product;
        const { rows } = await con.query(orderProductsSql, [order.id, product_id, quantity]);
        orderProducts.push(rows[0]);
      }

      con.release();

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`);
    }
  }

  async read(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const con = await Client.connect();
      const { rows } = await con.query(sql, [id]);
      const order = rows[0];
      const orderProductsSql =
        'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
      const { rows: orderProductRows } = await con.query(orderProductsSql, [id]);
      con.release();
      return {
        ...order,
        products: orderProductRows,
      };
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`);
    }
  }

  async update(id: number, orderData: BaseOrder): Promise<Order> {
    const { products, status, user_id } = orderData;

    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const con = await Client.connect();
      const { rows } = await con.query(sql, [status, id]);
      const order = rows[0];
      const orderProductsSql =
        'UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
      const orderProducts = [];

      for (const product of products) {
        const { rows } = await con.query(orderProductsSql, [
          product.product_id,
          product.quantity,
          order.id,
        ]);
        orderProducts.push(rows[0]);
      }

      con.release();
      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Could not update order for user ${user_id}. ${err}`);
    }
  }

  async deleteOrder(id: number): Promise<Order> {
    try {
      const con = await Client.connect();
      const orderProductsSql = 'DELETE FROM order_products WHERE order_id=($1)';
      await con.query(orderProductsSql, [id]);
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const { rows } = await con.query(sql, [id]);
      const order = rows[0];
      con.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`);
    }
  }
}
