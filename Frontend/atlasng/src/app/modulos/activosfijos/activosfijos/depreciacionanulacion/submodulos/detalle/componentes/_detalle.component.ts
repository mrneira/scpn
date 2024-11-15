import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @Output() calcularTotalesEvent = new EventEmitter();

  public totalValorUnitario = 0;
  public indice: number;
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfhistorialdepreciacion', 'DETALLE', false);
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
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto','nombre','nombre', 't.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto','codigo','codigo', 't.cproducto = i.cproducto');
    consulta.addSubquery('tacfproductocodificado','cbarras','cbarras1', 't.cproducto = i.cproducto and t.cbarras = i.cbarras');
    
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  mostrarActivos() {
    const consulta = new Consulta('tacfproductocodificado', 'Y','t.cproductocodificado',  this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto','nombre','nombre', 't.cproducto = i.cproducto');
    consulta.addSubquery('tacfproducto','codigo','codigo', 't.cproducto = i.cproducto');    
    //consulta.addSubquery('tacfproducto','ccuenta','ccuenta', 't.cproducto = i.cproducto'); 
    consulta.addSubquery('tacfproducto','centrocostoscdetalle','centrocostoscdetalle', 't.cproducto = i.cproducto');        
    // consulta.addSubquery('tacfproducto','ccuentadepreciacion','ccuentadepreciacion', 't.cproducto = i.cproducto'); 
    // consulta.addSubquery('tacfproducto','ccuentadepreciacionacum','ccuentadepreciacionacum', 't.cproducto = i.cproducto'); 
    consulta.cantidad = 1000;
    this.addConsultaPorAlias('DETALLE', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuesta(resp: any) {
    let valordepreciable = 0;
    let depreciacionperiodo = 0;
    let valorlibros = 0;

    for (const i in resp.DETALLE) {
      this.crearNuevoRegistro();
      const reg = resp.DETALLE[i];
      valordepreciable = reg.vunitario - reg.valorresidual;
      depreciacionperiodo = valordepreciable / reg.vidautil;
      valorlibros =  reg.vunitario - reg.depreciacionperiodo;
      resp.DETALLE[i].esnuevo = true;
      resp.DETALLE[i].crearNuevoRegistro = true;
      resp.DETALLE[i].mdatos.cbarras = reg.cbarras;
      resp.DETALLE[i].mdatos.nombre = reg.mdatos.nombre;
      resp.DETALLE[i].mdatos.ccuenta = reg.ccuenta;
      resp.DETALLE[i].mdatos.centrocostoscdetalle = reg.mdatos.centrocostoscdetalle;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacionacum = reg.ccuentadepreciacionacum;
      resp.DETALLE[i].mdatos.vidautil = reg.vidautil;
      resp.DETALLE[i].mdatos.valorcompra = reg.vunitario;
      resp.DETALLE[i].mdatos.valorlibros = valorlibros;  
      resp.DETALLE[i].mdatos.valorresidual = reg.valorresidual;  
      resp.DETALLE[i].mdatos.valordepperiodo = depreciacionperiodo;            
      resp.DETALLE[i].mdatos.valordepreciacion = reg.valorlibros - depreciacionperiodo;
    }
   
    super.postQueryEntityBean(resp);
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    for (const i in resp.DETALLE) {
      const reg = resp.DETALLE[i];
      resp.DETALLE[i].mdatos.cbarras = reg.cbarras;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacion = reg.ccuentadepreciacion;
      resp.DETALLE[i].mdatos.ccuentadepreciacionacum = reg.ccuentadepreciacionacum;
      resp.DETALLE[i].mdatos.centrocostoscdetalle = reg.centrocostoscdetalle;
      resp.DETALLE[i].mdatos.vidautil = reg.vidautil;
      resp.DETALLE[i].mdatos.valorcompra = reg.vunitario;
      resp.DETALLE[i].mdatos.valorlibros = reg.valorlibros;  
      resp.DETALLE[i].mdatos.valorresidual = reg.valorresidual;  
      resp.DETALLE[i].mdatos.valordepperiodo = reg.valdepperiodo;     
      resp.DETALLE[i].mdatos.valorcompra = reg.valorcompra;                  
      resp.DETALLE[i].mdatos.valordepreciacion = reg.valordepreciable;
    }

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
    this.actualizar();
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }



  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  consultarCatalogos(): void {
  }



}
