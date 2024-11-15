import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-camposArchivo',
  templateUrl: 'camposArchivo.html'
})
export class CamposArchivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lclase: SelectItem[] = [{label: '...', value: null}];
  public ltarchivos: SelectItem[] = [{label: '...', value: null}];
  public ltipodato: SelectItem[] = [{label: '...', value: null}];
  public lformatofecha: SelectItem[] = [{label: '...', value: null}];

  public lmodulos: SelectItem[] = [{label: '...', value: null}];

  public ltarchivostotal: any = [];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCargaCampos', 'TGENCARGACAMPOS', false, true);
    this.componentehijo = this;


  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.llenarTipoDato();
    this.llenarFormatoFecha();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipoarchivo)) {
      this.mostrarMensajeError('ARCHIVO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cmodulo = this.mfiltros.cmodulo;
    this.registro.ctipoarchivo = this.mfiltros.ctipoarchivo;
    this.registro.requerido = false;
  }

  actualizar() {

   
    if (this.registro.tipo === 'fecha') {
      if (this.estaVacio(this.registro.formatofecha))
        this.mostrarMensajeError("SI EL TIPO DE DATO ES fecha, debe seleccionar un formato ");
      return;
    }
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccampo', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCargaArchivo', 'nombre', 'ntipoarchivo', 'i.cmodulo = t.cmodulo and i.ctipoarchivo =  t.ctipoarchivo');
    //exit
    consulta.addSubquery('TgenCargaArchivo', 'separadorcolumnas', 'nseparadorcolumnas', 'i.cmodulo = t.cmodulo and i.ctipoarchivo =  t.ctipoarchivo');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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

  consultarCatalogos(): void {
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

    const mfiltrosArchivo: any = {};
    const consultaArchivo = new Consulta('TgenCargaArchivo', 'Y', 't.ctipoarchivo', mfiltrosArchivo, {});
    consultaArchivo.cantidad = 50;
    this.addConsultaPorAlias('ARCHIVO', consultaArchivo);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulos, resp.MODULO, 'cmodulo');
      this.ltarchivostotal = resp.ARCHIVO;

    }
    this.lconsulta = [];
  }

  llenarTipoDato() {
    this.ltipodato = [];

    this.ltipodato.push({label: '...', value: null});
    this.ltipodato.push({label: 'fecha', value: 'Date'});
    this.ltipodato.push({label: 'string', value: 'String'});
    this.ltipodato.push({label: 'int', value: 'Int'});
    this.ltipodato.push({label: 'long', value: 'Long'});
    this.ltipodato.push({label: 'decimal', value: 'Decimal'});
  }

  llenarFormatoFecha() {
    this.lformatofecha = [];
    this.lformatofecha.push({label: '...', value: null});
    this.lformatofecha.push({label: 'MM/dd/yyyy', value: 'MM/dd/yyyy'});
    this.lformatofecha.push({label: 'dd/MM/yyyy', value: 'dd/MM/yyyy'});
    this.lformatofecha.push({label: 'yyyy/MM/dd', value: 'yyyy/MM/dd'});
  }

  public cambiarModulo(event: any) {
    this.fijarListaArchivos(Number(event.value));
  }

  fijarListaArchivos(cmodulo: any) {
    this.ltarchivos = [];

    this.ltarchivos.push({label: '...', value: null});
    for (const i in this.ltarchivostotal) {
      if (this.ltarchivostotal.hasOwnProperty(i)) {
        const reg: any = this.ltarchivostotal[i];
        if (reg !== undefined && reg.nombre !== null && reg.cmodulo === Number(cmodulo)) {
          this.ltarchivos.push({label: reg.nombre, value: reg.ctipoarchivo});
        }
      }
    }
  }

}
