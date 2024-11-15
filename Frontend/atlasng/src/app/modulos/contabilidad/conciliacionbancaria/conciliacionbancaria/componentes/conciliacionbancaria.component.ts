import { forEach } from '@angular/router/src/utils/collection';
import { Component,OnInit,AfterViewInit,ViewChild,HostListener} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import {  DataTable } from "primeng/primeng";
import { LovCuentasContablesComponent } from "../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component";
import { ConfirmationService } from "primeng/primeng";
import { Consulta } from '../../../../../util/dto/dto.component';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: "app-conciliacionbancaria",
  templateUrl: "conciliacionbancaria.html"
})
export class ConciliacionbancariaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild("dtMB") dtMB: DataTable;
  @ViewChild("dtEB") dtEB: DataTable;

  fecha = new Date();
  public lregistrosmayor: any = [];
  public lregistrosextracto: any = [];
  public lregistrosconciliado: any = [];
  public lregistrosconciliadoFiltro: any = [];
  public lregistrosConcLB: any = [];
  public lregistrosConcEX: any = [];
  public lextractoajuste : any = [];
  public llibroajuste : any = [];
  public coloractual: string;
  public lhojatrabajo: any = [];
  public lregistrosTotales: any = [];
  public lregistrosTmp: any = [];
  public lregistrosmanual: any = [];
  public ccuenta: string;
  public ncuenta: string;
  public sortF: string = '';
  public sortFex: string = '';
  public totalCreditoMayor: Number = 0;
  public totalDebitoMayor: Number = 0;
  public totalRegistrosMayor = 0;
  public totalCreditoExtracto: Number = 0;
  public totalDebitoExtracto: Number = 0;
  public totalRegistrosExtracto = 0;
  public totalAjusteCreditoLibro: Number = 0;
  public totalAjusteDebitoLibro: Number = 0;
  public totalAjusteRegistrosLibro = 0;
  public totalAjusteCreditoExtracto: Number = 0;
  public totalAjusteDebitoExtracto: Number = 0;
  public totalAjusteRegistrosExtracto = 0;
  public mostrarLibroBanco = false;
  public mostrarExtracoBancario = false;
  public conciliacionDocumento: string;
  public arrSumaLB: any = [];
  public arrSumaEX: any = [];
  public verGrabar: boolean = false;
  public expandeAjuste: boolean = true;


  public numConciliados: Number = 0;
  public sumaDebitoLb: Number = 0;
  public sumaCreditoLb: Number = 0;
  public sumaCreditoEx: Number = 0;
  public sumaDebitoEx: Number = 0;

  public saldoLb: Number = 0;
  public saldoEx: Number = 0;
  public saldoAnterior: Number = 0;
  public saldoFinalLb: Number = 0;
  public saldoFinalEx: Number = 0;

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(
      router,
      dtoServicios,
      "tconconciliacionbancos",
      "CONCILIACIONBANCARIACP",
      false
    );
    this.componentehijo = this;
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      this.conciliar();
    }
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.finicio = new Date(
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
      ),
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)
      ) - 1,
      1
    );
    this.mcampos.ffin = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
    this.ccuenta = "";
    this.ncuenta = "";

    //------------------------------
    this.mcampos.nulo = "1";
    //------------------------------

  }

  ngAfterViewInit() {
    this.encerarTotales();
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  
  eliminarelemento(lista: any, reg: any): any {
    const lregistrosaux = lista;

    for (const i in lregistrosaux) {
      if (lregistrosaux.hasOwnProperty(i)) {
        const item = lregistrosaux[i];
        if (JSON.stringify(item) === JSON.stringify(reg)) {
          lregistrosaux.splice(Number(i), 1);
        }
      }
    }
    return lregistrosaux;
  }

  agregarhojatrabajomayor(reg: any) {

    this.lhojatrabajo.push({clibrobanco: reg.lclibrobanco,
      fcontable: reg.lfcontable,
      ccomprobante: reg.lccomprobante,
      documento: reg.ldocumento,
      montocredito: reg.lmontocredito,
      montodebito: reg.lmontodebito,
      mmodulo: reg.lmodulo
    });

    this.lregistrosTmp.push({clibrobanco: reg.lclibrobanco,
                             fcontable: reg.lfcontable,
                             ccomprobante: reg.lccomprobante,
                             documento: reg.ldocumento,
                             montocredito: reg.lmontocredito,
                             montodebito: reg.lmontodebito,
                             mmodulo: reg.lmodulo});
    this.eliminarelemento(this.lregistrosmayor, reg);
    this.sumaconciliacion();
  }

  agregarhojatrabajoextracto(reg: any) {
    this.lhojatrabajo.push(reg);
    this.lregistrosTmp.push(reg);
    this.eliminarelemento(this.lregistrosextracto, reg);
    this.sumaconciliacion();
  }
  public con = 0;
  sumaconciliacion() {
    this.lregistrosTotales = [];
    let sumaMDebito, sumaMCredito, sumaEDebito, sumaECredito: number;
 
    sumaMDebito = 0;
    sumaMCredito = 0;
    sumaEDebito = 0;
    sumaECredito = 0;
    for (const i in this.lregistrosTmp) {
      
      if (this.lregistrosTmp.hasOwnProperty(i)) {
        const reg = this.lregistrosTmp[i];
        if (!this.estaVacio(reg.clibrobanco) &&  this.estaVacio(reg.cextractobancario)){
        sumaMDebito +=
          reg.montodebito === undefined || reg.montodebito === null
            ? 0
            : Number(reg.montodebito);
        sumaMCredito +=
          reg.montocredito === undefined || reg.montocredito === null
            ? 0
            : Number(reg.montocredito);
          this.con +=1
            
        }
        if( !this.estaVacio(reg.cextractobancario)){
        sumaEDebito +=
          reg.montodebito === undefined || reg.montodebito === null
            ? 0
            : Number(reg.montodebito);
        sumaECredito +=
          reg.montocredito === undefined || reg.montocredito === null
            ? 0
            : Number(reg.montocredito);
            this.con += 1

        }
      }
    }

    let total = {
      mvalorcredito: this.redondear(sumaMCredito, 2),
      mvalordebito: this.redondear(sumaMDebito, 2),
      valorcredito: this.redondear(sumaECredito, 2),
      valordebito: this.redondear(sumaEDebito, 2),
      saldo: this.redondear(sumaMCredito + sumaECredito - (sumaMDebito + sumaEDebito), 2)
    };
    this.lregistrosTotales.push(total);
    
    if((sumaMCredito > 0 || sumaMDebito > 0) && this.con ==1 ){
    this.totalRegistrosMayor -= 1;
    }
    if((sumaECredito > 0 || sumaEDebito > 0) && this.con >= 1 ){
    this.totalRegistrosExtracto -= 1;
    }
    this.con = 0;
  }

  conciliar() {
    if (this.lregistrosTmp == undefined || this.lregistrosTmp.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS EN LA HOJA DE TRABAJO");
      return;
    }

      if (this.lregistrosTotales[0].saldo != 0) {
        this.mostrarMensajeError(
          "NO CUADRAN LOS VALORES ENTRE EL MAYOR Y EL EXTRACTO BANCARIO EN " +
          this.lregistrosTotales[0].saldo +
          " CONCILIACIÓN CANCELADA!"
        );
        return;
      }

      if (!this.validarHojaTrabajo()) {
        this.conciliacionCancelar();
        this.mostrarMensajeError("ES NECESARIO UN REGISTRO DE EXTRACTO, PARA CONCILIAR" +
          " CONCILIACIÓN CANCELADA!");

        return;
      }

      var ldate = new Date();
      let lfechanum: number = this.fechaToInteger(ldate);
      let lhoranum: number = this.horaToInteger(ldate);
      let lfechastr: string = lfechanum.toString().substring(0, 8);
      let lhorastr: string = lhoranum.toString().substring(0, 6);
      let id = this.lregistrosconciliado.length + 1;
      let lconciliacionbancariaid: number = parseInt(lfechastr + lhorastr, 10);

      for (const i in this.lhojatrabajo) {
        if (this.lhojatrabajo.hasOwnProperty(i)) {
          if(!this.estaVacio(this.lhojatrabajo[i].clibrobanco)){


          this.lregistrosconciliado.push({
            rclibrobanco: this.lhojatrabajo[i].clibrobanco,
            rconciliacionbancariaid: id,
            rfcontable: this.lhojatrabajo[i].fcontable,
            rccomprobante: this.lhojatrabajo[i].comprobante,
            rcconconciliacionbancariaextracto: this.lhojatrabajo[i].cextractobancario,
            rvalorcredito:
              this.lregistrosTotales[0].mvalorcredito,
            rvalordebito:
              this.lregistrosTotales[0].mvalordebito,
            rnumerodocumentobancario: this.lhojatrabajo[i]
              .documento,
            rcuentabancaria: this.lhojatrabajo[i].cuentabanco,
            rcodigounico: lconciliacionbancariaid,
            rconciliado: true,
            rautomatico: false,
            mmodulo: this.lregistrosTmp[i].mmodulo,
            // Extracto
            fecha: this.lregistrosTmp[i].fmovimiento,
            concepto: this.lregistrosTmp[i].concepto,
            cuentabancaria: this.lregistrosTmp[i].cuentabanco
          });
        }else{

          this.lregistrosconciliado.push({
            rclibrobanco: this.lhojatrabajo[i].clibrobanco,
            rconciliacionbancariaid: id,
            rfcontable: this.lhojatrabajo[i].fcontable,
            rccomprobante: this.lhojatrabajo[i].comprobante,
            rcconconciliacionbancariaextracto: this.lhojatrabajo[i].cextractobancario,
            rvalorcredito:
              this.lregistrosTotales[0].valorcredito,
            rvalordebito:
              this.lregistrosTotales[0].valordebito,
            rnumerodocumentobancario: this.lhojatrabajo[i]
              .documento,
            rcuentabancaria: this.lhojatrabajo[i].cuentabanco,
            rcodigounico: lconciliacionbancariaid,
            rconciliado: true,
            rautomatico: false,
            mmodulo: this.lregistrosTmp[i].mmodulo,
            // Extracto
            fecha: this.lregistrosTmp[i].fmovimiento,
            concepto: this.lregistrosTmp[i].concepto,
            cuentabancaria: this.lregistrosTmp[i].cuentabanco
          });
        }
        id += 1;
        }
      }
      this.lhojatrabajo = [];
      this.lregistrosTotales = [];
      this.lregistrosTmp = [];
    }
  

  validarHojaTrabajo(): boolean {
    let existeExtracto: boolean = false;
    for (const i in this.lhojatrabajo) {
      if (this.lhojatrabajo.hasOwnProperty(i)) {
        const reg = this.lhojatrabajo[i];
        if (reg.clibrobanco || reg.cextractobancario) {
          existeExtracto = true;
        }
      }
    }
    return existeExtracto;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
  }

  validaFiltrosConsulta(): boolean {
    if (
      this.estaVacio(this.mcampos.ccuenta) ||
      this.estaVacio(this.mcampos.finicio) ||
      this.estaVacio(this.mcampos.ffin)
    ) {
      this.mostrarMensajeError("FILTROS DE CONSULTA REQUERIDOS");
      return false;
    }
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  grabar(): void {
      this.encerarMensajes();  

      if(this.llibroajuste === null || this.llibroajuste === undefined){
        this.llibroajuste =[];
      }

      if(this.lextractoajuste === null || this.lextractoajuste === undefined){
        this.lextractoajuste =[];
      }
      this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;
      this.rqMantenimiento.lregistrosajustelibro = this.llibroajuste;
      this.rqMantenimiento.lregistrosajustextracto = this.lextractoajuste;
      this.rqMantenimiento.lregistrosgrabar = this.lregistrosconciliado;
      this.crearDtoMantenimiento();
      super.grabar();
      this.limpiarAplicacion();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    if (resp.cod === "OK") {
      this.mcampos.ccuenta = this.ccuenta;
      this.mcampos.ncuenta = this.ncuenta;
      super.postCommitEntityBean(resp);
    }
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.msgs = [];
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.ccuenta = reg.registro.ccuenta;
      this.ncuenta = reg.registro.nombre;
    }
  }

  limpiarAplicacion() {
    this.lregistrosconciliado = [];
    this.llibroajuste =[];
    this.lextractoajuste = [];
  }

  encerarTotales() { }

  eliminardato(reg: any) {
    this.selectRegistro(reg);
    this.eliminar();

    if (reg.extracto) {
      reg.mmayor = false;
      reg.extracto = true;
    }
    reg.mmayor = true;
    reg.extracto = false;
  }

  conciliacionCancelar() {
    
    this.encerarMensajes();
    for (const i in this.lhojatrabajo) {
      if (this.lhojatrabajo.hasOwnProperty(i)) {
        const reg = this.lhojatrabajo[i];
        reg.mmayor = true;
        if (reg.mmayor) {
          this.lregistrosmayor.push({lclibrobanco: reg.clibrobanco,
            lfcontable: reg.fcontable,
            lccomprobante: reg.ccomprobante,
            ldocumento: reg.documento,
            lmontocredito: reg.montocredito,
            lmontodebito: reg.montodebito,
            lmodulo: reg.mmodulo});
        }
        if (reg.extracto) {
          this.lregistrosextracto.push(reg);
        }
      }
    }
    this.calcularTotalesMayor(this.lregistrosmayor);
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.lhojatrabajo = [];
    this.lregistrosTotales = [];
    this.lregistrosTmp = [];
  }

  conciliarHoja() {
    if (this.lregistrosTmp == undefined || this.lregistrosTmp.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS EN LA HOJA DE TRABAJO");
    } else {
      this.encerarMensajes();

      if (this.lregistrosTotales[0].saldo != 0) {
        this.mostrarMensajeError(
          "NO CUADRAN LOS VALORES ENTRE EL MAYOR Y EL EXTRACTO BANCARIO EN " +
          this.lregistrosTotales[0].saldo +
          " CONCILIACIÓN CANCELADA!"
        );
        return;
      }

      var ldate = new Date();
      let lfechanum: number = this.fechaToInteger(ldate);
      let lhoranum: number = this.horaToInteger(ldate);
      let lfechastr: string = lfechanum.toString().substring(0, 8);
      let lhorastr: string = lhoranum.toString().substring(0, 6);
      let id = this.lregistros.length + 1;
      let lconciliacionbancariaid: number = parseInt(lfechastr + lhorastr, 10);

      if (this.lhojatrabajo.length === 2) {
        for (const i in this.lhojatrabajo) {
          if (this.lhojatrabajo.hasOwnProperty(i)) {
            this.lregistros.push({
              rconciliacionbancariaid: id,
              rfcontable: this.lregistrosTmp[i].mfcontable,
              rccomprobante: this.lregistrosTmp[i].mccomprobante,
              rcconconciliacionbancariaextracto: this.lregistrosTmp[i]
                .cconconciliacionbancariaextracto,
              rcvalorcredito: this.lregistrosTmp[i].mmonto,
              rcvalordebito: this.lregistrosTmp[i].mmonto,
              rmnumerodocumentobancario: this.lregistrosTmp[i].numerodocumentobancario,
              rcuentabancaria: this.lregistrosTmp[i].cuentabancaria,
              rcodigounico: lconciliacionbancariaid,
              mmodulo: this.lregistrosTmp[i].mmodulo,
              mcomentario: this.lregistrosTmp[i].mcomentario,
              rconciliado: true,
              rautomatico: false
            });
            id += 1;
          }
        }
      } else {
        for (const i in this.lhojatrabajo) {
          if (this.lhojatrabajo.hasOwnProperty(i)) {
            this.lregistros.push({
              rconciliacionbancariaid: id,
              rfcontable: this.lregistrosTmp[i].mfcontable,
              rccomprobante: this.lregistrosTmp[i].mccomprobante,
              rcconconciliacionbancariaextracto: this.lregistrosTmp[i]
                .cconconciliacionbancariaextracto,
              rcvalorcredito: this.lregistrosTmp[i].mmonto,
              rcvalordebito: this.lregistrosTmp[i].mmonto,
              rmnumerodocumentobancario: this.lregistrosTmp[i].numerodocumentobancario,
              rcuentabancaria: this.lregistrosTmp[i].cuentabancaria,
              rcodigounico: lconciliacionbancariaid,
              mmodulo: this.lregistrosTmp[i].mmodulo,
              mcomentario: this.lregistrosTmp[i].mcomentario,
              rconciliado: true,
              rautomatico: false
            });
            id += 1;
          }
        }
      }
      this.lhojatrabajo = [];
      this.lregistrosTotales = [];
      this.lregistrosTmp = [];
    }

    const rqConsulta: any = new Object();

    rqConsulta.ccuenta = this.mcampos.ccuenta;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== "OK") {
          return;
        }
        this.lregistros = resp.LIBROBANCOS;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  ConsultarDatos(casoEspecial: number = 0) {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = "CONCILIACIONBANCARIACP";
    rqConsulta.ccuenta = this.mcampos.ccuenta;
    rqConsulta.finicio = this.mcampos.finicio;
    rqConsulta.ffin = this.mcampos.ffin;
//------------------------------------------------
    rqConsulta.nulo = this.mcampos.nulo;
//------------------------------------------------    
    rqConsulta.especial = casoEspecial;
//------------------------------------------------
this.dtoServicios.ejecutarConsultaRest(rqConsulta).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        if (resp.cod !== "OK") {
          return;
        }
        this.lhojatrabajo = [];
        this.lregistrosTotales = [];
        this.lregistrosTmp = [];
        this.lregistrosmayor = resp.LIBROBANCOS;
        this.lregistrosextracto = resp.EXTRACTO;

        this.lextractoajuste = resp.AJUSTEEXTRACTO;
        this.llibroajuste = resp.AJUSTELIBRO; 
        this.lregistrosconciliado = resp.CONCILIACIONRESULTADO;

        this.calcularTotalesMayor(this.lregistrosmayor);
        this.calcularTotalesExtracto(this.lregistrosextracto);
        this.totalesAjusteLibro(this.llibroajuste);
        this.totalesAjusteExtracto(this.lextractoajuste);
        if(resp.CONCILIACIONFINAL != null){
            this.totalesConciliacion(resp.CONCILIACIONFINAL, resp.SALDOANTERIOR);           
        }
        if (this.llibroajuste.length == 0 && this.lextractoajuste.length == 0)
            this.expandeAjuste = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }


  customize(rowData: any): string {
    return "";
  }

  cambiarcoloractual(): string {
    if (this.coloractual === "yellow") {
      return "white";
    }
    return "yellow";
  }

  eliminarConciliado(reg: any) {
   
      if (reg.mmayor) {
        this.lregistrosmayor.push({
          lclibrobanco: reg.rclibrobanco,
          lccomprobante: reg.rccomprobante,
          ldocumento: reg.mnumerodocumentobancario,
          lfcontable: reg.rfcontable,
          lmodulo: reg.mmodulo,
          lmontodebito: reg.mvalordebito,
          lmontocredito: reg.mvalorcredito,
        });
        this.totalRegistrosMayor += 1;
      }
      if (!reg.mmayor && !this.estaVacio(reg.rclibrobanco) ){
        this.lregistrosmayor.push({
          lclibrobanco: reg.rclibrobanco,
          lccomprobante: reg.rccomprobante,
          ldocumento: reg.rnumerodocumentobancario,
          lfcontable: reg.rfcontable,
          lmodulo: reg.mmodulo,
          lmontodebito: reg.rvalordebito,
          lmontocredito: reg.rvalorcredito,
        });
        this.totalRegistrosMayor += 1;
        
      }
      if (reg.extracto) {
        this.lregistrosextracto.push({
          cextractobancario: reg.rcconconciliacionbancariaextracto,
          fmovimiento: reg.fecha,
          documento: reg.rnumerodocumentobancario,
          montodebito: reg.valordebito,
          montocredito: reg.valorcredito,
          concepto: reg.concepto,
          cuentabanco: reg.cuentabancaria,
        });
        this.totalRegistrosExtracto += 1;
      }
      if (!reg.extracto  && !this.estaVacio(reg.rcconconciliacionbancariaextracto)){
        this.lregistrosextracto.push({
          cextractobancario: reg.rcconconciliacionbancariaextracto,
          fmovimiento: reg.fecha,
          documento: reg.rnumerodocumentobancario,
          montodebito: reg.rvalordebito,
          montocredito: reg.rvalorcredito,
          concepto: reg.concepto,
          cuentabanco: reg.cuentabancaria,
        });
        this.totalRegistrosExtracto += 1;
      }
    this.eliminarelemento(this.lregistrosconciliado, reg);
    reg.clear();
  }

  getColor(x, data) {
    var color: string;
    if (this.coloractual === "yellow") {
      color = "white";
    } else {
      color = "yellow";
    }
    this.coloractual = color;
    x.parentNode.parentNode.style.background = color;
  }

  public calcularTotalesMayor(lista: any) {
    this.totalCreditoMayor = 0;
    this.totalDebitoMayor = 0;
    this.totalRegistrosMayor = 0;

    for (const i in lista) {
      const reg = lista[i];
      this.totalCreditoMayor += reg.lmontocredito;
      this.totalDebitoMayor += reg.lmontodebito;
      this.totalRegistrosMayor += 1;
    }
  }

  public calcularTotalesExtracto(lista: any) {
    this.totalCreditoExtracto = 0;
    this.totalDebitoExtracto = 0;
    this.totalRegistrosExtracto = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalCreditoExtracto += reg.montocredito;
      this.totalDebitoExtracto += reg.montodebito;
      this.totalRegistrosExtracto += 1;
    }
  }

  public totalesAjusteLibro(lista: any) {
    this.totalAjusteCreditoLibro = 0;
    this.totalAjusteDebitoLibro = 0;
    this.totalAjusteRegistrosLibro = 0;

    for (const i in lista) {
      const reg = lista[i];
      this.totalAjusteCreditoLibro += reg.montocredito;
      this.totalAjusteDebitoLibro += reg.montodebito;
      this.totalAjusteRegistrosLibro += 2;
    }
  }

  public totalesAjusteExtracto(lista: any) {
    this.totalAjusteCreditoExtracto = 0;
    this.totalAjusteDebitoExtracto = 0;
    this.totalAjusteRegistrosExtracto = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalAjusteCreditoExtracto += reg.montocredito;
      this.totalAjusteDebitoExtracto += reg.montodebito;
      this.totalAjusteRegistrosExtracto += 2;
    }
  }


  public totalesConciliacion(respuesta: any, saldoAnt: any) {
    this.numConciliados = respuesta.numConciliados;
    this.sumaDebitoLb = respuesta.sumaDebitoLb;
    this.sumaCreditoLb = respuesta.sumaCreditoLb;
    this.sumaCreditoEx = respuesta.sumaCreditoEx;
    this.sumaDebitoEx = respuesta.sumaDebitoEx;
    this.saldoAnterior = saldoAnt;
  //  this.saldoLb = respuesta.sumaDebitoLb - respuesta.sumaCreditoLb;

    this.saldoLb = respuesta.sumaCreditoLb - respuesta.sumaDebitoLb;


    this.saldoEx = respuesta.sumaCreditoEx - respuesta.sumaDebitoEx;
    this.saldoFinalLb = (respuesta.sumaDebitoLb - respuesta.sumaCreditoLb) + saldoAnt;
    this.saldoFinalEx = (respuesta.sumaCreditoEx - respuesta.sumaDebitoEx) + saldoAnt;
  }

  clickDebitoMayor(reg) {
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.dtEB.filter(reg.lmontodebito, "montocredito", "equals");
  }

  clickCreditoMayor(reg) {
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.dtEB.filter(reg.lmontocredito, "montodebito", "equals");
  }

  clickDebitoExtracto(reg) {
    this.calcularTotalesMayor(this.lregistrosmayor);
    this.dtMB.filter(reg.montodebito, "lmontocredito", "equals");
  }

  clickCreditoExtracto(reg) {
    this.calcularTotalesExtracto(this.lregistrosmayor);
    this.dtMB.filter(reg.montocredito, "lmontodebito", "equals");
  }

  clickDocumentoExtracto(reg) {
    this.dtMB.filter(reg.documento, "ldocumento", "equals");
  }

  clickDocumentoLibro(reg) {
    this.dtEB.filter(reg.ldocumento, "documento", "equals");
  }

  clickBorrarMayor() {
    this.dtMB.reset();
    this.calcularTotalesMayor(this.lregistrosmayor);
  }

  clickBorrarExtracto() {
    this.dtEB.reset();
    this.calcularTotalesExtracto(this.lregistrosextracto);
  }

  changeSort(event) {
    if (!event.order) {
      this.sortFex = 'fmovimiento';
    } else {
      this.sortFex = event.field;
    }
  }

  changeSortLibro(event) {
    if (!event.order) {
      this.sortF = 'fcontable';
    } else {
      this.sortF = event.field;
    }
  }



public buscarLibroBanco(registro: any, tipo: string) {
  this.registroSeleccionado = registro;
  this.registro = this.clone(this.registroSeleccionado);
  if (tipo === "LB") 
    this.mostrarLibroBanco = true;  

   if (tipo === "EB") 
    this.mostrarExtracoBancario = true;  
}


cancelarLibroBanco() {
  this.registro = this.registroSeleccionado;
  this.mostrarLibroBanco = false;
  this.mostrarExtracoBancario = false;

}


verDetalle(reg: any){
  this.conciliacionDocumento = reg.rnumerodocumentobancario;

  this.lregistrosconciliadoFiltro = this.lregistrosconciliado.filter(function (el) {
    return el.rnumerodocumentobancario == reg.rnumerodocumentobancario;
  });
         
  let resultLB = this.lregistrosconciliadoFiltro.map(({ rclibrobanco, mccomprobante, mvalordebito, mvalorcredito }) => ({ rclibrobanco, mccomprobante, mvalordebito, mvalorcredito }));
  let resultEX = this.lregistrosconciliadoFiltro.map(({ rcconconciliacionbancariaextracto, rnumerodocumentobancario, valordebito, valorcredito }) => ({ rcconconciliacionbancariaextracto, rnumerodocumentobancario, valordebito, valorcredito }));
  this.lregistrosConcLB = this.getUniqueListBy(resultLB, 'rclibrobanco');
  this.lregistrosConcEX = this.getUniqueListBy(resultEX, 'rcconconciliacionbancariaextracto');

  this.arrSumaLB = [{
    "sumamvalordebito": this.sumatoriaCampo(this.lregistrosConcLB, "mvalordebito"),
    "sumamvalorcredito": this.sumatoriaCampo(this.lregistrosConcLB, "mvalorcredito")}];

  this.arrSumaEX = [
    {"sumavalordebito": this.sumatoriaCampo(this.lregistrosConcEX, "valordebito"),
    "sumavalorcredito": this.sumatoriaCampo(this.lregistrosConcEX, "valorcredito")}];

  this.mostrarExtracoBancario = true; 
}

verDetalleConciliacion(reg: any){
  this.lregistrosconciliadoFiltro = this.lregistrosconciliado.filter(function (el) {
    return el.rnumerodocumentobancario == reg.rnumerodocumentobancario;
  });

  return this.lregistrosconciliadoFiltro.length > 1 ? true : false;

}


sumatoriaCampo(arreglo: any, campo: string){
  return arreglo.map(item => item[campo]).reduce((prev, curr) => prev + curr, 0);
}

getUniqueListBy(originalArray, prop) {
  var newArray = [];
  var lookupObject  = {};

  for(var i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for(i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}

validarConciliacion(){
  if((this.totalDebitoMayor.toFixed(2) == this.totalCreditoExtracto.toFixed(2) && this.totalDebitoMayor > 0) || (this.totalCreditoMayor.toFixed(2) == this.totalDebitoExtracto.toFixed(2) && this.totalCreditoMayor > 0))
    this.conciliarCasosEspeciales();  
  else
    this.verGrabar = true;
}


conciliarCasosEspeciales() {
  let mensaje: string;
  if (this.totalDebitoMayor.toFixed(2) == this.totalCreditoExtracto.toFixed(2)){
  mensaje = document.getElementsByClassName('ui-confirmdialog-message')[0].innerHTML = "Se han encontrado Totales equivalentes en los registros no conciliados" + "<br>" +
  "<i class=\"ng-tns-c1-0 fa\"></i>" + "Libro Banco: <b>" + this.totalDebitoMayor.toFixed(2) + "</b><br>" +
  "<i class=\"ng-tns-c1-0 fa\"></i>" + "Extracto Bancario: <b>" + this.totalCreditoExtracto.toFixed(2) + "</b><br>" +
  "<i class=\"ng-tns-c1-0 fa\"></i>" + "¿ Desea completar la concilicación ?";
  } else if (this.totalCreditoMayor.toFixed(2) == this.totalDebitoExtracto.toFixed(2)){
    mensaje = document.getElementsByClassName('ui-confirmdialog-message')[0].innerHTML = "Se han encontrado Totales equivalentes en los registros no conciliados" + "<br>" +
    "<i class=\"ng-tns-c1-0 fa\"></i>" + "Libro Banco: <b>" + this.totalCreditoMayor.toFixed(2) + "</b><br>" +
    "<i class=\"ng-tns-c1-0 fa\"></i>" + "Extracto Bancario: <b>" + this.totalDebitoExtracto.toFixed(2) + "</b><br>" +
    "<i class=\"ng-tns-c1-0 fa\"></i>" + "¿ Desea completar la concilicación ?";
  }

  this.confirmationService.confirm({
    message: mensaje,
    header: 'Completar Conciliación',
    accept: () => {
      this.ConsultarDatos(1);
      this.verGrabar = true;      
    },
    reject: () => {
      this.verGrabar = false;
    }
  });

}

cancelarConciliacion(){
  this.verGrabar = false;
}


cerrarDialogoSolicitud(){
  this.mostrarExtracoBancario = false;
}

filtrarDoc(doc){
  let javascript_freelancers = this.lregistrosconciliado.filter(function(freelancer) {
    return freelancer.skill == doc; });

  return javascript_freelancers;

}


}