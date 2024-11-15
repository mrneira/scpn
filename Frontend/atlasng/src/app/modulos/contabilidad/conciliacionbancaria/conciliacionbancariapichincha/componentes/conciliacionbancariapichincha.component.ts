import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  HostListener
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem, DataTable } from "primeng/primeng";
import { LovBancosComponent } from "../../../../contabilidad/lov/bancos/componentes/lov.bancos.component";
import { ConfirmationService } from "primeng/primeng";

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: "app-conciliacionbancariapichincha",
  templateUrl: "conciliacionbancariapichincha.html"
})
export class ConciliacionBancariaPichinchaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(LovBancosComponent)
  lovCuentasContables: LovBancosComponent;

  @ViewChild("dtMB") dtMB: DataTable;
  @ViewChild("dtEB") dtEB: DataTable;
  @ViewChild("dtCA") dtCA: DataTable;

  fecha = new Date();
  public lregistrosmayor: any = [];
  public lregistrosextracto: any = [];
  public lregistrosconciliado: any = [];
  public lregistroscash: any = [];
  public lregistroscashgrabar: any = [];
  public lregistrosparqueadero: any = [];

  public coloractual: string;

  public lhojatrabajo: any = [];
  public lregistrosTotales: any = [];
  public lregistrosTmp: any = [];
  public lregistrosmanual: any = [];
  public ccuenta: string;
  public ncuenta: string;

  public totalCreditoMayor: Number = 0;
  public totalDebitoMayor: Number = 0;
  public totalRegistrosMayor = 0;

  public totalCreditoExtracto: Number = 0;
  public totalDebitoExtracto: Number = 0;
  public totalRegistrosExtracto = 0;

  public totalCreditoCash = 0;
  public totalRegistrosCash = 0;

  public selectedMayor: any = [];
  public selectedExtracto: any = [];
  public selectedCash: any = [];
  public sortF: string = '';

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(
      router,
      dtoServicios,
      "tconconciliacionbancaria",
      "CONCILIACIONBANCARIA",
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
    //this.obtenerParametros();
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
  }

  ngAfterViewInit() {
    this.encerarTotales();
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  cancelarConciliacion() {
    if (
      this.rqMantenimiento.lregistrosTmp == undefined ||
      this.rqMantenimiento.lregistrosTmp.length == 0
    ) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS EN LA HOJA DE TRABAJO");
    } else {
      this.encerarMensajes();
      for (const i in this.rqMantenimiento.lregistrosTmp) {
        if (this.rqMantenimiento.lregistrosTmp.hasOwnProperty(i)) {
          if (
            this.rqMantenimiento.lregistrosTmp[i].mdatos.nccomprobante !=
            undefined &&
            !this.estaVacio(
              this.rqMantenimiento.lregistrosTmp[i].mdatos.nccomprobante
            )
          ) {
          }

          if (
            this.rqMantenimiento.lregistrosTmp[i].mdatos.nfecha != undefined &&
            !this.estaVacio(
              this.rqMantenimiento.lregistrosTmp[i].mdatos.nfecha
            ) &&
            this.rqMantenimiento.lregistrosTmp[i].mdatos.nfecha > 0
          ) {
          }
        }
      }
    }
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
    this.lhojatrabajo.push(reg);
    this.lregistrosTmp.push(reg);
    this.eliminarelemento(this.lregistrosmayor, reg);
    this.calcularTotalesMayor(this.lregistrosmayor);
    this.sumaconciliacion();
  }

  agregarhojatrabajoextracto(reg: any) {
    this.lhojatrabajo.push(reg);
    this.lregistrosTmp.push(reg);
    this.eliminarelemento(this.lregistrosextracto, reg);
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.sumaconciliacion();
  }

  agregarhojatrabajocash(reg: any) {
    this.lhojatrabajo.push(reg);
    this.lregistrosTmp.push(reg);
    this.eliminarelemento(this.lregistroscash, reg);
    this.calcularTotalesCash(this.lregistroscash);
    this.sumaconciliacion();
  }

  sumaconciliacion() {
    this.lregistrosTotales = [];
    let sumaMDebito, sumaMCredito, sumaEDebito, sumaECredito, sumaCCredito: number;
    sumaMDebito = 0;
    sumaMCredito = 0;
    sumaEDebito = 0;
    sumaECredito = 0;
    sumaCCredito = 0;
    for (const i in this.lregistrosTmp) {
      if (this.lregistrosTmp.hasOwnProperty(i)) {
        const reg = this.lregistrosTmp[i];
        sumaMDebito +=
          reg.mvalordebito === undefined || reg.mvalordebito === null
            ? 0
            : Number(reg.mvalordebito);
        sumaMCredito +=
          reg.mvalorcredito === undefined || reg.mvalorcredito === null
            ? 0
            : Number(reg.mvalorcredito);
        sumaEDebito +=
          reg.valordebito === undefined || reg.valordebito === null
            ? 0
            : Number(reg.valordebito);
        sumaECredito +=
          reg.valorcredito === undefined || reg.valorcredito === null
            ? 0
            : Number(reg.valorcredito);
        sumaCCredito +=
          reg.valorprocesado === undefined || reg.valorprocesado === null
            ? 0
            : Number(reg.valorprocesado);
      }
    }
    let total = {
      mvalorcredito: this.redondear(sumaMCredito, 2),
      mvalordebito: this.redondear(sumaMDebito, 2),
      valorcredito: this.redondear(sumaECredito, 2),
      valordebito: this.redondear(sumaEDebito, 2),
      valorcreditoC: this.redondear(sumaCCredito, 2),
      saldo: this.redondear(
        sumaCCredito - sumaMDebito, 2
      )
    };
    this.lregistrosTotales.push(total);
  }

  conciliar() {
    this.selectedMayor = [];
    this.selectedExtracto = [];
    this.selectedCash = [];
    this.lregistroscashgrabar = [];
    if (this.lregistrosTmp == undefined || this.lregistrosTmp.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS EN LA HOJA DE TRABAJO");
    } else {
      this.encerarMensajes();
      if (this.lregistrosTotales[0].saldo != 0 || this.lregistrosTotales[0].valorcredito !== this.lregistrosTotales[0].valorcreditoC) {
        this.mostrarMensajeError(
          "NO CUADRAN LOS VALORES ENTRE EL MAYOR Y EL EXTRACTO BANCARIO Y CASH EN " +
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
      let id = this.lregistrosconciliado.length + 1;
      let lconciliacionbancariaid: number = parseInt(lfechastr + lhorastr, 10);

      for (const i in this.lhojatrabajo) {
        if (this.lhojatrabajo.hasOwnProperty(i)) {
          const regmayor = this.lhojatrabajo[i];
          if (regmayor.mmayor) {
            for (const i in this.lhojatrabajo) {
              if (this.lhojatrabajo.hasOwnProperty(i)) {
                const reg = this.lhojatrabajo[i];
                if (reg.extracto) {
                  this.lregistrosconciliado.push({
                    rconciliacionbancariaid: id,
                    rcodigounico: lconciliacionbancariaid,
                    mccomprobante: regmayor.mccomprobante,
                    msecuencia: regmayor.msecuencia,
                    mfcontable: regmayor.mfcontable,
                    fecha: reg.fecha,
                    mvalordebito: regmayor.mvalorcredito,
                    mvalorcredito: regmayor.mvalordebito,
                    conconciliacionbancariaextracto: reg.cconconciliacionbancariaextracto,
                    valordebito: reg.valordebito,
                    valorcredito: reg.valorcredito,
                    rconciliado: true,
                    rautomatico: false,
                  });
                }
                id += 1;
              }
            }
          }
          if (!regmayor.extracto && !regmayor.mmayor) {
            this.lregistroscashgrabar.push(regmayor);
          }
        }
      }
      this.lhojatrabajo = [];
      this.lregistrosTotales = [];
      this.lregistrosTmp = [];
    }
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
    this.ajusteParqueadero();
    this.ajusteMayor();
    if (
      this.lregistrosconciliado.length == 0 && this.selectedExtracto.length == 0 && this.selectedMayor.length == 0
      && this.lregistrosparqueadero.length == 0
    ) {
      this.mostrarMensajeError(
        "NO EXISTEN REGISTROS EN LA CONCILIACION. PROCESO CANCELADO"
      );
    } else {
      this.encerarMensajes();

      this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;
      this.rqMantenimiento.lregistrosgrabar = this.lregistrosconciliado;
      this.rqMantenimiento.lregistrosajustemayor = this.selectedMayor;
      this.rqMantenimiento.lregistrosajustextracto = this.selectedExtracto;
      this.rqMantenimiento.lregistroscashgrabar = this.lregistroscashgrabar;
      this.rqMantenimiento.lregistrosparqueadero = this.lregistrosparqueadero;
      this.crearDtoMantenimiento();

      super.grabar();
      this.limpiarAplicacion();
      //this.ConsultarDatos();
    }
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

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === "OK") {
    }
    this.lconsulta = [];
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog();
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
    this.lregistroscashgrabar = [];
    this.selectedExtracto = [];
    this.selectedMayor = [];
    this.lregistrosparqueadero = [];
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
        if (reg.mmayor) {
          this.lregistrosmayor.push(reg);
        }
        if (reg.extracto) {
          this.lregistrosextracto.push(reg);
        }
        else {
          this.lregistroscash.push(reg);
        }
      }
    }
    this.calcularTotalesMayor(this.lregistrosmayor);
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.calcularTotalesCash(this.lregistroscash);
    this.lhojatrabajo = [];
    this.lregistrosTotales = [];
    this.lregistrosTmp = [];
  }

  obtenerParametros() {
    const rqConsulta: any = new Object();

    rqConsulta.CODIGOCONSULTA = "CONCILIACIONPARAMETROS";
    rqConsulta.ccuenta = this.mcampos.ccuenta;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== "OK") {
          return;
        }
        let mRegistrosParametros: any = resp.CONCILIACIONPARAMETROS;

        this.mcampos.junturavalor = 1;

        for (const j in mRegistrosParametros) {
          if (mRegistrosParametros.hasOwnProperty(j)) {
            if (
              mRegistrosParametros[j].codigo ==
              "CONCILIA_JUNTURA_POR_APELLIDOS_Y_NOMBRES"
            ) {
              this.mcampos.junturaapellidosnombres =
                mRegistrosParametros[j].numero;
            }
            if (
              mRegistrosParametros[j].codigo == "CONCILIA_JUNTURA_POR_CEDULA"
            ) {
              this.mcampos.junturacedula = mRegistrosParametros[j].numero;
            }
            if (
              mRegistrosParametros[j].codigo ==
              "CONCILIA_JUNTURA_POR_CREDENCIAL"
            ) {
              this.mcampos.junturacredencial = mRegistrosParametros[j].numero;
            }
            if (
              mRegistrosParametros[j].codigo == "CONCILIA_JUNTURA_POR_FECHA"
            ) {
              this.mcampos.junturafecha = mRegistrosParametros[j].numero;
            }
            if (
              mRegistrosParametros[j].codigo ==
              "CONCILIA_JUNTURA_POR_NO_DOCUMENTO"
            ) {
              this.mcampos.junturanumerodocumento =
                mRegistrosParametros[j].numero;
            }
          }
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
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
      let lconciliacion: any = [];

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
              rmnumerodocumentobancario: this.lregistrosTmp[i]
                .numerodocumentobancario,
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
              rmnumerodocumentobancario: this.lregistrosTmp[i]
                .numerodocumentobancario,
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
    rqConsulta.CODIGOCONSULTA = "CONCILIACIONMAYOR";

    this.dtoServicios.ejecutarConsultaRest(rqConsulta).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== "OK") {
          return;
        }
        this.lregistros = resp.CONCILIACIONMAYOR;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  ConsultarDatos() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = "CONCILIACIONBANCARIAPICHINCHA";
    rqConsulta.ccuenta = this.mcampos.ccuenta;
    rqConsulta.estadoconciliacioncdetalle = "2";
    rqConsulta.finicio = this.mcampos.finicio;
    rqConsulta.ffin = this.mcampos.ffin;
    this.dtoServicios.ejecutarConsultaRest(rqConsulta).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        if (resp.cod !== "OK") {
          return;
        }
        this.selectedMayor = [];
        this.selectedExtracto = [];
        this.lregistrosmayor = resp.MAYOR;
        this.lregistrosextracto = resp.EXTRACTO;
        this.lregistroscash = resp.CASH;
        this.lregistrosconciliado = resp.CONCILIACIONRESULTADO;
        this.calcularTotalesMayor(this.lregistrosmayor);
        this.calcularTotalesExtracto(this.lregistrosextracto);
        this.calcularTotalesCash(this.lregistroscash);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  customize(rowData: any): string {
    //return rowData +  "{background-color: #dff0d8;color: #FFFFFF;}"
    return "";
  }

  cambiarcoloractual(): string {
    if (this.coloractual === "yellow") {
      return "white";
    }
    return "yellow";
  }

  eliminarConciliado(reg: any) {
    if (reg.rautomatico) {
      this.lregistrosmayor.push(reg);
      this.lregistrosextracto.push(reg);
    } else {
      if (reg.mmayor) {
        this.lregistrosmayor.push({
          mccomprobante: reg.rccomprobante,
          mnumerodocumentobancario: reg.mnumerodocumentobancario,
          mfcontable: reg.rfcontable,
          mmonto: reg.rvalordebito,
          mcomentario: reg.mcomentario,
          msecuencia: reg.rsecuencia,
          mmodulo: reg.mmodulo,
          mdebito: reg.rvalordebito,
          mvalorcredito: reg.rvalordebito,
          mmayor: true
        });
      }
      if (reg.extracto) {
        this.lregistrosextracto.push({
          fecha: reg.fecha,
          numerodocumentobancario: reg.rnumerodocumentobancario,
          valordebito: reg.valordebito,
          valorcredito: reg.valorcredito,
          concepto: reg.concepto,
          cuentabancaria: reg.cuentabancaria,
          extracto: true
        });
      }
    }
    this.eliminarelemento(this.lregistrosconciliado, reg);
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
      this.totalCreditoMayor += reg.mvalorcredito;
      this.totalDebitoMayor += reg.mvalordebito;
      this.totalRegistrosMayor += 1;
    }
  }

  public calcularTotalesExtracto(lista: any) {
    this.totalCreditoExtracto = 0;
    this.totalDebitoExtracto = 0;
    this.totalRegistrosExtracto = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalCreditoExtracto += reg.valorcredito;
      this.totalDebitoExtracto += reg.valordebito;
      this.totalRegistrosExtracto += 1;
    }
  }

  public calcularTotalesCash(lista: any) {
    this.totalCreditoCash = 0;
    this.totalRegistrosCash = 0;

    for (const i in lista) {
      const reg = lista[i];
      this.totalCreditoCash += reg.valorprocesado;
      this.totalRegistrosCash += 1;
    }
  }

  ajusteMayor() {
    let debitoMayor, creditoMayor: number;
    debitoMayor = 0;
    creditoMayor = 0;
    for (const i in this.selectedMayor) {
      if (this.selectedMayor.hasOwnProperty(i)) {
        const reg = this.selectedMayor[i];
        debitoMayor +=
          reg.mvalordebito === undefined || reg.mvalordebito === null
            ? 0
            : Number(reg.mvalordebito);
        creditoMayor +=
          reg.mvalorcredito === undefined || reg.mvalorcredito === null
            ? 0
            : Number(reg.mvalorcredito);
      }
    }
    if (this.selectedMayor.length == 0){
      return;
    }
    let total = {
      mvalorcredito: this.redondear(debitoMayor, 2),
      mvalordebito: this.redondear(creditoMayor, 2),
      saldo: this.redondear(debitoMayor - creditoMayor, 2)
    };
    if (total.saldo != 0) {
      this.selectedMayor=[];
      this.mostrarMensajeError("VALORES DE CRÉDITO Y DÉBITO NO CUADRAN, AJUSTE MAYOR");
    } else {
      for (const i in this.selectedMayor) {
        if (this.selectedMayor.hasOwnProperty(i)) {
          const reg: any = this.selectedMayor[i];
          this.eliminarelemento(this.lregistrosmayor, reg);
        }
      }
    }
  }

  ajusteExtracto() {
    let debitoExtrato, creditoExtrato: number;
    debitoExtrato = 0;
    creditoExtrato = 0;
    for (const i in this.selectedExtracto) {
      if (this.selectedExtracto.hasOwnProperty(i)) {
        const reg: any = this.selectedExtracto[i];
        debitoExtrato +=
          reg.valordebito === undefined || reg.valordebito === null
            ? 0
            : Number(reg.valordebito);
        creditoExtrato +=
          reg.valorcredito === undefined || reg.valorcredito === null
            ? 0
            : Number(reg.valorcredito);
      }
    }
    let total = {
      mvalorcredito: this.redondear(debitoExtrato, 2),
      mvalordebito: this.redondear(creditoExtrato, 2),
      saldo: this.redondear(debitoExtrato - creditoExtrato, 2)
    };
    if (total.saldo != 0) {
      this.mostrarMensajeError("VALORES DE CRÉDITO Y DÉBITO NO CUADRAN");
    } else {
      for (const i in this.selectedExtracto) {
        if (this.selectedExtracto.hasOwnProperty(i)) {
          const reg: any = this.selectedExtracto[i];
          this.eliminarelemento(this.lregistrosmayor, reg);
        }
      }
    }
  }

  ajusteParqueadero() {
    let debitoMayor, creditoExtracto, debitoExtracto, creditoMayor, saldoDebito , saldoCredito,
     evalorcredito, evalordebito, mvalordebito, mvalorcredito: number;
    debitoMayor = 0;
    creditoExtracto = 0;
    debitoExtracto = 0;
    creditoMayor = 0;
    saldoDebito = 0;
    saldoCredito = 0;
    evalorcredito = 0;
    evalordebito = 0;
    mvalordebito = 0;
    mvalorcredito = 0;
    for (const i in this.selectedExtracto) {
      if (this.selectedExtracto.hasOwnProperty(i)) {
        const reg: any = this.selectedExtracto[i];
        creditoExtracto +=
          reg.valorcredito === undefined || reg.valorcredito === null
            ? 0
            : Number(reg.valorcredito);
            debitoExtracto +=
          reg.valordebito === undefined || reg.valordebito === null
            ? 0
            : Number(reg.valordebito);
      }
    }

    for (const i in this.selectedMayor) {
      if (this.selectedMayor.hasOwnProperty(i)) {
        const reg: any = this.selectedMayor[i];
        debitoMayor +=
          reg.mvalordebito === undefined || reg.mvalordebito === null
            ? 0
            : Number(reg.mvalordebito);
            creditoMayor +=
          reg.mvalorcredito === undefined || reg.mvalorcredito === null
            ? 0
            : Number(reg.mvalorcredito);
      }
    }
    if (this.selectedMayor.length == 0 || this.selectedExtracto.length == 0){
      return;
    }
      evalorcredito = this.redondear(creditoExtracto, 2);
      evalordebito= this.redondear(debitoExtracto, 2);
      mvalordebito= this.redondear(debitoMayor, 2);
      mvalorcredito= this.redondear(creditoMayor, 2);
      saldoDebito= this.redondear(mvalorcredito -evalordebito, 2);
      saldoCredito= this.redondear(mvalordebito - evalorcredito, 2);
    let total = {
      saldo: this.redondear(saldoDebito - saldoCredito, 2)
    };
    if (total.saldo != 0) {
      this.selectedExtracto = [];
      this.selectedMayor = [];
      this.mostrarMensajeError("VALORES DE CRÉDITO Y DÉBITO NO CUADRAN, POR FAVOR VALIDE LOS VALORES");
    } else {
      for (const i in this.selectedExtracto) {
        if (this.selectedExtracto.hasOwnProperty(i)) {
          const reg: any = this.selectedExtracto[i];
          reg.mmayor = false;
          this.lregistrosparqueadero.push(reg);
          this.eliminarelemento(this.lregistrosextracto, reg);
        }
      }
      for (const i in this.selectedMayor) {
        if (this.selectedMayor.hasOwnProperty(i)) {
          const reg: any = this.selectedMayor[i];
          reg.extracto = false;
          this.lregistrosparqueadero.push(reg);
          this.eliminarelemento(this.lregistrosmayor, reg);
        }
      }
      var ldate = new Date();
      let lfechanum: number = this.fechaToInteger(ldate);
      let lhoranum: number = this.horaToInteger(ldate);
      let lfechastr: string = lfechanum.toString().substring(0, 8);
      let lhorastr: string = lhoranum.toString().substring(0, 6);
      let lconciliacionbancariaid: number = parseInt(lfechastr + lhorastr, 10);

      if (this.lregistrosparqueadero.length > 0) {
        this.lregistrosparqueadero.push({ rcodigounico: lconciliacionbancariaid, unico: true, extracto: false, mmayor: false });
      }
      this.selectedExtracto = [];
      this.selectedMayor = [];
      this.calcularTotalesExtracto(this.lregistrosextracto);
      this.calcularTotalesMayor(this.lregistrosmayor);
    }
  }

  clickCreditoCash(reg) {
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.dtEB.filter(reg.valorprocesado, "valorcredito", "equals");
  }

  clickDebitoExtracto(reg) {
    this.calcularTotalesCash(this.lregistroscash);
    this.dtCA.filter(reg.valordebito, "valorprocesado", "equals");
  }

  clickCreditoExtracto(reg) {
    this.calcularTotalesExtracto(this.lregistroscash);
    this.dtCA.filter(reg.valorcredito, "valorprocesado", "equals");
  }

  clickBorrarCash() {
    this.dtCA.reset();
    this.calcularTotalesCash(this.lregistroscash);
  }

  clickBorrarExtracto() {
    this.dtEB.reset();
    this.calcularTotalesExtracto(this.lregistrosextracto);
  }

  clickReferenciaCash(reg) {
    this.dtEB.filter(reg.referencia, "concepto", "contains");
    this.calcularTotalesExtracto(this.lregistroscash);
  }

  clickComprobanteCash(reg) {
    this.dtEB.filter(reg.ccomprobante, "ccomprobante", "contains");
    this.calcularTotalesExtracto(this.lregistroscash);
  }
  
  PasarExtractoHojaTrabajo() {
    for (const i in this.selectedExtracto) {
      if (this.selectedExtracto.hasOwnProperty(i)) {
        const reg = this.selectedExtracto[i];
        this.lhojatrabajo.push(reg);
        this.lregistrosTmp.push(reg);
        this.eliminarelemento(this.lregistrosextracto, reg);
      }
    }
    this.selectedExtracto = [];
    this.calcularTotalesExtracto(this.lregistrosextracto);
    this.sumaconciliacion();
  }

  PasarMayorHojaTrabajo() {
    for (const i in this.selectedMayor) {
      if (this.selectedMayor.hasOwnProperty(i)) {
        const reg = this.selectedMayor[i];
        this.lhojatrabajo.push(reg);
        this.lregistrosTmp.push(reg);
        this.eliminarelemento(this.lregistrosmayor, reg);
      }
    }
    this.calcularTotalesMayor(this.lregistrosextracto);
    this.sumaconciliacion();
  }

  PasarCashHojaTrabajo() {
    for (const i in this.selectedCash) {
      if (this.selectedCash.hasOwnProperty(i)) {
        const reg = this.selectedCash[i];
        this.lhojatrabajo.push(reg);
        this.lregistrosTmp.push(reg);
        this.eliminarelemento(this.lregistroscash, reg);
      }
    }
    this.selectedCash = [];
    this.calcularTotalesMayor(this.lregistrosextracto);
    this.sumaconciliacion();
  }

  totalExtractoDebito(): Number {
    let debito = 0;

    for (const i in this.selectedExtracto) {
      if (this.selectedExtracto.hasOwnProperty(i)) {
        const reg: any = this.selectedExtracto[i];
        debito += super.redondear(reg.valordebito, 2);
      }
    }
    return debito;
  }

  totalExtractoCredito(): Number {
    let credito = 0;

    for (const i in this.selectedExtracto) {
      if (this.selectedExtracto.hasOwnProperty(i)) {
        const reg: any = this.selectedExtracto[i];
        credito += super.redondear(reg.valorcredito, 2);
      }
    }
    return credito;
  }

  totalCashCredito(): Number {
    let credito = 0;

    for (const i in this.selectedCash) {
      if (this.selectedCash.hasOwnProperty(i)) {
        const reg: any = this.selectedCash[i];
        credito += super.redondear(reg.valorprocesado, 2);
      }
    }
    return credito;
  }

  totalMayorDebito(): Number {
    let debito = 0;

    for (const i in this.selectedMayor) {
      if (this.selectedMayor.hasOwnProperty(i)) {
        const reg: any = this.selectedMayor[i];
        debito += super.redondear(reg.mvalordebito, 2);
      }
    }
    return debito;
  }

  totalMayorCredito(): Number {
    let credito = 0;

    for (const i in this.selectedMayor) {
      if (this.selectedMayor.hasOwnProperty(i)) {
        const reg: any = this.selectedMayor[i];
        credito += super.redondear(reg.mvalorcredito, 2);
      }
    }
    return credito;
  }

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'fecha';
    } else {
      this.sortF = event.field;
    }
  }
}
