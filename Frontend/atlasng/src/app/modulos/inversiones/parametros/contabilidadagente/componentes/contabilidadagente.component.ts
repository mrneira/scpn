import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovAgentesbolsaComponent } from '../../../lov/agentesbolsa/componentes/lov.agentesbolsa.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';


@Component({
  selector: 'app-contabilidadagente',
  templateUrl: 'contabilidadagente.html'
})
export class ContabilidadagenteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovAgentesbolsaComponent)
  lovAgentesBolsa: LovAgentesbolsaComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovCuentasContables: LovCuentasContablesComponent;
  fecha = new Date();

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lInstrumento: SelectItem[] = [{label: '...', value: null}];
  public lProceso: SelectItem[] = [{label: '...', value: null}];
  public lOperacion: SelectItem[] = [{label: '...', value: null}];
  public lRubro: SelectItem[] = [{label: '...', value: null}];
  public lregistro: SelectItem[] = [{label: '...', value: null}];
  public lCcosto: SelectItem[] = [{label: '...', value: null}];

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvplantillacontableagente', 'CONTABILIDADAGENTE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    //this.consultar();
    this.consultarCatalogos();
   
  }

  ngAfterViewInit() {
  }

  mostrarLovAgentesBolsa(): void {
    this.lovAgentesBolsa.showDialog(); // con true solo muestra cuentas de movimiento.
  }

  fijarLovAgentesBolsaSelect(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinvagentebolsa = reg.registro.cinvagentebolsa;
      this.mcampos.nombres = reg.registro.nombres;
      this.registro.cinvagentebolsa = reg.registro.cinvagentebolsa;

    }
  }

  crearNuevo() {
    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }
    else {
    super.crearNuevo();
    
    this.mcampos.ccuentacon = null;
    this.mcampos.ncuentacon = null;

    this.registro.cinvagentebolsa = this.mcampos.cinvagentebolsa;
    
    this.registro.instrumentoccatalogo = 1202;
    this.registro.instrumentocdetalle = this.mfiltros.instrumentocdetalle;


    this.registro.procesoccatalogo = 1220;
    this.registro.procesocdetalle = this.mfiltros.procesocdetalle;
 
    this.registro.centrocostoccatalogo = 1002;

    this.registro.rubroccatalogo = 1219;

    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  
    }
  }

  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.mcampos.cinvagentebolsa)) {
      lmensaje = "DEBE ESCOGER UN AGENTE";
    }
    else {
      if (this.estaVacio(this.mfiltros.instrumentocdetalle)) {
        lmensaje = "DEBE ESCOGER UN INSTRUMENTO";
      }
      else {
        if (this.estaVacio(this.mfiltros.procesocdetalle)) {
          lmensaje = "DEBE ESCOGER UNA OPERACION";
        }
        else {
          if(this.estaVacio(this.mfiltros.centrocostocdetalle))
            lmensaje = "DEBE ESCOGER UN CENTRO COSTO";
        }
      }

    }
    return lmensaje;
  }

  actualizar() {
    this.registro.centrocostocdetalle = this.mfiltros.centrocostocdetalle;
    this.registro.ccuenta = this.mcampos.ccuentacon;
   
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
    this.lregistros = [];
    if (this.estaVacio(this.validarCabecera())) {
      this.crearDtoConsulta();
      super.consultar();
    }
  }
  llenarConsultaCatalogos(): void {

    const mfiltrosinstrumento = {'ccatalogo': 1202};
    const consInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosinstrumento, {});
    consInstrumento.cantidad = 100;
    this.addConsultaPorAlias('INSTRUMENTO', consInstrumento);

    const mfiltrosoperacion = {'ccatalogo': 1220};
    const consOperacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosoperacion, {});
    consOperacion.cantidad = 100;
    this.addConsultaPorAlias('OPERACION', consOperacion);

    const mfiltrosrubro = {'ccatalogo': 1219};
    const mfiltrosEsp = {'cdetalle': " IN ('COMOPE') "};
    const consRubro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, mfiltrosEsp);
    consRubro.cantidad = 100;
    this.addConsultaPorAlias('RUBRO', consRubro);

    const mfiltrosccosto = {'ccatalogo': 1002};
    const consCcosto = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosccosto, {});
    consCcosto.cantidad = 100;
    this.addConsultaPorAlias('CCOSTO', consCcosto);

    this.ejecutarConsultaCatalogos();
  }
  consultarCatalogos(): any {
    this.msgs = [];
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

   /**Manejo respuesta de consulta de catalogos. */
   private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
      this.llenaListaCatalogo(this.lProceso, resp.OPERACION, 'cdetalle');
      this.llenaListaCatalogo(this.lRubro, resp.RUBRO, 'cdetalle');
      this.llenaListaCatalogo(this.lCcosto, resp.CCOSTO, 'cdetalle');
    
    }
    this.lconsulta = [];
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  public crearDtoConsulta(): Consulta {

    this.fijarFiltrosConsulta();
    
    const consulta = new Consulta(this.entityBean, 'Y', 't.instrumentocdetalle', this.mfiltros, this.mfiltrosesp);
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ninstrumento', ' t.instrumentoccatalogo=i.ccatalogo and t.instrumentocdetalle=i.cdetalle');
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nproceso', ' t.procesoccatalogo=i.ccatalogo and t.procesocdetalle=i.cdetalle');
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nrubro', ' t.rubroccatalogo=i.ccatalogo and t.rubrocdetalle=i.cdetalle');
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nccosto', ' t.centrocostoccatalogo=i.ccatalogo and t.centrocostocdetalle=i.cdetalle');
     consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 't.ccuenta=i.ccuenta');
    
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA REALIZADO SELECCIONADO LAS OPCIONES DE CABECERA";
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }
    
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
   
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];

      this.mcampos.ccuentacon = reg.registro.ccuenta;
      this.mcampos.ncuentacon = reg.registro.nombre;
      this.registro.mdatos.ncuentacon = reg.registro.nombre;
    }
  }
}


