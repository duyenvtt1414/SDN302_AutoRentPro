import { listContracts } from '../services/contractService.js';

export async function getContracts(req, res) {
  try {
    const { status } = req.query;
    const contracts = await listContracts({ status });
    return res.json(contracts);
  } catch (err) {
    return res.status(500).json({
      error: { message: err.message, code: 'SERVER_ERROR' },
    });
  }
}

