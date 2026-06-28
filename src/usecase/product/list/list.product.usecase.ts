import Product from '../../../domain/product/entity/product';
import ProductB from '../../../domain/product/entity/product-b';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import { OutputListProductDto } from './list.product.dto';

export default class ListProductUseCase {
  private productRepository: ProductRepositoryInterface;
  constructor(ProductRepository: ProductRepositoryInterface) {
    this.productRepository = ProductRepository;
  }

  async execute(): Promise<OutputListProductDto> {
    const products = await this.productRepository.findAll();
    return OutputMapper.toOutput(products);
  }
}

class OutputMapper {
  static toOutput(product: (Product | ProductB)[]): OutputListProductDto {
    return {
      products: product.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      })),
    };
  }
}
