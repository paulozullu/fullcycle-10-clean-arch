import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import CreateProductUseCase from './create.product.usecase';
import Product from '../../../domain/product/entity/product';

describe('Test create product use case', () => {
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

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      type: 'a',
      name: 'Product 1',
      price: 50,
    };

    const result = await usecase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Product 1');
    expect(result.price).toBe(50);
  });
});
