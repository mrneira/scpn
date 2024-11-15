import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-cal-cont',
  templateUrl: 'calendarioContable.html'
})
export class CalendarioContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ldias = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCatalogoDetalle', 'GENERACIONCALENARIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.anioactual = this.anioactual;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    //
  }

  actualizar() {
    //
  }

  eliminar() {
    //
  }

  cancelar() {
    //
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdetalle', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccatalogo = 5;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.ldias = [];
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const item = this.lregistros[i];
        const reg = new Object();
        reg['dia'] = item.clegal;
        reg['ndia'] = item.nombre;
        reg['trabajo'] = null;
        reg['contable'] = null;
        if (item.clegal !== '1' && item.clegal !== '7') {
          reg['trabajo'] = true;
          reg['contable'] = true;
        }
        this.ldias.push(reg);
      }
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.csucursalinicio = this.mcampos.csucursalinicio;
    this.rqMantenimiento.csucursalfin = this.mcampos.csucursalfin;
    this.rqMantenimiento.fini = this.fechaToInteger(this.mcampos.finicio);
    this.rqMantenimiento.anio = this.mcampos.anioactual;
    this.rqMantenimiento.mdatos.LISTACCOUNTINDATE = this.ldias;

    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validaGrabar() {
    return this.validaFiltrosConsulta();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }



}
