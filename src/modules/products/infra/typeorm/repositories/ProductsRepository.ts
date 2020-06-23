import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';
import AppError from '@shared/errors/AppError';

interface IFindProducts {
  id: string;
  quantity: number
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
    const product = this.ormRepository.create({
      name,
      price,
      quantity
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[] | undefined> {
    // TODO
    const idList = products.map(product => product.id)
    const orderList = await this.ormRepository.find({ id: In(idList) })

    if (idList.length !== orderList.length) {
      throw new AppError('Missing product.')
    }

    return orderList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const idList = products.map(product => product.id)
    const productLists = await this.ormRepository.find({ id: In(idList) })

    if (!productLists) {
      throw new AppError('Product not found.')
    }

    productLists.map(productList => {
      products.map(product => {
        if (product.id === productList.id) {
          if (productList.quantity < product.quantity) {
            throw new AppError('There is no enoght product.')
          } else {
            const newQuantity = productList.quantity - product.quantity

            this.ormRepository.update(productList.id, {
              quantity: newQuantity
            })
          }
        }
      })
    })



    return productLists;

  }
}

export default ProductsRepository;
