const ordinal = {
  'product': ['description', 'activeIngredient', 'route', 'storageConditions'],
  'license': ['licenseId', 'expiryDate', 'images'],
  'receivingRecord': ['orderCode', 'expectedDate', 'receivingDate', 'expectedQuantity', 'receivedQuantity', 'remarks', 'images', 'status']
};

const getOrdinal = (entityType) => {
  return ordinal[entityType]
}

module.exports = { getOrdinal };