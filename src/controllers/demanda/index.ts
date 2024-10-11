import { DemandaRepository } from '../../repositories/demandaRepository';
import { DemandaService } from '../../services/demandaService';
import { DemandaController } from './demandaController';

const demandaRepository = new DemandaRepository();
const demandaService = new DemandaService(
  demandaRepository,
);
const demandaController = new DemandaController(
  demandaService,
);

export {
  demandaController,
  demandaService,
  demandaRepository,
}