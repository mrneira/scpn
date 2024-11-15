import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-devaporte',
  templateUrl: 'devaporte.html'
})
export class DevAporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') 
  formFiltros: NgForm;

  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovpersonas: LovPersonasComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpredevaporte', 'DEVAPORTE', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.crearNuevo();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.fdevaporte = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable);
    this.registro.vaportepatronal = 0;
    this.registro.vaportepersonal = 0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.mdatos.valortotal = 0;
    // No existe para el padre
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
  }


  private fijarFiltrosConsulta() {
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    const mensajeError = this.validarDatos();
    if (mensajeError !== '') {
      super.mostrarMensajeError(mensajeError);
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.lregistros.push(this.registro);
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
    if (resp.mayorizado === 'OK'){
      this.descargarReporte(resp);
    }
  }

  mostrarlovpersonas(): void {
    this.lovpersonas.showDialog();
  }

  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.registro.mdatos.npersona = reg.registro.nombre;
      this.registro.mdatos.nidentificacion = reg.registro.identificacion;
    }
  }

  cambiarMonto(): void {
    this.registro.mdatos.valortotal = this.registro.vaportepatronal + this.registro.vaportepersonal;
  }

  validarDatos(): string {
    let mensaje = '';

    if (this.estaVacio(this.registro.cpersona)) {
      mensaje += 'SELECCIONE SERVIDOR POLICIAL  <br />';
    }
    if (this.estaVacio(this.registro.numerooficio)) {
      mensaje += 'INGRESE NUMERO DE OFICIO  <br />';
    }
    if (this.estaVacio(this.registro.numeromemo)) {
      mensaje += 'INGRESE NUMERO DE MEMO  <br />';
    }
    if (this.estaVacio(this.registro.comentario)) {
      mensaje += 'INGRESE COMENTARIO  <br />';
    }

    if (this.registro.mdatos.valortotal == 0) {
      mensaje += 'VALOR TOTAL DE DEVOLUCION NO PUEDE SER 0 (CERO)  <br />';
    }
    return mensaje;
  }

  descargarReporte(resp: any): void {

    this.jasper.nombreArchivo = "ComprobanteContable";
    const tipoComprobante = 'Diario';

    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = resp.TCONCOMPROBANTE[0].ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
}
