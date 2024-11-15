import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {NgForm} from '@angular/forms';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-lov-modulo-tareas',
  templateUrl: 'lov.moduloTareas.html'
})
export class LovModuloTareasComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public mostrarModulo = true;
  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TloteTareas', 'LOVLOTETAREAS', false, false);
  }
  // TloteModuloTareas MODULOTAREAS
  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    this.consultarCatalogos();
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctarea', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(50);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({registro: evento.data});
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog(cmodulo: any = null) {
    if (cmodulo !== undefined && cmodulo !== null) {
      this.mfiltros.cmodulo = cmodulo;
      this.mostrarModulo = false;
    }
    this.displayLov = true;
  }

  consultarCatalogos(): any {
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
    const consultaIdioma = new Consulta('TgenModulo', 'Y', 't.nombre', {'activo': true}, {});
    consultaIdioma.cantidad = 50;
    this.addConsultaPorAlias('MODULOS', consultaIdioma);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulo, resp.MODULOS, 'cmodulo');
    }
    this.lconsulta = [];
  }

}
