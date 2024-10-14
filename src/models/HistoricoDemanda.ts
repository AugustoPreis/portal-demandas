import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Demanda } from './Demanda';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';
import { DemandaStatus } from '../enums/DemandaStatus';

@Entity({ name: 'historico_demanda' })
export class HistoricoDemanda {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Demanda)
  @JoinColumn({ name: 'demanda_id' })
  demanda: Demanda;

  @Column({ name: 'observacao' })
  observacao: string;

  @Column({ name: 'status', type: 'varchar' })
  status: DemandaStatus;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_origem' })
  usuarioOrigem: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_destino' })
  usuarioDestino: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  constructor(id?: number) {
    this.id = id;
  }
}