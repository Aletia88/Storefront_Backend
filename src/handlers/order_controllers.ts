import { Application, Request, Response } from 'express';
import { verifyToken } from '../../middlewares/verfication';
import { Order, OrderProduct, OrderStore } from '../models/order';

const OrderStoreInstance = new OrderStore();

const index = async (req: Request, res: Response) => {
  try {
    const orders: Order[] = await OrderStoreInstance.getOrder();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;

    if (!products || !status || !user_id) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :products, :status, :user_id'
      );
      return false;
    }

    const order: Order = await OrderStoreInstance.create({
      products,
      status,
      user_id,
    });

    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }

    const order: Order = await OrderStoreInstance.read(id);
    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;

    if (!products || !status || !user_id || !id) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :products, :status, :user_id, :id'
      );
      return false;
    }

    const order: Order = await OrderStoreInstance.update(id, {
      products,
      status,
      user_id,
    });

    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }

    await OrderStoreInstance.deleteOrder(id);

    res.send(`Order with id ${id} successfully deleted.`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

export default function orderRoutes(app: Application) {

  // Get all completed orders by user id
  app.get('/orders', index);

  // create order
  app.post('/orders/create', verifyToken, create);
  app.get('/orders/:id', verifyToken, read);

  // Update order's status.
  app.put('/orders/:id', verifyToken, update);

  // delete order by order id
  app.delete('/orders/:id', verifyToken, deleteOrder);
}
