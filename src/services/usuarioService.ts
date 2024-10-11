import { QueryRunner } from 'typeorm';
import { UsuarioCadastroDTO } from '../controllers/usuario/dtos/UsuarioCadastroDTO';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';
import { UsuarioRetornoDTO } from '../controllers/usuario/dtos/UsuarioRetornoDTO';
import { Empresa } from '../models/Empresa';
import { Usuario } from '../models/Usuario';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { Crypt } from '../utils/Crypt';
import { isString, isValidNumber, isValidString } from '../utils/validators';
import { UsuarioLoginDTO } from '../controllers/usuario/dtos/UsuarioLoginDTO';
import { UsuarioLoginResultadoDTO } from '../controllers/usuario/dtos/UsuarioLoginResultadoDTO';
import { RequestError } from '../utils/RequestError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { sign } from '../utils/jwt';
import { UsuarioAlteracaoDTO } from '../controllers/usuario/dtos/UsuarioAlteracaoDTO';
import { UsuarioFiltroDTO } from '../controllers/usuario/dtos/UsuarioFiltroDTO';
import { UsuarioListagemRetornoDTO } from '../controllers/usuario/dtos/UsuarioListagemRetornoDTO';

export class UsuarioService {
  constructor(
    private usuarioRepository: UsuarioRepository,
  ) { }

  async login(usuarioLoginDTO: UsuarioLoginDTO): Promise<UsuarioLoginResultadoDTO> {
    const { email, senha } = usuarioLoginDTO;

    if (!isValidString(email, { minLength: 1, maxLength: 150 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'E-mail inválido');
    }

    if (!isValidString(senha, { minLength: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Senha inválida');
    }

    const usuarioModel = await this.usuarioRepository.buscarPorEmail(email, true);

    if (!usuarioModel || !Crypt.compare(senha, usuarioModel.senha)) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Login inválido');
    }

    const usuarioLogadoDTO: UsuarioLogadoDTO = {};
    const usuarioLoginResultadoDTO: UsuarioLoginResultadoDTO = {};

    usuarioLogadoDTO.id = usuarioModel.id;
    usuarioLogadoDTO.nome = usuarioModel.nome;
    usuarioLogadoDTO.admin = usuarioModel.admin;

    usuarioLogadoDTO.empresa = {};
    usuarioLogadoDTO.empresa.id = usuarioModel.empresa.id;
    usuarioLogadoDTO.empresa.razaoSocial = usuarioModel.empresa.razaoSocial;
    usuarioLogadoDTO.empresa.nomeFantasia = usuarioModel.empresa.nomeFantasia;
    usuarioLogadoDTO.empresa.cnpj = usuarioModel.empresa.cnpj;

    const jwtSign = sign(usuarioLogadoDTO);

    usuarioLoginResultadoDTO.token = jwtSign.token;
    usuarioLoginResultadoDTO.dataExpiracao = jwtSign.expiresIn;

    return usuarioLoginResultadoDTO;
  }

  async listar(usuarioFiltroDTO: UsuarioFiltroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioListagemRetornoDTO> {
    const { nome, pagina, itensPagina } = usuarioFiltroDTO;
    const filtro: UsuarioFiltroDTO = {
      nome: '',
      pagina: 1,
      itensPagina: 10,
      empresa: usuarioLogado.empresa.id,
    };

    if (isValidString(nome, { maxLength: 100 })) {
      filtro.nome = nome.trim();
    }

    if (isValidNumber(pagina, { allowString: true, min: 1 })) {
      filtro.pagina = Number(pagina);
    }

    if (isValidNumber(itensPagina, { allowString: true, min: 1 })) {
      filtro.itensPagina = Number(itensPagina);
    }

    const [usuariosModel, total] = await this.usuarioRepository.listar(filtro);

    const usuariosRetornoDTO: UsuarioRetornoDTO[] = [];

    for (let i = 0; i < usuariosModel.length; i++) {
      const usuarioModel = usuariosModel[i];
      const usuarioRetornoDTO: UsuarioRetornoDTO = {};

      usuarioRetornoDTO.id = usuarioModel.id;
      usuarioRetornoDTO.nome = usuarioModel.nome;
      usuarioRetornoDTO.admin = usuarioModel.admin;

      usuariosRetornoDTO.push(usuarioRetornoDTO);
    }

    return { data: usuariosRetornoDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioRetornoDTO> {
    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const usuarioModel = await this.usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id !== usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence à empresa do usuário logado');
    }

    const usuarioRetornoDTO: UsuarioRetornoDTO = {};

    usuarioRetornoDTO.id = usuarioModel.id;
    usuarioRetornoDTO.nome = usuarioModel.nome;
    usuarioRetornoDTO.admin = usuarioModel.admin;

    return usuarioRetornoDTO;
  }

  async cadastrar(usuarioCadastroDTO: UsuarioCadastroDTO, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<UsuarioRetornoDTO> {
    const { nome, email, admin, senha } = usuarioCadastroDTO;

    if (!usuarioLogado.admin) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Apenas admins podem cadastrar usuários');
    }

    if (!isValidString(nome, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome inválido');
    }

    if (!isValidString(email, { minLength: 1, maxLength: 150 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'E-mail inválido');
    }

    if (!isValidString(senha, { minLength: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Senha inválida');
    }

    const usuarioModel = new Usuario();

    usuarioModel.nome = nome.trim();
    usuarioModel.email = email.trim();
    usuarioModel.senha = Crypt.hash(senha);
    usuarioModel.dataCadastro = new Date();
    usuarioModel.admin = !!admin;
    usuarioModel.ativo = true;
    usuarioModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const usuarioComEmail = await this.usuarioRepository.buscarPorEmail(email);

    if (usuarioComEmail) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe um usuário cadastrado com o e-mail informado');
    }

    const usuarioSalvo = await this.usuarioRepository.salvar(usuarioModel, qr);

    const usuarioRetornoDTO: UsuarioRetornoDTO = {};

    usuarioRetornoDTO.id = usuarioSalvo.id;
    usuarioRetornoDTO.nome = usuarioSalvo.nome;
    usuarioRetornoDTO.admin = usuarioSalvo.admin;

    return usuarioRetornoDTO;
  }

  async alterar(usuarioAlteracaoDTO: UsuarioAlteracaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioRetornoDTO> {
    const { id, nome, email, senha, admin } = usuarioAlteracaoDTO;

    if (!usuarioLogado.admin) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Apenas admins podem alterar usuários');
    }

    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const usuarioModel = await this.usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence à empresa do usuário logado');
    }

    if (isString(nome) && isValidString(nome.trim(), { minLength: 1, maxLength: 100 })) {
      usuarioModel.nome = nome.trim();
    }

    if (isString(email) && isValidString(email.trim(), { minLength: 1, maxLength: 150 })) {
      if (usuarioModel.email != email.trim()) {
        const usuarioComEmail = await this.usuarioRepository.buscarPorEmail(email.trim());

        if (usuarioComEmail) {
          throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe um usuário cadastrado com o e-mail informado');
        }
      }

      usuarioModel.email = email.trim();
    }

    if (isValidString(senha, { minLength: 1 })) {
      usuarioModel.senha = Crypt.hash(senha);
    }

    if (admin !== undefined) {
      usuarioModel.admin = !!admin;
    }

    const usuarioSalvo = await this.usuarioRepository.salvar(usuarioModel);

    const usuarioRetornoDTO: UsuarioRetornoDTO = {};

    usuarioRetornoDTO.nome = usuarioSalvo.nome;
    usuarioRetornoDTO.admin = usuarioSalvo.admin;

    return usuarioRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioRetornoDTO> {
    if (!usuarioLogado.admin) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Apenas admins podem inativar usuários');
    }

    if (!isValidNumber(id)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID inválido');
    }

    const usuarioModel = await this.usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id !== usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence à empresa do usuário logado');
    }

    if (usuarioModel.ativo === false) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Usuário já inativado');
    }

    if (usuarioModel.id === usuarioLogado.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Não é possível inativar o próprio usuário');
    }

    usuarioModel.ativo = false;
    usuarioModel.dataInativacao = new Date();

    const usuarioSalvo = await this.usuarioRepository.salvar(usuarioModel);

    const usuarioRetornoDTO: UsuarioRetornoDTO = {};

    usuarioRetornoDTO.nome = usuarioSalvo.nome;
    usuarioRetornoDTO.admin = usuarioSalvo.admin;

    return usuarioRetornoDTO;
  }
}