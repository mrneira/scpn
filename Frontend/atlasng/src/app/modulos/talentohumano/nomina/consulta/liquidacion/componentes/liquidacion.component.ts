import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ParametroanualComponent } from '../../../../lov/parametroanual/componentes/lov.parametroanual.component';
import { AppService } from 'app/util/servicios/app.service';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component'

@Component({
  selector: 'app-liquidacion',
  templateUrl: 'liquidacion.html'
})
export class LiquidacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;



  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;
  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(JasperComponent)
  public reporte: JasperComponent;
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public cerrada = false;

  public ldatos: any = [];
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'tnomliquidacion', 'LIQUIDACIONGENERAL', false);
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
   this.consultar();
  }

  ngAfterViewInit() {
    
  }
  descargarReporte(reg:any) {
    this.reporte.nombreArchivo = 'ReporteLiquidación';
    // Agregar parametros
    this.reporte.parametros['@i_cliquidacion'] = reg.cliquidacion;
    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthLiquidaciones';
    this.reporte.generaReporteCore();
}
  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 416;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);

    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
         cliquidacion: reg.cliquidacion,
          nuevaliquidacion: false,
          cerrada:reg.cerrada
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  public nuevaLiquidacion() {
    const opciones = {};
    const tran = 416;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);

    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          ldatos:this.lregistros,
          cerrada:false,
          nuevaliquidacion: true
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    this.cargarPagina(registro);
    
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }
  consultarDetalle(reg: any) {

    this.crearDtoConsultaDetalle(reg);
    super.consultar();
  }
  eliminarRegistroLiquidacion(reg:any){
    this.rqMantenimiento.mdatos={};
    this.rqMantenimiento.mdatos.cliquidacion = reg.cliquidacion;
    this.rqMantenimiento.mdatos.eliminar = true;
    super.grabar();
  }
  
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
    consulta.addSubquery('tthfuncionariodetalle','documento','ndocumento','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
     
   
    consulta.cantidad = 10;
    this.addConsulta(consulta);
    return consulta;
  }
  public crearDtoConsultaDetalle(reg: any) {
 

  }
  private fijarFiltrosConsulta() {

  }
  

  guardarCambios() {
    this.grabar();
  }
  finalizarIngreso(): void {
    let mensaje = ''
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;

    }
    this.rqMantenimiento.mdatos.cnomina = this.mcampos.cnomina;
   
    this.grabar();
  }
  


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.postQueryEntityBean(resp);
 
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

  }

  grabarDetalle(){
    
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
   this.postCommitEntityBean(resp);
   if(resp.cod=='OK'){
    if(resp.ELIMINADO){
      this.recargar();
    }else{
      super.mostrarMensajeError(resp.msgusu);
    }
   }
  }

 
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }
  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.anio = reg.registro.anio;
    }
  }


  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }



}
