export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const delete_product = productId => {
  return {
    type: DELETE_PRODUCT,
    pid: productId
  };
};