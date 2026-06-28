import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import ListProductUseCase from './list.product.usecase';
import Product from '../../../domain/product/entity/product';

describe('Test list product use case', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should list all products', async () => {
    const productRepository = new ProductRepository();

    const product1 = new Product('p1', 'Product 1', 10);
    const product2 = new Product('p2', 'Product 2', 20);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const usecase = new ListProductUseCase(productRepository);

    const result = await usecase.execute();

    expect(result.products).toHaveLength(2);
    expect(result.products).toEqual(
      expect.arrayContaining([
        { id: 'p1', name: 'Product 1', price: 10 },
        { id: 'p2', name: 'Product 2', price: 20 },
      ]),
    );
  });
});
