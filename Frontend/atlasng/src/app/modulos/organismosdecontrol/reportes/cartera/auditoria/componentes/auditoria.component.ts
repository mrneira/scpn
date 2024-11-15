import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-auditoria',
  templateUrl: 'auditoria.html'
})
export class AuditoriaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];
  public lModuloEstructura: SelectItem[] = [{ label: "...", value: null }];
  public lestructura: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'todcauditoria', 'AUDITORIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
   
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.activo = 0;
  }
  
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar() {   
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.generarReporte();
  }
 

  generarReporte() {

    this.rqConsulta.CODIGOCONSULTA = 'OC_AUDITORIA';
    this.rqConsulta.storeprocedure = "sp_OdcRptAuditoria";
    this.rqConsulta.parametro_cestructura = this.mcampos.cestructura === undefined ? "" : this.mcampos.cestructura;
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.lregistros = resp.OC_AUDITORIA;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }); 
  }

  consultarCatalogos(): any {
   this.msgs = [];
   this.lconsulta = [];
   this.llenarConsultaCatalogos();
   
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
        resp => {
            this.encerarMensajes();
            this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
            this.manejaRespuestaCatalogos(resp);
        },
        error => {
            this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {

    const consultaModulo = new Consulta('Tgenmodulo', 'Y', 't.nombre', {},{});
    consultaModulo.cantidad = 50;
    this.addConsultaPorAlias('MODULOS', consultaModulo);

    const consultaEstructura = new Consulta('todcestructura', 'Y', 't.estructura', {}, {});
    consultaEstructura.cantidad = 50;
    this.addConsultaPorAlias('ESTRUCTURA', consultaEstructura);

  }

  cambiarEstructura(event: any): any {
    this.msgs = [];
  
    if (this.mcampos.cmodulo === undefined || this.mcampos.cmodulo === null) {
      this.limpiar();
      return;
    };
    this.fijarListaEstructura(Number(event.value));
    this.llenaListaModuloEstructura(this.lestructura, this.componentehijo);
  }
  limpiar() {
    this.mcampos.cestructura = null;
    this.lestructura = [];
    }
    fijarListaEstructura(cmodulo: any) {
      while (this.lestructura.length > 0) {
        this.lestructura.pop();
      }
      for (const i in this.lModuloEstructura) {
        if (this.lModuloEstructura.hasOwnProperty(i)) {
          const reg: any = this.lModuloEstructura[i];
          if (reg !== undefined && reg.value !== null && reg.cmodulo === Number(cmodulo)) {
            this.lestructura.push({ label: reg.estructura, value: reg.cestructura });
          }
        }
      }
    }
    public llenaListaModuloEstructura(pLista: any, componentehijo = null) {
      if (pLista.length === 0) {
        this.limpiar();
        componentehijo.mostrarMensajeError('NO EXISTE DATOS DE ESTRUCTURAS PARA EL MODULO SELECCIONADO');
        return;
      }
      componentehijo.mcampos.cestructura = pLista[0].value;
    }
    private manejaRespuestaCatalogos(resp: any) {
      const msgs = [];
      if (resp.cod === 'OK') {

        this.llenaListaCatalogo(this.lmodulo, resp.MODULOS, 'cmodulo');
        this.lModuloEstructura = resp.ESTRUCTURA;
      }
      this.lconsulta = []; 
    }  
    
  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteODC_Auditoria';
    // Agregar parametros
    this.jasper.parametros['@cestructura'] = this.mcampos.cestructura;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/OrganismosControl/ReporteODC_Auditoria';
    this.jasper.generaReporteCore();
  }

}