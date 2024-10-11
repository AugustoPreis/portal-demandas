import { QueryRunner } from 'typeorm';
import { EmpresaCadastroDTO } from '../controllers/empresa/dtos/EmpresaCadastroDTO';
import { Empresa } from '../models/Empresa';
import { EmpresaRepository } from '../repositories/empresaRepository';
import { RequestError } from '../utils/RequestError';
import { isString, isValidNumber, isValidString } from '../utils/validators';
import { commit, getQueryRunner, rollback } from '../database';
import { UsuarioCadastroDTO } from '../controllers/usuario/dtos/UsuarioCadastroDTO';
import { usuarioService } from '../controllers/usuario';
import { EmpresaRetornoDTO } from '../controllers/empresa/dtos/EmpresaRetornoDTO';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { EmpresaAlteracaoDTO } from '../controllers/empresa/dtos/EmpresaAlteracaoDTO';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

export class EmpresaService {
  constructor(
    private empresaRepository: EmpresaRepository,
  ) { }

  async buscarPorId(id: number): Promise<EmpresaRetornoDTO> {
    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const empresaModel = await this.empresaRepository.buscarPorId(id);

    if (!empresaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Empresa não encontrada');
    }

    const empresaRetornoDTO: EmpresaRetornoDTO = {};

    empresaRetornoDTO.razaoSocial = empresaModel.razaoSocial;
    empresaRetornoDTO.nomeFantasia = empresaModel.nomeFantasia;
    empresaRetornoDTO.cnpj = empresaModel.cnpj;

    return empresaRetornoDTO;
  }

  async cadastrar(empresaCadastroDTO: EmpresaCadastroDTO): Promise<EmpresaCadastroDTO> {
    const { razaoSocial, nomeFantasia, cnpj } = empresaCadastroDTO;

    if (!isValidString(razaoSocial, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Razão social inválida');
    }

    if (isString(nomeFantasia) && !isValidString(nomeFantasia, { minLength: 1, maxLength: 150 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome fantasia inválido');
    }

    if (!isValidString(cnpj, { length: 14 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'CNPJ inválido');
    }

    const empresaModel = new Empresa();

    empresaModel.razaoSocial = razaoSocial.trim();
    empresaModel.cnpj = cnpj;
    empresaModel.dataCadastro = new Date();
    empresaModel.ativo = true;

    if (isString(nomeFantasia)) {
      empresaModel.nomeFantasia = nomeFantasia.trim();
    }

    const empresaComCnpj = await this.empresaRepository.buscarPorCnpj(cnpj);

    if (empresaComCnpj) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe uma empresa cadastrada com o CNPJ informado');
    }

    let qr: QueryRunner;

    try {
      qr = await getQueryRunner();

      const empresaSalva = await this.empresaRepository.salvar(empresaModel, qr);

      const empresaRetornoDTO: EmpresaCadastroDTO = {};
      const usuarioCadastroDTO: UsuarioCadastroDTO = {};

      usuarioCadastroDTO.nome = 'Administrador';
      usuarioCadastroDTO.email = `${empresaSalva.cnpj}@portal.com`;
      usuarioCadastroDTO.senha = 'admin';
      usuarioCadastroDTO.admin = true;

      await usuarioService.cadastrar(usuarioCadastroDTO, {
        empresa: empresaSalva,
        admin: true,
      }, qr);

      empresaRetornoDTO.razaoSocial = empresaSalva.razaoSocial;
      empresaRetornoDTO.nomeFantasia = empresaSalva.nomeFantasia;
      empresaRetornoDTO.cnpj = empresaSalva.cnpj;
      empresaRetornoDTO.usuario = usuarioCadastroDTO;

      await commit(qr);

      return empresaRetornoDTO;
    } catch (err) {
      await rollback(qr);

      throw err;
    }
  }

  async alterar(empresaAlteracaoDTO: EmpresaAlteracaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<EmpresaRetornoDTO> {
    const { id, razaoSocial, nomeFantasia, cnpj } = empresaAlteracaoDTO;

    if (!usuarioLogado.admin) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Apenas admins podem alterar usuários');
    }

    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const empresaModel = await this.empresaRepository.buscarPorId(id);

    if (!empresaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Empresa não encontrada');
    }

    if (isString(razaoSocial) && isValidString(razaoSocial.trim(), { minLength: 1, maxLength: 100 })) {
      empresaModel.razaoSocial = razaoSocial.trim();
    }

    if (isString(nomeFantasia) && isValidString(nomeFantasia.trim(), { minLength: 1, maxLength: 150 })) {
      empresaModel.nomeFantasia = nomeFantasia.trim();
    }

    if (isString(cnpj) && isValidString(cnpj.trim(), { length: 14 })) {
      if (empresaModel.cnpj != cnpj.trim()) {
        const empresaComCnpj = await this.empresaRepository.buscarPorCnpj(cnpj.trim());

        if (empresaComCnpj) {
          throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe uma empresa cadastrada com o CNPJ informado');
        }
      }

      empresaModel.cnpj = cnpj.trim();
    }

    const empresaSalva = await this.empresaRepository.salvar(empresaModel);

    const empresaRetornoDTO: EmpresaRetornoDTO = {};

    empresaRetornoDTO.razaoSocial = empresaSalva.razaoSocial;
    empresaRetornoDTO.nomeFantasia = empresaSalva.nomeFantasia;
    empresaRetornoDTO.cnpj = empresaSalva.cnpj;

    return empresaRetornoDTO;
  }
}