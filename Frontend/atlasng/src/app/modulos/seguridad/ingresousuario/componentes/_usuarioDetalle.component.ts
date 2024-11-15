import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';


@Component({
  selector: 'app-usuario-detalle',
  templateUrl: '_usuarioDetalle.html'
})
export class UsuarioDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lidiomas: SelectItem[] = [{label: '...', value: null}];
  public lcanales: SelectItem[] = [{label: '...', value: null}];
  public lareas: SelectItem[] = [{label: '...', value: null}];
  public lsucursales: SelectItem[] = [{label: '...', value: null}];
  public lagenciastotal: any = [];
  public lagencias: SelectItem[] = [{label: '...', value: null}];

  public desabilita = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegUsuarioDetalle', 'USUARIODETALLE', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.verreg = 0;
    this.registro.optlock = 0;
    this.registro.cidioma = 'ES';
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
  }

  // Inicia CONSULTA *********************

  consultar() {
    super.encerarConsulta();
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cusuario', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.registro.esnuevo = true;
    if (this.registro.csucursal !== undefined) {
      this.fijarListaAgencias(this.registro.csucursal);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();
    this.lmantenimiento = []; // Encerar Mantenimiento
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
  }

  public cambiarSucursal(event: any) {
    this.fijarListaAgencias(Number(event.value));
  }

  fijarListaAgencias(csucursal: any) {
    this.lagencias = [];

    this.lagencias.push({label: '...', value: null});
    for (const i in this.lagenciastotal) {
      if (this.lagenciastotal.hasOwnProperty(i)) {
        const reg: any = this.lagenciastotal[i];
        if (reg !== undefined && reg.value !== null && reg.csucursal === Number(csucursal)) {
          this.lagencias.push({label: reg.nombre, value: reg.cagencia});
        }
      }
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const consultaIdioma = new Consulta('TgenIdioma', 'Y', 't.nombre', {}, {});
    consultaIdioma.cantidad = 50;
    this.addConsultaPorAlias('IDOMA', consultaIdioma);

    const consultaCanal = new Consulta('TgenCanales', 'Y', 't.nombre', {}, {});
    consultaCanal.cantidad = 50;
    this.addConsultaPorAlias('CANALES', consultaCanal);

    const consultaArea = new Consulta('TgenArea', 'Y', 't.nombre', {}, {});
    consultaArea.cantidad = 50;
    this.addConsultaPorAlias('AREA', consultaArea);

    const consultaSocursal = new Consulta('TgenSucursal', 'Y', 't.nombre', {}, {});
    consultaSocursal.cantidad = 50;
    this.addConsultaPorAlias('SUCURSAL', consultaSocursal);

    const consultaAgencia = new Consulta('TgenAgencia', 'Y', 't.nombre', {}, {});
    consultaSocursal.cantidad = 50;
    this.addConsultaPorAlias('AGENCIA', consultaAgencia);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lidiomas, resp.IDOMA, 'cidioma');
      this.llenaListaCatalogo(this.lcanales, resp.CANALES, 'ccanal');
      this.llenaListaCatalogo(this.lareas, resp.AREA, 'carea');
      this.llenaListaCatalogo(this.lsucursales, resp.SUCURSAL, 'csucursal');
      this.lagenciastotal = resp.AGENCIA;

    }
    this.lconsulta = [];
  }
}
