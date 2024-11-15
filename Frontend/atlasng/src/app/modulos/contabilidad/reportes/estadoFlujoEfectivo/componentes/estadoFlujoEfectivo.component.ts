import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-estado-flujo-efectivo',
  templateUrl: 'estadoFlujoEfectivo.html'
})
export class EstadoFlujoEfectivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ESTADOFLUJOEFECTIVO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.aniofin = this.anioactual;
    this.consultarCatalogos();
    //this.consultar();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'EstadoFlujoEfectivo';
   
    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("SELECCIONE EL TIPO DE PLAN");
      return;
    }

    if (this.estaVacio(this.mcampos.aniofin)) {
      this.mostrarMensajeError("INGRESE EL AÑO DE INICIO");
      return;
    }

    // Agregar parametros
    this.jasper.parametros['@i_anioinicio'] = (this.mcampos.aniofin -1) +'1231';
    this.jasper.parametros['@i_aniofin'] = this.mcampos.aniofin + '1231';
    this.jasper.parametros['@i_tipoplanccatalogo'] = 1001;
    this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoFlujoEfectivo';
    this.jasper.formatoexportar=resp;
    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.ejecutarConsultaCatalogos();
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

     const mfiltrosEstUsr: any = {'ccatalogo': 1001};
    const consultaTipoPlanCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaTipoPlanCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOPLANCUENTA', consultaTipoPlanCuenta);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipoplancuentas, resp.TIPOPLANCUENTA, 'cdetalle');
    }
    this.lconsulta = [];
  }


   // Inicia CONSULTA *********************
   consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 200;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.anioinicio =  (this.mcampos.aniofin -1) +'1231';
    this.mfiltros.aniofin =  this.mcampos.aniofin + '1231';
    this.mfiltros.tipoplanccatalogo = 1001;
    this.mfiltros.tipoplancdetalle = this.mcampos.tipoplancuenta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  grabar(): void {
    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE CUENTA");
        return;
      }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.tipoplanccatalogo = 1001;
    this.rqMantenimiento.mdatos.tipoplancdetalle = this.mcampos.tipoplancuenta;
    this.rqMantenimiento.mdatos.aniofin = this.mcampos.aniofin;
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

  cerrarDialogo() {
  }

}
