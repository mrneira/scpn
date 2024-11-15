import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-buzonRenPoliza',
  templateUrl: 'buzonRenPoliza.html'
})
export class BuzonRenPolizaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;
  grab: boolean = false;
  public laprobados: any = [];

  constructor(router: Router, dtoServicios: DtoServicios,private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'TsgsPoliza', 'BUZONRENOVACIONPOLIZAS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    //this.consultar();  // para ejecutar consultas automaticas.
    //this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
   
    this.rqMantenimiento.mdatos.accion = "modificar";   
    this.crearDtoMantenimiento();
    super.actualizar();
    this.grabar();
    // super.addMantenimientoPorAlias(this.alias,mantenimiento);
   
  }

 
  eliminar() {
    this.rqMantenimiento.mdatos.accion = "eliminar";
    this.crearDtoMantenimiento();
    super.eliminar();
    this.grabar();
  }

  eliminarPoliza(registro: any) {

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar Póliza: ' + registro.numeropoliza,
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.selectRegistro(registro);
        this.eliminar();
      },
      reject: () => {
      }
    });
  }

  modificarPoliza(registro: any) {
    this.mostrarDialogoGenerico = true;
    this.selectRegistro(registro);
    // this.grabar();
  }

  cancelar() {
    this.encerarMensajes();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubqueryPorSentencia('SELECT p.identificacion FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'identificacion');
    consulta.addSubqueryPorSentencia('SELECT p.nombre FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'npersona');
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltrosesp.cpago = 'is null';
    this.mfiltrosesp.pagodirecto = 'is null';
    this.mfiltros.cdetalleestado = 'PEN';
    // this.mfiltrosesp.coperacioncartera = 'in (select coperacioncartera from tsgsseguro where incremento = \'FALSE\')';
    this.mfiltrosesp.secuencia = '> (\'1\')';
    this.mfiltros.renovacion = true;
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
    const graba = this.validaRegistros();
    if (graba) {
      this.crearDtoMantenimiento();
       this.mostrarDialogoGenerico = false;
      super.grabar();
    }
    else
    {
      
      this.crearDtoMantenimiento();
      super.grabar();
    }
  }
  cerrarDialogo() {
    this.mostrarDialogoGenerico = false;
  }


  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.recargar();

    } else {
      this.mostrarMensajeError(resp.msgusu);
    }
  }



  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.cdetalleestado = 'ING';
        this.selectRegistro(reg);
        // 
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      this.rqMantenimiento.mdatos.accion = "renovacion";  
      return true;
    }
    return false;
  }

}
