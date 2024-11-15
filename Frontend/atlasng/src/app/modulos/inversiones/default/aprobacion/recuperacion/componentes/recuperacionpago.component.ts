import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-recuperacionpago',
  templateUrl: 'recuperacionpago.html'
})
export class RecuperacionPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public itemsNomina: MenuItem[] = [{ label: 'Aprobar Pago', icon: 'ui-icon-circle-arrow-e', command: () => { this.aprobarEtapa(); } },
  { label: 'Rechazar Pago', icon: 'ui-icon-circle-arrow-w', command: () => { this.rechazarEtapa(); } }];
  
  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public ldatos: any = [];
  public cerrar: boolean = false;
  public aprobada: boolean = false;
  selectedRegistros;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvdefaultdetalle', 'TNFONDO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
     this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1145, 'clegal': '0' };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TNTIPOHORA', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();

  }
  rechazarEtapa() {
    if (this.negarSolicitud()) {
      this.grabar();
    } else {
      super.mostrarMensajeError("NO HA SELECCIONADO NINGUNA NÓMINA PARA EL MANTENIMIENTO")
    }

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
    this.fijarFiltrosConsulta();
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);

    consulta.addSubqueryPorSentencia('SELECT c.nombre FROM tgencatalogodetalle c, tinvinversion inv , tinvdefault def WHERE def.cinversion= inv.cinversion and def.cdefault = t.cdefault AND inv.emisorccatalogo = c.ccatalogo AND inv.emisorcdetalle =c.cdetalle', 'nemisor');
    consulta.addSubqueryPorSentencia('SELECT ci.nombre FROM tgencatalogodetalle ci, tinvinversion inv , tinvdefault def WHERE def.cinversion= inv.cinversion and def.cdefault = t.cdefault AND inv.instrumentoccatalogo = ci.ccatalogo AND inv.instrumentocdetalle =ci.cdetalle', 'ninstrumento');
    consulta.addSubqueryPorSentencia('SELECT sec.nombre FROM tgencatalogodetalle sec, tinvinversion inv, tinvdefault def WHERE def.cinversion= inv.cinversion and def.cdefault = t.cdefault AND inv.sectorccatalogo = sec.ccatalogo AND inv.sectorcdetalle =sec.cdetalle', 'nsector');
    
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

 

    this.mfiltros.estadocdetalle = 'ENVAPR';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  aprobarEtapa() {
    this.mcampos.msg = "INGRESE EL COMENTARIO PARA APROBAR EL PAGO";
    this.mostrarDialogoGenerico = true;
  }

  aprobarpago() {
    if (this.aprobarSolicitud()) {
      this.mostrarDialogoGenerico = false;
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
      this.grabar();

    } else {
      super.mostrarMensajeError("NO SE HAN SELECIONADO REGISTROS PARA GENERAR EL PAGO");
    }
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    // this.rqMantenimiento.mdatos={};
    //this.rqMantenimiento.mdatos.cfuncionariojust =sessionStorage.getItem("cfuncionario");
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }



  negarSolicitud(): boolean {
    // let mensaje: string = '';
    this.cerrar = false;
    this.ldatos = [];
    this.aprobada = false;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];

        this.ldatos.push(reg);
        this.cerrar = true;
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  getTotal(): Number {
    let total = 0;

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        total = super.redondear(total + reg.valor, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }
  aprobarSolicitud() {
    // let mensaje: string = '';
    this.cerrar = false;
    this.ldatos = [];
    this.aprobada = true;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        
        this.ldatos.push(reg);
        this.cerrar = true;
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.VALIDADO) {
      this.recargar();
    }

  }


 


}
