import { QueryRunner } from 'typeorm';
import { HistoricoDemandaSalvarDTO } from '../controllers/historicoDemanda/dtos/HistoricoDemandaSalvarDTO';
import { HistoricoDemandaRepository } from '../repositories/historicoDemandaRepository';
import { HistoricoDemandaRetornoDTO } from '../controllers/historicoDemanda/dtos/HistoricoDemandaRetornoDTO';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';
import { demandaService } from '../controllers/demanda';
import { usuarioService } from '../controllers/usuario';
import { HistoricoDemanda } from '../models/HistoricoDemanda';
import { Demanda } from '../models/Demanda';
import { Empresa } from '../models/Empresa';
import { isString, isValidNumber, isValidString } from '../utils/validators';
import { Usuario } from '../models/Usuario';
import { DemandaStatus } from '../enums/DemandaStatus';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { RequestError } from '../utils/RequestError';
import { DemandaListagemRetornoDTO } from '../controllers/demanda/dtos/DemandaListagemRetornoDTO';
import { HistoricoDemandaFiltroDTO } from '../controllers/historicoDemanda/dtos/HistoricoDemandaFiltroDTO';

export class HistoricoDemandaService {
  constructor(
    private historicoDemandaRepository: HistoricoDemandaRepository,
  ) { }

  async statusAtual(demandaId: number): Promise<HistoricoDemandaRetornoDTO> {
    if (!isValidNumber(demandaId)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da demanda inválido');
    }

    const historicoDemandaModel = await this.historicoDemandaRepository.statusAtual(demandaId);

    if (!historicoDemandaModel) {
      return null;
    }

    const historicoDemandaRetornoDTO = await this.buscarPorId(historicoDemandaModel.id);

    return historicoDemandaRetornoDTO;
  }

  async buscarPorId(historicoDemandaId: number): Promise<HistoricoDemandaRetornoDTO> {
    if (!isValidNumber(historicoDemandaId)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do status inválido');
    }

    const historicoDemandaModel = await this.historicoDemandaRepository.buscarPorId(historicoDemandaId);

    if (!historicoDemandaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Status não encontrado');
    }

    const historicoDemandaRetornoDTO: HistoricoDemandaRetornoDTO = {};

    historicoDemandaRetornoDTO.status = historicoDemandaModel.status;
    historicoDemandaRetornoDTO.dataCadastro = historicoDemandaModel.dataCadastro;
    historicoDemandaRetornoDTO.usuario = {};

    historicoDemandaRetornoDTO.usuario.id = historicoDemandaModel.usuarioDestino.id;
    historicoDemandaRetornoDTO.usuario.nome = historicoDemandaModel.usuarioDestino.nome;

    return historicoDemandaRetornoDTO;
  }

  async listar(historicoDemandaFiltroDTO: HistoricoDemandaFiltroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaListagemRetornoDTO> {
    const { demandaId, pagina, itensPagina } = historicoDemandaFiltroDTO;
    const filtro: HistoricoDemandaFiltroDTO = {
      pagina: 1,
      itensPagina: 10,
      empresaId: usuarioLogado.empresa.id,
    }

    if (!isValidNumber(demandaId, { allowString: true })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da demanda inválido');
    }

    filtro.demandaId = Number(demandaId);

    if (isValidNumber(pagina, { allowString: true, min: 1 })) {
      filtro.pagina = Number(pagina);
    }

    if (isValidNumber(itensPagina, { allowString: true, min: 1 })) {
      filtro.itensPagina = Number(itensPagina);
    }

    const [historicosDemandaModel, total] = await this.historicoDemandaRepository.listar(filtro);

    const historicosDemandaRetornoDTO: HistoricoDemandaRetornoDTO[] = [];

    for (let i = 0; i < historicosDemandaModel.length; i++) {
      const historicoDemandaModel = historicosDemandaModel[i];
      const historicoDemandaRetornoDTO: HistoricoDemandaRetornoDTO = {};

      historicoDemandaRetornoDTO.id = historicoDemandaModel.id;
      historicoDemandaRetornoDTO.status = historicoDemandaModel.status;
      historicoDemandaRetornoDTO.dataCadastro = historicoDemandaModel.dataCadastro;
      historicoDemandaRetornoDTO.usuario = {};

      historicoDemandaRetornoDTO.usuario.id = historicoDemandaModel.usuarioDestino.id;
      historicoDemandaRetornoDTO.usuario.nome = historicoDemandaModel.usuarioDestino.nome;


      historicosDemandaRetornoDTO.push(historicoDemandaRetornoDTO);
    }

    return { data: historicosDemandaRetornoDTO, total };
  }

  async cadastrar(historicoDemandaSalvarDTO: HistoricoDemandaSalvarDTO, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<HistoricoDemandaRetornoDTO> {
    const { demandaId, observacao, status, usuarioDestinoId } = historicoDemandaSalvarDTO;

    //valida demanda e usuário
    await demandaService.buscarPorId(demandaId, usuarioLogado, qr);
    const usuarioRetornoDTO = await usuarioService.buscarPorId(usuarioDestinoId, usuarioLogado);

    if (!isString(status) || !Object.values(DemandaStatus).includes(status)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Status inválido');
    }

    const historicoDemanda = new HistoricoDemanda();

    historicoDemanda.status = status;
    historicoDemanda.demanda = new Demanda(demandaId);
    historicoDemanda.dataCadastro = new Date();
    historicoDemanda.usuarioDestino = new Usuario(usuarioDestinoId);
    historicoDemanda.usuarioOrigem = new Usuario(usuarioLogado.id);
    historicoDemanda.empresa = new Empresa(usuarioLogado.empresa.id);

    if (isValidString(observacao)) {
      historicoDemanda.observacao = observacao.trim();
    }

    const historicoDemandaModel = await this.historicoDemandaRepository.salvar(historicoDemanda, qr);

    const historicoDemandaRetornoDTO: HistoricoDemandaRetornoDTO = {};

    historicoDemandaRetornoDTO.status = historicoDemandaModel.status;
    historicoDemandaRetornoDTO.dataCadastro = historicoDemandaModel.dataCadastro;
    historicoDemandaRetornoDTO.usuario = usuarioRetornoDTO;

    return historicoDemandaRetornoDTO;
  }
}