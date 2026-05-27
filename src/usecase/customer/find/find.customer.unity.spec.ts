import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository';
import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import FindCustomerUseCase from './find.customer.usecase';

const customer = new Customer('123', 'John Doe');
const address = new Address('Street 1', 123, 'Zipcode', 'City');
customer.changeAddress(address);

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(customer),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('Unit Test find customer use case', () => {
  it('should find a customer', async () => {
    const customerRepository = MockRepository();
    const usecase = new FindCustomerUseCase(customerRepository);

    const input = { id: '123' };
    const output = {
      id: '123',
      name: 'John Doe',
      address: {
        street: 'Street 1',
        number: 123,
        city: 'City',
        zip: 'Zipcode',
      },
    };

    const result = await usecase.execute(input);
    expect(result).toEqual(output);
  });

  it('should not find a customer', async () => {
    const customerRepository = MockRepository();
    customerRepository.find.mockRejectedValue(new Error('Customer not found'));
    const usecase = new FindCustomerUseCase(customerRepository);

    const input = { id: '123' };
    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow(new Error('Customer not found'));
  });
});
