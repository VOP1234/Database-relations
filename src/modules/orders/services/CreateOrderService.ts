import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProductService {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProductService[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id)

    if (!customer) {
      throw new AppError('Customer not find.')
    }
    console.log('execute -> ',products)
    const allProduct = this.productsRepository.findAllById(products)


    if (!allProduct) {
      throw new AppError('Products not find.')
    }

    const order = await this.ordersRepository.create({
      customer,
      products
    })

    return order
  }
}

export default CreateOrderService;
