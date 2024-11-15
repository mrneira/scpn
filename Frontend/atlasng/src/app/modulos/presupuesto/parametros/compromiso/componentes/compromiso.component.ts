import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { LovCompromisoComponent } from '../../../lov/compromiso/componentes/lov.compromiso.component';
import { LovPartidaGastoComponent } from '../../../lov/partidagasto/componentes/lov.partidagasto.component';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-compromiso',
  templateUrl: 'compromiso.html'
})
export class CompromisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCompromisoComponent)
  private lovcompromiso: LovCompromisoComponent;

  public nuevo = true;
  public eliminado = false;
  lregistroscertificados: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARCOMPROMISO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.cabeceraComponent.mcampos.fingreso = this.fechaactual;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }
           
  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }  

  // Inicia CONSULTA *********************
  consultar() {
    //NCH 20230127
    if(this.rqConsulta.parametro_ccertificacion !==0 && this.cabeceraComponent.mfiltros.ccompromiso == null ){
    this.consultarCertificacion();     
    } else{
      this.crearDtoConsulta();   
    }
    super.consultar();  
    }
  
  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
  }

  private fijarFiltrosConsulta() {
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
     return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.detalleComponent.calcularTotales();
    this.nuevo = true;
    this.eliminado = this.cabeceraComponent.registro.eliminado;

  }

  // Fin CONSULTA *********************


consultarCertificacion() {
  this.rqConsulta.CODIGOCONSULTA = 'PPT_COMPCERTIFICACION';
  this.rqConsulta.storeprocedure = "sp_PptRptCertificaciónPartidaGasto";
  this.rqConsulta.parametro_ccertificacion = this.cabeceraComponent.registro.ccertificacion;
  this.msgs = [];

  this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
      resp => {
        this.manejaRespuestaCertificacion(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  this.rqConsulta.CODIGOCONSULTA = null;
}

private manejaRespuestaCertificacion(resp: any) {
  this.lregistroscertificados = [];
  if (resp.cod === 'OK') {
    this.lregistroscertificados = resp.PPT_COMPCERTIFICACION;
  }
  this.nuevo = true
}

  guardarCambios(): void {
    this.grabar();
  }


  eliminarCompromiso(): void {
    if (this.cabeceraComponent.registro.estadocdetalle != 'CERTIF') {
      super.mostrarMensajeError('NO SE PUEDE ELIMINAR REGISTRO CON ESTADO DIFERENTE DE INGRESO');
      return;
    }
    else {
      this.rqMantenimiento.mdatos.eliminar = true;
      this.grabar();
    }
  }

  certificar(): void { 
    this.cabeceraComponent.registro.estadocdetalle = 'CERTIF';
    this.rqMantenimiento.mdatos.certificar = true;
    this.grabar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }

    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
      //NCH 20230127
      for( const i in this.detalleComponent.lregistros){
        if(!this.detalleComponent.lregistros[i].ccertificacion){
          this.detalleComponent.lregistros[i].ccertificacion = this.cabeceraComponent.registro.ccertificacion;
        }
      }
      //NCH 20230127
    } else {
      this.cabeceraComponent.registro.cusuariomod = 'user';
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;  
      //this.detalleComponent.registro.ccertificacion = this.mcampos.certificacion 
    }
    
    //this.cabeceraComponent.registro.ccertificacion = this.mcampos.certificacion;
    this.cabeceraComponent.registro.estadoccatalogo = 1601;    
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));  
      this.cabeceraComponent.registro.ccompromiso = resp.ccompromiso;
      this.cabeceraComponent.mfiltros.ccompromiso = resp.ccompromiso;
      this.detalleComponent.mfiltros.ccompromiso = resp.ccompromiso;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.eliminado = this.cabeceraComponent.registro.eliminado;
      if (this.cabeceraComponent.registro.estadocdetalle === 'CERTIF'){
        this.descargarReporte();
        this.recargar();
      }

    }
  }

  validarRegistrosDetalle(): boolean {
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.cpartidagasto === undefined) {
        return false;
      }
    }
    return true;
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.cabeceraComponent.registro.infoadicional === null || this.cabeceraComponent.registro.infoadicional === undefined) {
      mensaje = 'INGRESE COMENTARIO';
    }

    return mensaje;
  }


  /**Muestra lov de compromiso */
  mostrarlovCompromiso(): void {

    //this.lovcompromiso.mfiltros.estadocdetalle = 'INGRES';
    this.lovcompromiso.showDialog(true);
  }

  /**Retorno de lov de Compromiso presupuestario. */
  fijarLovCompromisoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.ccompromiso = reg.registro.ccompromiso;
      this.detalleComponent.mfiltros.ccompromiso = reg.registro.ccompromiso;
      this.msgs = [];
      this.consultar();
    }

  }

  consultarCatalogos(): void {
  }

  calcularTotales() {
  }

  cambiarMonto() {
  }

  descargarReporte(): void { 
   this.jasper.parametros['@i_ccertificacion'] = this.cabeceraComponent.registro.ccertificacion; 
    this.jasper.parametros['@i_ccompromiso'] = this.cabeceraComponent.registro.ccompromiso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCertificacionPresupuestaria';
    this.jasper.generaReporteCore();
  }

}
