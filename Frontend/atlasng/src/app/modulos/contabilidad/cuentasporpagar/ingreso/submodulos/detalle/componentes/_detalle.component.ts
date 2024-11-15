import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { IngresoComponent } from '../../../../../comprobantes/ingreso/componentes/ingreso.component';
import { any } from 'codelyzer/util/function';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() baseimpgravable = 0;
  @Output() calcularTotalesIREvent = new EventEmitter();

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lregplantilla: any = [];
  public ltipoimpuestocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public ldetalle: SelectItem[] = [{ label: '...', value: null }];
  public totalRetencionesIR=0;
  private catalogoDetalle: CatalogoDetalleComponent


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconretencionfuente', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarImpuestos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.baseimpair =  this.baseimpgravable;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesIREvent.emit();
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.codigosri', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconretencionair', 'descripcion', 'descripcion', 'i.codigosri = t.codigosri ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarImpuestos() {
    this.msgs = [];
    this.ltipoimpuestocdetalle = [];
    this.rqConsulta.CODIGOCONSULTA = 'LRETENCIONAIR';

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaRetencionAir(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaRetencionAir(resp: any) {
    const listaImpuesto = resp.LRETENCIONAIR;
    if (resp.cod === 'OK') {
      for (const i in listaImpuesto) {
        if (listaImpuesto.hasOwnProperty(i)) {
          const reg: any = listaImpuesto[i];
          this.ltipoimpuestocdetalle.push({ label: reg.mdatos.descripcion, value: { id: reg.mdatos.codigosri, name: reg.mdatos.descripcion, code: reg.mdatos.porcentaje } });
        }
      }
    }
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  crearNuevoRegistro() {
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.crearnuevoRegistro();
  }

  private cerrarDialogo(): void {
    this.calcularTotalesIREvent.emit();
  }

  private seleccionarConcepto() {
    this.registro.porcentaje = this.registro.codigosri.code;
    this.registro.valretair = this.redondear(this.registro.baseimpair * (this.registro.porcentaje/100),2) ;
    this.registro.mdatos.descripcion = this.registro.codigosri.name;
    this.registro.codigosri = this.registro.codigosri.id;
  }

  CalcularValorRetencionRenta(): void{
    this.registro.valretair = this.registro.baseimpair * (this.registro.porcentaje/100) ;
  }
}
