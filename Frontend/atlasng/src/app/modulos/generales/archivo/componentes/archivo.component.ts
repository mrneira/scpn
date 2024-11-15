import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';


@Component({
  selector: 'app-archivo',
  templateUrl: 'archivo.html'
})
export class ArchivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  public lcharSeparacion: SelectItem[] = [{label: '...', value: null}];

  public lmodulos: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCargaArchivo', 'TGENCARGAARCHIVO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    
    this.llenarSeparador();
    this.consultarCatalogos();
   
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.cmodulo)) {
      this.mostrarMensajeError('MÓDULO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.activo = true;
    this.registro.cmodulo = this.mfiltros.cmodulo;;

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
    this.crearDtoConsulta();
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.registro.tieneseparador = true;
    if (this.registro.tieneseparador == null || this.registro.tieneseparador == false) {
      this.registro.separador = null;
    }
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




  llenarSeparador() {
    this.lcharSeparacion = [];
    this.lcharSeparacion.push({label: '...', value: null});
    this.lcharSeparacion.push({label: ';', value: ';'});
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctipoarchivo', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosModulo: any = {'activo': true};
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosModulo, {});
    consultaModulo.cantidad = 50;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }
}

