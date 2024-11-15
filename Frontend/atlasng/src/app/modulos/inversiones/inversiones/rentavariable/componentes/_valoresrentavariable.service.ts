
import { any } from 'codelyzer/util/function';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SelectItem } from 'primeng/primeng';


@Injectable()
export class ValoresRentaVariable {
  public pCapital: number;
  public pInteres: number;
  public pValorPorVencer: number;
  public pComisionBolsa: number;
  public pComisionOperador: number;
  public pRetencion: number;
  public pUtilidad: number;
  public plregistro: any = [];
  private mlregistro: any = [];

  public Contabilizar() {

    this.mlregistro = [];
    this.Actualizar("CAPITAL", 'CAP', this.pCapital);
    this.Actualizar("INTERÉS", 'INT', this.pInteres);
    this.Actualizar("COMISIÓN BOLSA DE VALORES", 'COMBOL', this.pComisionBolsa);
    this.Actualizar("COMISIÓN OPERADOR DE BOLSA", 'COMOPE', this.pComisionOperador);
    this.Actualizar("RETENCIÓN", 'RET', this.pRetencion);

    let llregistro: any = [];
    llregistro = this.plregistro;

    this.plregistro = [];

    if (this.mlregistro.length > 0) {

      const lcstrBancos = "BANCOS";
      const lcstrCompra = "COMPRA";

      let lcuenta: any = [];
      
      lcuenta = this.asignaCuenta(llregistro, lcstrBancos);
      
      this.plregistro.push({ 
        rubro: lcstrBancos, 
        rubroccatalogo: 1219, 
        rubrocdetalle: lcstrBancos, 
        valorhaber: 0, 
        debito: false, 
        ccuenta: lcuenta["0"].ccuenta, 
        ncuenta: lcuenta["0"].ncuenta,
        cinvtablaamortizacion: lcuenta["0"].cinvtablaamortizacion,
        procesoccatalogo: 1220,
        procesocdetalle: lcstrCompra,
        ccomprobante: lcuenta["0"].ccomprobante,
        fcontable: lcuenta["0"].fcontable,
        particion: lcuenta["0"].particion,
        secuencia: lcuenta["0"].secuencia,
        ccompania: lcuenta["0"].ccompania
      });
      
      let totalHaber: number = 0;

      let lvalor: number;

      for (const i in this.mlregistro) {
        if (this.mlregistro.hasOwnProperty(i)) {

          lcuenta = this.asignaCuenta(llregistro, this.mlregistro[i].rubro);
          
          if (this.mlregistro[i].valordebe != 0)
          {
            lvalor=this.mlregistro[i].valordebe;
          }
          else
          {
            lvalor=this.mlregistro[i].valorhaber;
          }

          this.plregistro.push(
            {
              rubro: this.mlregistro[i].rubro,
              rubroccatalogo: 1219,
              rubrocdetalle: this.mlregistro[i].rubrocdetalle,
              debito: this.mlregistro[i].debito,
              valordebe: this.mlregistro[i].valordebe,
              valorhaber: this.mlregistro[i].valorhaber,
              ccuenta: lcuenta["0"].ccuenta,
              ncuenta: lcuenta["0"].ncuenta,
              valor: lvalor,
              cinvtablaamortizacion: lcuenta["0"].cinvtablaamortizacion,
              procesoccatalogo: 1220,
              procesocdetalle: lcstrCompra,
              ccomprobante: lcuenta["0"].ccomprobante,
              fcontable: lcuenta["0"].fcontable,
              particion: lcuenta["0"].particion,
              secuencia: lcuenta["0"].secuencia,
              ccompania: lcuenta["0"].ccompania
            });

          totalHaber = totalHaber + this.mlregistro[i].valorhaber;
        }
      }
      this.plregistro[0].valordebe = totalHaber;
      this.plregistro[0].valor = totalHaber;
    }
  }

  private Actualizar(rubro: string, irubrocdetalle: string, valor: number) {
    if (valor != undefined && valor != 0) {
      let lDebe: number = 0;
      let lHaber: number = 0;
      let ldebito: boolean = false;
      if (rubro != "BANCOS") {
        lHaber = valor;
        ldebito = true;
      }
      else {
        lDebe = valor;
      }
      this.mlregistro.push({ rubro: rubro, rubrocdetalle: irubrocdetalle, valordebe: lDebe, valorhaber: lHaber, debito: ldebito  });
    }
  }

  validarContabilizacion(): string {
    let lstrmensaje: string = "";
    for (const i in this.plregistro) {
      if (this.plregistro[i].ccuenta == undefined || this.plregistro[i].ccuenta == "") {
        lstrmensaje = "DEBE ASIGNAR LA CUENTA CONTABLE PARA " + this.plregistro[i].rubro;
        break;
      }
    }
    return lstrmensaje;
  }
  
  private asignaCuenta(iregistro: any, istrRubro: string): any
  {
    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = ""; 

    let lcinvtablaamortizacion: number = null;
    let lccomprobante: string = null;
    let lfcontable: number = null;
    let lparticion: number = null;
    let lsecuencia: number = null;
    let lccompania: number = null;

    for (const i in iregistro) {
      if (iregistro[i].rubro != undefined && iregistro[i].rubro == istrRubro) {
        lccuenta = iregistro[i].ccuenta;
        lncuenta = iregistro[i].ncuenta;

        lcinvtablaamortizacion = iregistro[i].cinvtablaamortizacion;
        lccomprobante = iregistro[i].ccomprobante;
        lfcontable = iregistro[i].fcontable;
        lparticion = iregistro[i].particion;
        lsecuencia = iregistro[i].secuencia;
        lccompania = iregistro[i].ccompania;
        
        break;
      }
    }
    lcuenta.push({ 
      ccuenta: lccuenta, 
      ncuenta: lncuenta,
      cinvtablaamortizacion: lcinvtablaamortizacion,
      ccomprobante: lccomprobante,
      fcontable: lfcontable,
      particion: lparticion,
      secuencia: lsecuencia,
      ccompania: lccompania
      
     });
    return lcuenta;
  }
}
