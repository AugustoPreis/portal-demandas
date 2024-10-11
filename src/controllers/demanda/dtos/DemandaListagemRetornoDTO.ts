import { DemandaRetornoDTO } from './DemandaRetornoDTO';

export type DemandaListagemRetornoDTO = Partial<{
  data: DemandaRetornoDTO[];
  total: number;
}>;