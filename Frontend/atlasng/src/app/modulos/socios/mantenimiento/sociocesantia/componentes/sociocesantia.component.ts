import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovSociosComponent } from '../../../lov/socios/componentes/lov.socios.component';
import { LovUbicacionesComponent } from '../../../lov/ubicaciones/componentes/lov.ubicaciones.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { TipoBajaComponent } from '../../../parametros/tipobaja/componentes/tipobaja.component';
import { TipoPoliciaComponent } from '../../../parametros/tipopolicia/componentes/tipopolicia.component';
import { UbicacionComponent } from '../../../parametros/ubicacion/componentes/ubicacion.component';
import { TipoGradoComponent } from '../../../parametros/tipogrado/componentes/tipoGrado.component';


@Component({
  selector: 'app-sociocesantia',
  templateUrl: 'sociocesantia.html'
})
export class SocioCesantiaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovSociosComponent)
  private lovSocios: LovSociosComponent;

  @ViewChild(LovUbicacionesComponent)
  private lovUbicaciones: LovUbicacionesComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  private tipoBajaComponent: TipoBajaComponent;
  private tipoPoliciaComponent: TipoPoliciaComponent;
  private ubicacionComponent: UbicacionComponent;
  private tipoGradoComponent: TipoGradoComponent;

  public lestado: SelectItem[] = [{label: '...', value: null}];
  public ltipobaja: SelectItem[] = [{label: '...', value: null}];
  public ljerarquia: SelectItem[] = [{label: '...', value: null}];
  public lgrado: SelectItem[] = [{label: '...', value: null}];
  public ltipopolicia: SelectItem[] = [{label: '...', value: null}];
  public lestadocivil: SelectItem[] = [{label: '...', value: null}];
  public lgenero: SelectItem[] = [{label: '...', value: null}];
  public lcargo: SelectItem[] = [{label: '...', value: null}];
  public lubicacion: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsocCesantia', 'TSOCCESANTIA', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

   selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.optlock = 0;
    this.registro.ccatalogoestado = 24;
    this.registro.ccatalogotipocargo = 2702;
    this.registro.ccatalogoestadocivil = 301;
    this.registro.ccatalogogenero = 302;


  }

  actualizar() {
    this.registro.optlock = 0;
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consulta = new Consulta(this.entityBean, 'Y', 't.cubicacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsocTipoGrado', 'cdetallejerarquia', 'cjerarquia', 'i.cgrado = t.cgrado');
    consulta.addSubquery('TsocUbicacion', 'sector', 'sector', 'i.cubicacion = t.cubicacion');
    consulta.addSubqueryPorSentencia('select p.nombre from ' + this.obtenerBean('TsocUbicacion') + ' u, ' + this.obtenerBean('TgenPais') + ' p where ' +
                                     't.cubicacion = u.cubicacion and u.cpais = p.cpais','npais');
    consulta.addSubqueryPorSentencia('select p.nombre from ' + this.obtenerBean('TsocUbicacion') + ' u, ' + this.obtenerBean('TgenProvincia') + ' p where ' +
                                     't.cubicacion = u.cubicacion and u.cpprovincia = p.cpprovincia and u.cpais = p.cpais','nprovincia');
    consulta.addSubqueryPorSentencia('select p.nombre from ' + this.obtenerBean('TsocUbicacion') + ' u, ' + this.obtenerBean('TgenCanton') + ' p where ' +
                                     't.cubicacion = u.cubicacion and u.ccanton = p.ccanton and u.cpprovincia = p.cpprovincia and u.cpais = p.cpais','ncanton');
    consulta.addSubqueryPorSentencia('select p.nombre from ' + this.obtenerBean('TsocUbicacion') + ' u, ' + this.obtenerBean('TgenCiudad') + ' p where ' +
                                     't.cubicacion = u.cubicacion and u.cciudad = p.cciudad and u.ccanton = p.ccanton and u.cpprovincia = p.cpprovincia and u.cpais = p.cpais','nciudad');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
  return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    // this.registro.mdatos.nubicacion = 'PAIS: ' + this.registro.mdatos.npais + ' - PROVINCIA ' + this.registro.mdatos.nprovincia + ' - CANTON ' + this.registro.mdatos.ncanton + ' - CIUDAD ' + this.registro.mdatos.nciudad + ' - SECTOR: ' + this.registro.mdatos.sector;
    this.registro.mdatos.nubicacion = 'PROVINCIA ' + this.registro.mdatos.nprovincia + ' - CANTON ' + this.registro.mdatos.ncanton + ' - CIUDAD ' + this.registro.mdatos.nciudad + ' - SECTOR: ' + this.registro.mdatos.sector;
    this.consultarGrados();
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  /**Muestra lov de ubicaciones */
  mostrarLovUbicaciones(): void {
    this.lovUbicaciones.showDialog();
  }

  /**Retorno de lov de ubicaciones. */
  fijarLovUbicacionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      // this.registro.mdatos.nubicacion = 'PAIS: ' + reg.registro.mdatos.npais + ' - PROVINCIA ' + reg.registro.mdatos.nprovincia + ' - CANTON: ' + reg.registro.mdatos.ncanton + ' - CIUDAD: ' + reg.registro.mdatos.nciudad + ' - SECTOR: ' + reg.registro.sector;
      this.registro.mdatos.nubicacion = 'PROVINCIA ' + reg.registro.mdatos.nprovincia + ' - CANTON: ' + reg.registro.mdatos.ncanton + ' - CIUDAD: ' + reg.registro.mdatos.nciudad + ' - SECTOR: ' + reg.registro.sector;
      this.registro.cubicacion = reg.registro.cubicacion;
    }
  }

  /**Muestra lov de socios */
  mostrarLovSocios(): void {
    this.lovSocios.showDialog();
  }

  /**Retorno de lov de socios. */
  fijarLovSociosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.csocio = reg.registro.cpersona;
      this.mcampos.nsocio = reg.registro.mdatos.npersona;

      this.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();
    }
  }

  mostrarGrados(): void {
    this.lgrado = [];
    if(this.registro.mdatos.cjerarquia != null){
      this.consultarGrados();
    }
  }

  consultarGrados(): void {
    this.encerarConsultaCatalogos();

    this.tipoGradoComponent = new TipoGradoComponent(this.router, this.dtoServicios);

    this.tipoGradoComponent.mfiltros.cdetallejerarquia = this.registro.mdatos.cjerarquia;
    const conTipoGrado = this.tipoGradoComponent.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOGRADO', conTipoGrado, this.lgrado, super.llenaListaCatalogo);

    this.ejecutarConsultaCatalogos();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);

    catalogoDetalle.mfiltros.ccatalogo = 24;
    const conEstado = catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos(catalogoDetalle.alias, conEstado, this.lestado, super.llenaListaCatalogo, 'cdetalle');

    this.tipoBajaComponent = new TipoBajaComponent(this.router, this.dtoServicios);
    const conTipoBaja = this.tipoBajaComponent.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOBAJA', conTipoBaja, this.ltipobaja, super.llenaListaCatalogo);

    catalogoDetalle.mfiltros.ccatalogo = 2701;
    const conJerarquia = catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos("TGENJERARQUIAS", conJerarquia, this.ljerarquia, super.llenaListaCatalogo, 'cdetalle');

    this.tipoPoliciaComponent = new TipoPoliciaComponent(this.router, this.dtoServicios);
    const conTipoPolicia = this.tipoPoliciaComponent.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOPOLICIA', conTipoPolicia, this.ltipopolicia, super.llenaListaCatalogo);

    catalogoDetalle.mfiltros.ccatalogo = 301;
    const conEstadoCivil = catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('ESTADOCIVIL', conEstadoCivil, this.lestadocivil, super.llenaListaCatalogo, 'cdetalle');

    catalogoDetalle.mfiltros.ccatalogo = 302;
    const conGenero = catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('GENERO', conGenero, this.lgenero, super.llenaListaCatalogo, 'cdetalle');

    catalogoDetalle.mfiltros.ccatalogo = 2702;
    const conCargo = catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CARGO', conCargo, this.lcargo, super.llenaListaCatalogo, 'cdetalle');

    this.ubicacionComponent = new UbicacionComponent(this.router, this.dtoServicios);
    const conUbicacion = this.ubicacionComponent.crearDtoConsulta();
    this.addConsultaCatalogos('UBICACION', conUbicacion, this.lubicacion, super.llenaListaCatalogo,'cubicacion');

    this.ejecutarConsultaCatalogos();
  }
}
