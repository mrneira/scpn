import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { LovCuentasContablesComponent } from '../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: "app-cxc-mantenimientofp",
  templateUrl: "mantenimientofp.html"
})

export class MantenimientoFPComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;
  @ViewChild(LovCuentasContablesComponent)
  private lovcuentascontables: LovCuentasContablesComponent;

  permiteEliminar = false;
  ffactura: Date;
  public estadosFP: SelectItem[] = [{ label: '...', value: null }];
  listaUpd = [];
  listaEli = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "tconfacturaparqueadero", "FACTPARQ", false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.ffactura = this.fechaactual;
    this.crearNuevo();
    this.consultarCatalogos();
  }

  ngAfterViewInit() { }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    super.crearNuevo();
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

  // Inicia CONSULTA *********************
  consultar() {
    if (this.mcampos.ffactura == undefined) {
      super.mostrarMensajeError('FILTROS DE CONSULTA REQUERIDOS');
      return;
    }
    const anio = this.mcampos.ffactura.getFullYear();
    const mes = this.mcampos.ffactura.getMonth() + 1;
    const dia = this.mcampos.ffactura.getDate();
    
    this.mfiltrosesp.ffactura = 'between \'' + anio + "/" + mes + "/" + dia + " 0:00:00\'" + ' and \'' + anio + "/" + mes + "/" + dia + " 23:59:59\'" + ' ';
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.mfiltros.estadocdetalle = 'INGRES';
    const consulta = new Consulta(this.entityBean, "Y", "t.cfacturaparqueadero", this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcomprobante', 'eliminado', 'eliminado', 'i.ccomprobante = t.ccomprobante');
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() { }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    const lista = resp.FACTPARQ;
    for (const i in lista) {
      const reg = lista[i];
      if (reg.estadocdetalle == "CONTAB" && reg.mdatos["eliminado"]) {
        reg.estadocdetalle = "ELIMIN";
        this.listaUpd.push(reg);
      }
      if (reg.estadocdetalle == "INGRES") {
        this.listaEli.push(reg);
      }
    }
    this.permiteEliminar = (this.listaUpd.length > 0 || this.listaEli.length > 0);
  }
  // Fin CONSULTA *********************

  eliminarfacturas() {
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.lregistroseliminar = this.listaEli;
    this.lregistros = this.listaUpd;
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.lregistros = [];
    this.listaEli = [];
    this.listaUpd = [];
    this.permiteEliminar = (this.listaUpd.length > 0 || this.listaEli.length > 0);
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosEstadoCatalogo: any = { 'ccatalogo': 1025 };
    const consultaEstadoCatalogo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadoCatalogo, {});
    consultaEstadoCatalogo.cantidad = 50;
    this.addConsultaPorAlias('ESTADOSCATALOGO', consultaEstadoCatalogo);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.estadosFP, resp.ESTADOSCATALOGO, 'cdetalle');
    }
    this.lconsulta = [];
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  mostrarlovcuentascontables(): void {
    this.lovcuentascontables.mfiltros.activa = true;
    this.lovcuentascontables.mfiltros.padre = '110101';
    this.lovcuentascontables.mfiltros.movimiento = true;
    this.lovcuentascontables.consultar();
    this.lovcuentascontables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cctacajaparqueadero = reg.registro.ccuenta;
      this.rqMantenimiento.mdatos.cctacajaparqueadero = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.lregistros = [];
      this.consultar();
    }
  }
}