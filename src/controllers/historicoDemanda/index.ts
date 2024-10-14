import { HistoricoDemandaRepository } from '../../repositories/historicoDemandaRepository';
import { HistoricoDemandaService } from '../../services/historicoDemandaService';
import { HistoricoDemandaController } from './historicoDemandaController';

const historicoDemandaRepository = new HistoricoDemandaRepository();
const historicoDemandaService = new HistoricoDemandaService(
  historicoDemandaRepository,
);
const historicoDemandaController = new HistoricoDemandaController(
  historicoDemandaService,
)

export {
  historicoDemandaController,
  historicoDemandaService,
  historicoDemandaRepository,
}