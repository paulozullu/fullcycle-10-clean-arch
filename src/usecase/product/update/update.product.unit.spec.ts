import ProductFactory from '../../../domain/product/factory/product.factory';
import UpdateProductUseCase from './update.product.usecase';

const product = ProductFactory.create('a', 'John Doe', 100);

const input = {
  id: product.id,
  name: 'John Updated',
  price: 200,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe('Unit test for product update use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it('should throw an error when product not found', async () => {
    const productRepository = MockRepository();
    productRepository.find.mockReturnValue(Promise.resolve(null));
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = productUpdateUseCase.execute({
      id: 'invalid_id',
      name: 'John Updated',
      price: 200,
    });

    expect(output).rejects.toThrow('Product not found');
  });
});
