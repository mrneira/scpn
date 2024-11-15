import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';
import { LovKardexCodificadoComponent } from '../../../lov/kardexcodificado/componentes/lov.kardexcodificado.component';

@Component({
  selector: 'app-custodioactivosfuncionario',
  templateUrl: 'custodioactivosfuncionario.html'
})
export class CustodioActivosFuncionarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;

  @ViewChild(LovKardexCodificadoComponent)
  private lovkardexcodificado: LovKardexCodificadoComponent;

  
  private catalogoDetalle: CatalogoDetalleComponent;
  
  public lubicacioncdetalle: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'CUSTODIOACTIVOSFUNCIONARIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mfiltros.fecha = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.fecha = this.mfiltros.fecha;
    this.registro.cusuarioasignado = this.mfiltros.cusuarioasignado;
    this.registro.ubicacioncdetalle = this.mfiltros.ubicacioncdetalle;
    this.registro.mdatos.nfuncionario = this.mcampos.nfuncionario;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ckardexprodcodi', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1309;
    const conUbicacion = this.catalogoDetalle.crearDtoConsulta();
    conUbicacion.cantidad = 15;//CCA cambios 20210204
    this.addConsultaCatalogos('UBICACION', conUbicacion, this.lubicacioncdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
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
    let mensaje = this.validarIngreso();
    if ( mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.kardexproductocodificado=true;
    this.rqMantenimiento.mdatos.cusuarioasignado = this.mfiltros.cusuarioasignado;
    this.rqMantenimiento.mdatos.fecha = this.mfiltros.fecha;
    this.rqMantenimiento.mdatos.ubicacionccatalogo = 1309;
    this.rqMantenimiento.mdatos.ubicacioncdetalle = this.mfiltros.ubicacioncdetalle;
    this.rqMantenimiento.mdatos.infoadicional = this.lregistros;
    this.rqMantenimiento.mdatos.fecha = this.mfiltros.fecha;
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarIngreso(): string{
    let mensaje: string = '';

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.mdatos.infoadicional === undefined || reg.mdatos.infoadicional === null) {
          return 'EXISTEN PRODUCTOS SIN OBSERVACIÓN';
        }             
      }      
    }
    
    if (this.mfiltros.fecha === undefined || this.mfiltros.fecha === null ) {
      mensaje += 'INGRESE FECHA <br />';
    }
    if (this.mfiltros.cusuarioasignado === null || this.mfiltros.cusuarioasignado === undefined) {
      mensaje += 'INGRESE USUARIO A RECIBIR <br />';
    }
    if (this.mfiltros.ubicacioncdetalle === null || this.mfiltros.ubicacioncdetalle === undefined) {
      mensaje += 'INGRESE UBICACI&Oacute;N <br />';
    }     

    return mensaje;     
  }


  mostrarlovkardexcodificado(): void {
    this.lovkardexcodificado.consultar();
    this.lovkardexcodificado.showDialog();
  }

  fijarlovkardexcodificadoSelec(reg: any): void {

    if(!this.buscarProducto(reg.registro.cbarras))
    {
      this.registro.mdatos.nproducto = reg.registro.mdatos.nombre;
      this.registro.mdatos.cbarras = reg.registro.cbarras;
      
      this.registro.cbarras=reg.registro.cbarras;
      this.registro.cproducto = reg.registro.cproducto;
      this.registro.mdatos.codigo = reg.registro.mdatos.codigo;
      this.registro.codigo = reg.registro.mdatos.codigo;     
      this.registro.mdatos.serial = reg.registro.serial;
      this.registro.serial = reg.registro.serial;
  }
  else{
    super.mostrarMensajeError('PRODUCTO YA SE ENCUENTRA INGRESADO, ELIJA OTRO');
    return;
  }
}

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  buscarProducto(cbarras: any): boolean {
    if (this.lregistros.length > 0) {
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          if (reg.cbarras === cbarras) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cusuarioasignado = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.registro.mdatos.nfuncionario = reg.registro.primernombre +" "+reg.registro.primerapellido; 
      this.mcampos.nfuncionario =  reg.registro.primernombre +" "+reg.registro.primerapellido; 
      this.mfiltros.cusuarioasignado = reg.registro.cpersona;
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

 

  cerrarDialogo(){

  }
}
