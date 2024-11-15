import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';
import {AccionesReporteComponent} from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovIdiomasComponent } from '../../../../../../generales/lov/idiomas/componentes/lov.idiomas.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-comptecnicas',
  templateUrl: 'comptecnicas.html'
})
export class ComptecnicasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  public ldetreza: SelectItem[] = [{label: '...', value: null}];

  public lrelevancia: SelectItem[] = [{label: '...', value: null}];
  
  @ViewChild(LovIdiomasComponent)
  private lovIdiomas: LovIdiomasComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevalparmcomptecnpuesto', 'EVALGESPUESTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if(this.estaVacio(this.mcampos.cplantilla)){
      this.mostrarMensajeError("ELIJA PRIMERO LA PLANTILLA PARA EL MANTENIMIENTO");
      return;
    }
    super.crearNuevo();
    this.registro.cplantilla= this.mcampos.cplantilla;
    this.registro.ccatalogorelevancia=1121;

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
  //  if (!this.validaFiltrosRequeridos()) {
  //    return;
  //  }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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

}
