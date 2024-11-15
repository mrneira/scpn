import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-expediente',
  templateUrl: 'expediente.html'
})
export class ExpedienteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public itemsNomina: MenuItem[] = [{ label: 'Aprobar Nómina', icon: 'ui-icon-circle-arrow-e', command: () => { this.aprobarEtapa(); } },
  { label: 'Rechazar Nómina', icon: 'ui-icon-circle-arrow-w', command: () => { this.rechazarEtapa(); } }];
  
  public ldatos: any = [];
  public cerrar: boolean=false;
  public aprobada: boolean=false;
  public lflujonormal: any = [];
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'tpreexpediente', 'NOMINA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
  //  this.consultarCatalogos();
  }
  
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosFlujoNormal: any = { 'ccatalogo': 2806 };
    const consultaFlujoNormal = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoNormal, {});
    consultaFlujoNormal.cantidad = 100;
    this.addConsultaCatalogos('FLUJONORMAL', consultaFlujoNormal, null, this.llenarFlujo, 'normal', this.componentehijo);

    this.ejecutarConsultaCatalogos();

  }

  public llenarFlujo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        this.componentehijo.lflujonormal.push({ label: reg.nombre, value: { paso: Number(reg.cdetalle), estado: reg.cdetalle } });
      }
    }

  }
  aprobarEtapa(){
    if(this.aprobarSolicitud()){
      this.grabar();
 
    }else{
      super.mostrarMensajeError("NO HA SELECCIONADO NINGUN EXPEDIENTE PARA MANTENIMIENTO")
    }
  }
  aprobarSolicitud() {
    // let mensaje: string = '';
   
     this.ldatos=[];
     this.aprobada=true;
     for (const i in this.selectedRegistros) {
       if (this.selectedRegistros.hasOwnProperty(i)) {
         const reg: any = this.selectedRegistros[i];
         this.ldatos.push(reg);
         this.cerrar= true;
       }
     }
     if (this.estaVacio(this.selectedRegistros) || this.selectedRegistros.length == 0) {
      this.cerrar=false;
       return false;
      
     }
     return true;
   }
  rechazarEtapa(){
    if(this.negarSolicitud()){
      this.grabar();
    }else{
      super.mostrarMensajeError("NO HA SELECCIONADO NINGUN EXPEDIENTE PARA EL MANTENIMIENTO")
    }

  }
  

  negarSolicitud(): boolean {
    // let mensaje: string = '';
    this.cerrar= false;
     this.ldatos=[];
     this.aprobada=false;
     for (const i in this.selectedRegistros) {
       if (this.selectedRegistros.hasOwnProperty(i)) {
         const reg: any = this.selectedRegistros[i];
         
         this.ldatos.push(reg);
         this.cerrar= true;
       }
     }
     if (this.estaVacio(this.selectedRegistros) || this.selectedRegistros.length == 0) {
      this.cerrar=false;
       return false;
      
     }
     return true;
   }
  ngAfterViewInit() {
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
  // super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.ccatalogotipoexp and i.cdetalle=t.cdetalletipoexp');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nestado', 'i.ccatalogo=t.ccatalogoestado and i.cdetalle=t.cdetalleestado');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'netapa', 'i.ccatalogo=t.ccatalogoetapa and i.cdetalle=t.cdetalleetapa');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    //this.mfiltrosesp.comprobantecontable='IS NOT NULL';
    this.mfiltros.cdetalleestado='ACT';
    this.mfiltros.cdetalleetapa='4';
 //   this.mfiltrosesp.comprobantecontable = 'in (SELECT i.ccomprobante FROM tconcomprobante i '+
   //       'WHERE i.anulado = 0 AND i.aprobadopresupuesto = 0)';
    
  
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
    this.aprobarSolicitud();  
    this.lmantenimiento = []; // Encerar Mantenimiento
   
    this.rqMantenimiento.mdatos.expediente=this.ldatos;
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
    if(resp.GENERADO){
      this.recargar();
    }  
    if (resp.cod==='OK'){
      this.consultar();
    }
   
  }


  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 21;
    let ac = 'false';
    let ins = 'false';
    let del = 'false';
    let upd = 'false';
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Mantenimiento Expedientes';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    switch (reg.cdetalleetapa) {
      case '1':
        ins = 'true';
        del = 'true';
        upd = 'true';
        break;
      case '2':
        ins = 'true';
        del = 'true';
        upd = 'true';
        break;
    }
    opciones['ac'] = ac;
    opciones['ins'] = ins;
    opciones['del'] = del;
    opciones['upd'] = upd

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        exp: JSON.stringify({
          cpersona: reg.cpersona, npersona: reg.mdatos.npersona,
          mfiltros: this.mfiltros,
          lflujonormal: this.lflujonormal,
          ntipo: reg.mdatos.ntipo,
          cdetalletipoexp: reg.cdetalletipoexp,
          identificacion: reg.mdatos.cedula
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

/*  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1144 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
*/
  
/*listaNomina(){
    const opciones = {};
    const tran = 415;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'false';
    opciones['del'] = 'false';
    opciones['upd'] = 'false';

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
        
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 413;
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
          mfiltros: reg.mfiltros, cnomina: reg.cnomina, nmes: reg.mdatos.nmes,
          nuevaNomina: false,
          cerrada:reg.cerrada
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  */
}
