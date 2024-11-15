import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { LovConceptoContablesComponent } from '../../../lov/conceptocontables/componentes/lov.conceptoContables.component';
import {LovTransaccionesComponent} from '../../../../generales/lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-plantillas-comprobante',
  templateUrl: 'plantillasComprobante.html'
})
export class PlantillasComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovTransaccionesComponent)   private lovtransacciones: LovTransaccionesComponent;
  @ViewChild(LovConceptoContablesComponent) private lovconceptoContables: LovConceptoContablesComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipomovimientocdetalle: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconPlantilla', 'PLANTILLA', false, true);
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
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.tipomovimientoccatalogo = 1027;
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

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cplantilla', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconconcepto','nombre','nconcepto','t.cconcepto = i.cconcepto');
    consulta.addSubquery('tgenmodulo','nombre','nmodulo','t.cmodulo = i.cmodulo');
    consulta.addSubquery('tgentransaccion','nombre','ntransaccion','t.cmodulo = i.cmodulo and t.ctransaccion = i.ctransaccion');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo = t.tipomovimientoccatalogo and i.cdetalle = t.tipomovimientocdetalle');
    
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
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1027;
    const conTipoplan = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOMOVIMIENTO', conTipoplan, this.ltipomovimientocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  mostrarlovconceptoContable(): void {
    this.lovconceptoContables.showDialog();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovConceptoContables(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nconcepto = reg.registro.nombre;
      this.registro.cconcepto = reg.registro.cconcepto;

    }
  }

    /**Muestra lov de transacciones */
    mostrarLovTransacciones(): void {
      this.lovtransacciones.mfiltrosesp.ruta = 'is not null';
      this.lovtransacciones.showDialog();
    }
  
    /**Retorno de lov de transacciones. */
    fijarLovTransaccionesSelec(reg: any): void {
      if (reg.registro !== undefined) {
        this.registro.mdatos.ntransaccion = reg.registro.nombre;
        this.registro.cmodulo = reg.registro.cmodulo;
        this.registro.ctransaccion = reg.registro.ctransaccion;
      }
    }
}
