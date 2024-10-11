import { EmpresaRepository } from '../../repositories/empresaRepository';
import { EmpresaService } from '../../services/empresaService';
import { EmpresaController } from './empresaController';

const empresaRepository = new EmpresaRepository();
const empresaService = new EmpresaService(
  empresaRepository,
);
const empresaController = new EmpresaController(
  empresaService,
);

export {
  empresaController,
  empresaService,
  empresaRepository,
}