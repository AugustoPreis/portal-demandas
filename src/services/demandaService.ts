import { DemandaAlteracaoDTO } from '../controllers/demanda/dtos/DemandaAlteracaoDTO';
import { DemandaCadastroDTO } from '../controllers/demanda/dtos/DemandaCadastroDTO';
import { DemandaFiltroDTO } from '../controllers/demanda/dtos/DemandaFiltroDTO';
import { DemandaListagemRetornoDTO } from '../controllers/demanda/dtos/DemandaListagemRetornoDTO';
import { DemandaRetornoDTO } from '../controllers/demanda/dtos/DemandaRetornoDTO';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';
import { DemandaStatus } from '../enums/DemandaStatus';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { Demanda } from '../models/Demanda';
import { Empresa } from '../models/Empresa';
import { DemandaRepository } from '../repositories/demandaRepository';
import { RequestError } from '../utils/RequestError';
import { isString, isValidNumber, isValidString } from '../utils/validators';

export class DemandaService {
  constructor(
    private demandaRepository: DemandaRepository,
  ) { }

  async listar(demandaFiltroDTO: DemandaFiltroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaListagemRetornoDTO> {
    const { filtro: filtroDemanda, pagina, itensPagina } = demandaFiltroDTO;
    const filtro: DemandaFiltroDTO = {
      filtro: '',
      pagina: 1,
      itensPagina: 10,
      empresaId: usuarioLogado.empresa.id,
    }

    if (isValidString(filtroDemanda, { maxLength: 100 })) {
      filtro.filtro = filtroDemanda.trim();
    }

    if (isValidNumber(pagina, { allowString: true, min: 1 })) {
      filtro.pagina = Number(pagina);
    }

    if (isValidNumber(itensPagina, { allowString: true, min: 1 })) {
      filtro.itensPagina = Number(itensPagina);
    }

    const [demandasModel, total] = await this.demandaRepository.listar(filtro);

    const demandasRetornoDTO: DemandaRetornoDTO[] = [];

    for (let i = 0; i < demandasModel.length; i++) {
      const demandaModel = demandasModel[i];
      const demandaRetornoDTO: DemandaRetornoDTO = {};

      demandaRetornoDTO.numero = demandaModel.numero;
      demandaRetornoDTO.titulo = demandaModel.titulo;
      demandaRetornoDTO.ano = demandaModel.dataCadastro.getFullYear();

      demandasRetornoDTO.push(demandaRetornoDTO);
    }

    return { data: demandasRetornoDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaRetornoDTO> {
    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const demandaModel = await this.demandaRepository.buscarPorId(id);

    if (!demandaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Demanda não encontrada');
    }

    if (demandaModel.empresa.id !== usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Demanda não pertence à empresa do usuário logado');
    }

    const demandaRetornoDTO: DemandaRetornoDTO = {};

    demandaRetornoDTO.numero = demandaModel.numero;
    demandaRetornoDTO.titulo = demandaModel.titulo;
    demandaRetornoDTO.descricao = demandaModel.descricao;

    return demandaRetornoDTO;
  }

  async cadastrar(demanda: DemandaCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaRetornoDTO> {
    const { titulo, descricao, usuarioId } = demanda;

    if (!isValidString(titulo, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Título inválido');
    }

    if (!isValidNumber(usuarioId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do usuário inválido');
    }

    const demandaModel = new Demanda();

    demandaModel.titulo = titulo.trim();
    demandaModel.numero = await this.demandaRepository.buscarProximoNumero(usuarioLogado.empresa.id);
    demandaModel.dataCadastro = new Date();
    demandaModel.empresa = new Empresa(usuarioLogado.empresa.id);

    if (isValidString(descricao)) {
      demandaModel.descricao = descricao.trim();
    }

    const demandaSalva = await this.demandaRepository.salvar(demandaModel);

    const demandaRetornoDTO: DemandaRetornoDTO = {};

    demandaRetornoDTO.numero = demandaSalva.numero;
    demandaRetornoDTO.ano = demandaSalva.dataCadastro.getFullYear();
    demandaRetornoDTO.status = DemandaStatus.ABERTA;
    demandaRetornoDTO.dataCadastro = demandaSalva.dataCadastro;

    return demandaRetornoDTO;
  }

  async alterar(demandaAlteracaoDTO: DemandaAlteracaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaRetornoDTO> {
    const { id, titulo, descricao } = demandaAlteracaoDTO;

    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const demandaModel = await this.demandaRepository.buscarPorId(id);

    if (!demandaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Demanda não encontrada');
    }

    if (demandaModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Demanda não pertence à empresa do usuário logado');
    }

    if (isString(titulo) && isValidString(titulo.trim(), { minLength: 1, maxLength: 100 })) {
      demandaModel.titulo = titulo.trim();
    }

    if (isValidString(descricao)) {
      demandaModel.descricao = descricao.trim();
    }

    const demandaSalva = await this.demandaRepository.salvar(demandaModel);

    const demandaRetornoDTO: DemandaRetornoDTO = {};

    demandaRetornoDTO.numero = demandaSalva.numero;
    demandaRetornoDTO.ano = demandaSalva.dataCadastro.getFullYear();
    demandaRetornoDTO.titulo = demandaSalva.titulo;
    demandaRetornoDTO.descricao = demandaSalva.descricao;

    return demandaRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<DemandaRetornoDTO> {
    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const demandaModel = await this.demandaRepository.buscarPorId(id);

    if (!demandaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Demanda não encontrada');
    }

    if (demandaModel.empresa.id !== usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Demanda não pertence à empresa do usuário logado');
    }

    if (demandaModel.ativo === false) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Demanda já inativada');
    }

    demandaModel.ativo = false;
    demandaModel.dataInativacao = new Date();

    const demandaSalva = await this.demandaRepository.salvar(demandaModel);

    const demandaRetornoDTO: DemandaRetornoDTO = {};

    demandaRetornoDTO.numero = demandaSalva.numero;
    demandaRetornoDTO.ano = demandaSalva.dataCadastro.getFullYear();
    demandaRetornoDTO.titulo = demandaSalva.titulo;
    demandaRetornoDTO.descricao = demandaSalva.descricao;

    return demandaRetornoDTO;
  }
}