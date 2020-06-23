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

    const productsIds = products.map(product => {
      return { id: product.id }
    })

    const productsData = await this.productsRepository.findAllById(productsIds)

    if (!productsData) {
      throw new AppError('Products not find.')
    }

    const productsSelected = productsData.map(productData => {
      const productsSelected = products.find(
        productFind => productFind.id === productData.id,
      )

      return {
        product_id: productData.id,
        price: productData.price,
        quantity: productsSelected?.quantity || 0,
      }
    })

    await this.productsRepository.updateQuantity(products)

    const order = await this.ordersRepository.create({
      customer,
      products: productsSelected
    })

    return order
  }
}

export default CreateOrderService;
