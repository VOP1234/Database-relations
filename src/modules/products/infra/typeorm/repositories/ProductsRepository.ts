import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

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
    console.log("Entrei no  findAllById -> ")

    let selectedProducts: Product[] = []

    const allProducts = await this.ormRepository.find();

    allProducts.map(allProduct => {
      products.map(product => {
        if (allProduct.id === product.id) {
          selectedProducts.push(allProduct)
        }
      })
    })

    return selectedProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const [quantity] = products

    const newProduct = {
      ...products,
      quantity
    }

    const product = this.ormRepository.create(newProduct);

    await this.ormRepository.save(product);

    return product;
  }
}

export default ProductsRepository;
