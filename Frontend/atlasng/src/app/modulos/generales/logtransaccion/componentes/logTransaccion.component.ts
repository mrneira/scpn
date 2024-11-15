import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {ModulosComponent} from '../../../generales/modulos/componentes/modulos.component';

@Component({
  selector: 'app-logtransaccion',
  templateUrl: 'logTransaccion.html'
})
export class LogTransaccionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private modulos: ModulosComponent;

  public lmodulos: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenTransaccionLog', 'LOGTRANSACCION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
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
    if (registro.tipo === 'C') {
      this.mcampos.ntipo = 'CONSULTA';
    }
    else {
      this.mcampos.ntipo = 'MANTENIMIENTO';
    }
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.freal desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenmodulo','nombre','nmodulo','t.cmodulo = i.cmodulo');
    consulta.addSubquery('tgentransaccion','nombre','ntransaccion','t.cmodulo = i.cmodulo and t.ctransaccion = i.ctransaccion');
    consulta.addSubqueryPorSentencia('select p.nombre from tsegusuariodetalle u, tperpersonadetalle p '+
    'where u.cpersona = p.cpersona and u.verreg = 0 and u.verreg = p.verreg and u.ccompania = p.ccompania and u.cusuario = t.cusuario','nombre')
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return this.validaFiltrosRequeridos('ES REQUERIDO AL MENOS UN FILTRO DE BÚSQUEDA');
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
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
    const mfiltrosModulo: any = {'activo': true};
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosModulo, {});
    consultaModulo.cantidad = 50;
    this.addConsultaPorAlias('MODULO', consultaModulo);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulos, resp.MODULO, 'cmodulo');

    }
    this.lconsulta = [];
  }

}
