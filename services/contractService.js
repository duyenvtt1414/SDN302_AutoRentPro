import { ContractModel } from '../models/Contract.js';

export async function listContracts({ status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  return ContractModel.find(filter).lean();
}
