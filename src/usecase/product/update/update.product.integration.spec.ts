import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import UpdateProductUseCase from './update.product.usecase';
import Product from '../../../domain/product/entity/product';

describe('Test update product use case', () => {
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

  it('should update a product', async () => {
    const productRepository = new ProductRepository();

    const product = new Product('u1', 'Old Name', 30);
    await productRepository.create(product);

    const usecase = new UpdateProductUseCase(productRepository);

    const input = { id: 'u1', name: 'New Name', price: 60 };

    const result = await usecase.execute(input);

    expect(result).toEqual({ id: 'u1', name: 'New Name', price: 60 });

    const updated = await productRepository.find('u1');
    expect(updated.name).toBe('New Name');
    expect(updated.price).toBe(60);
  });
});
