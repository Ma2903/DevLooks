// Declaração de tipos para node-correios
declare module 'node-correios' {
  export interface CalcPrecoPrazoArgs {
    nCdServico: string[];
    sCepOrigem: string;
    sCepDestino: string;
    nVlPeso: string;
    nCdFormato: string | number;
    nVlComprimento: string | number;
    nVlAltura: string | number;
    nVlLargura: string | number;
    nVlDiametro: string | number;
  }

  export interface CalcPrecoPrazoResult {
    Codigo: string;
    Valor: string;
    PrazoEntrega: string;
    ValorSemAdicionais: string;
    ValorMaoPropria: string;
    ValorAvisoRecebimento: string;
    ValorValorDeclarado: string;
    EntregaDomiciliar: string;
    EntregaSabado: string;
    Erro: string;
    MsgErro: string;
  }

  class Correios {
    calcPrecoPrazo(args: CalcPrecoPrazoArgs): Promise<CalcPrecoPrazoResult[]>;
  }

  export default Correios;
}
