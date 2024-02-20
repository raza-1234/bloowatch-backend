
export const mockProduct = {
  title: "product 1",
  quantity: 5,
  price: "20$" 
}
export const mockCartProduct = {
  quantity: 3,
  userId: 1,
  productId: 1,
}

export const buildMockResponse = () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }
  return response;
}
