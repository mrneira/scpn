import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovKardexCodificadoComponent } from '../../../lov/kardexcodificado/componentes/lov.kardexcodificado.component';

@Component({
  selector: 'app-custodioactivosfuncionarios',
  templateUrl: 'custodioactivosfuncionarios.html'
})
export class CustodioActivosFuncionariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovKardexCodificadoComponent)
  private lovkardexcodificado: LovKardexCodificadoComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];

  public lubicacioncdetalle: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'CUSTODIOACTIVOSFUNCIONARIOS', false);
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

    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;      
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.kardexproductocodificado=true;
    this.rqMantenimiento.mdatos.fecha = this.mfiltros.fecha;
    this.rqMantenimiento.mdatos.cusuarioasignado = this.mfiltros.cusuarioasignado;
    this.rqMantenimiento.mdatos.ubicacionccatalogo = 1309;
    this.rqMantenimiento.mdatos.ubicacioncdetalle = this.mfiltros.ubicacioncdetalle;
    this.rqMantenimiento.mdatos.infoadicional = this.registro.mdatos.infoadicional;
    this.rqMantenimiento.mdatos.lregistros = this.lregistros;
    
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1309;
    const conUbicacion = this.catalogoDetalle.crearDtoConsulta();
    conUbicacion.cantidad = 10;
    this.addConsultaCatalogos('UBICACION', conUbicacion, this.lubicacioncdetalle, super.llenaListaCatalogo, 'cdetalle');
    
    const consultaFuncionarios = new Consulta('tthfuncionariodetalle', 'Y', 't.primernombre + t.primerapellido', { verreg: 0 }, {});
    consultaFuncionarios.cantidad = 500;
    this.addConsultaCatalogos('FUNCIONARIO', consultaFuncionarios, this.lcusuariorecibe, this.llenaListaUsuarioRecibe, 'cpersona', null);

    this.ejecutarConsultaCatalogos();
  }

  
  public llenaListaUsuarioRecibe(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    if (agregaRegistroVacio) {
      pLista.push({ label: '...', value: null });
    }
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        pLista.push({ label: reg.primernombre + ' ' + reg.primerapellido, value: reg.cpersona });
      }
    }
  }
  mostrarlovkardexcodificado(): void {
    this.lovkardexcodificado.mfiltros.cusuarioasignado = 'CUSTODIOAF';
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


  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
validarGrabar(): string{
  let mensaje: string = '';

  if(this.validarRegistros().length != 0)
  {
    mensaje = this.validarRegistros();
  }

  return mensaje;
}

  validarRegistros(): string{
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.mdatos.cusuariorecibe === undefined || reg.mdatos.cusuariorecibe === null) {
          return 'NO SE HA IDENTIFICADO EL NOMBRE  DEL FUNCIONARIO PARA ASIGNAR';
        }
        if (reg.ubicacioncdetalle === undefined || reg.ubicacioncdetalle === null) {
          return 'NO SE HA DEFINIDO LA UBICACIÓN DEL ACTIVO A ENTREGAR ';
        }
      }
    }
    if (this.mfiltros.fecha === undefined || this.mfiltros.fecha === null ) {
      return  'INGRESE FECHA <br />';
    }
    return "";
    
  }
 
}
