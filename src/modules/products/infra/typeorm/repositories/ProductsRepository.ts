import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const customer = this.ormRepository.create({
      name,
      price,
      quantity
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const findCustomer = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return findCustomer;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const findCustomer = await this.ormRepository.findOne(id);

    return findCustomer;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
  }
}

export default ProductsRepository;
