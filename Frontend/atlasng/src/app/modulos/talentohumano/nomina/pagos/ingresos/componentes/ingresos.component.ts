import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-ingresos',
  templateUrl: 'ingresos.html'
})
export class PagoIngresosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public ldatos: any = [];
  public cerrar: boolean = false;
  public aprobada: boolean = false;
  selectedRegistros;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomingreso', 'TNFONDO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    // this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1145 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TNTIPOHORA', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.justificada = false;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cingreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia("SELECT concat(f.primerapellido, ' ',f.segundoapellido,' ' ,f.primernombre,' ',f.segundonombre) FROM " + this.obtenerBean("tthfuncionariodetalle") + " f JOIN " + this.obtenerBean("tnomrol") + " r ON f.cfuncionario = r.cfuncionario   WHERE r.crol =  t.crol AND f.verreg = 0", "nfuncionario");
    consulta.orderby = 'cingreso desc';
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    if (this.estaVacio(this.mfiltros.mescdetalle)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN MES");
      return;
    }
    if (this.estaVacio(this.mfiltros.tipocdetalle)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN AÑO VALIDO");
      return;
    }

    this.mfiltros.estado = false;
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
    this.mcampos.msg = "INGRESE EL COMENTARIO PARA GENERAR PAGO DEL RUBRO ";
    this.mostrarDialogoGenerico = true;
  }
  aprobarpago() {


    if (this.aprobarSolicitud()) {
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
      this.rqMantenimiento.mdatos.mescdetalle = this.mfiltros.mescdetalle;
      this.rqMantenimiento.mdatos.tipocdetalle = this.mfiltros.tipocdetalle;
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
        total = super.redondear(total + reg.calculado, 2);
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
        reg.j
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
    if (resp.cod != 'OK') {
      super.mostrarMensajeError(resp.msgusu);
    }
    if (resp.VALIDADO) {
      this.recargar();
    }

  }


  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;
    }
  }

}
