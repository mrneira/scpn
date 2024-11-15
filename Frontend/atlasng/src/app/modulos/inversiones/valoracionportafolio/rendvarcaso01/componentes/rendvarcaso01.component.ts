import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-rendvarcaso01',
  templateUrl: 'rendvarcaso01.html'
})
export class Rendvarcaso01Component extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public bvq: any;
  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RENDVARCASO01', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.obtenerParametros()
    super.init();
    this.mcampos.fcorte = new Date();
    this.consultarCatalogos();

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

  obtenerParametros()
  {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVRENDBVQ';
      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.llenarDatos(resp);
       
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

llenarDatos(resp:any){

  this.bvq = resp.CALCULADORA_RENDIMIENTO_BVQ;

}


private manejaRespuestaCatalogos(resp: any) {
  if (resp.cod === 'OK') {

  this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');

  }
  this.lconsulta = [];
}

llenarConsultaCatalogos(): void {
      const mfiltrosEmisor = { 'ccatalogo': 1213 };
      const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
      consultaEmisor.cantidad = 100;
      this.addConsultaPorAlias('EMISOR', consultaEmisor);
  }

irACalculadora()
{
  window.open(this.bvq);
  return;
}
  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
       this.mostrarMensajeError(mensaje);
       return;
     }

    this.jasper.nombreArchivo = 'rptInvMatRentaVariable';
   
    this.jasper.formatoexportar = resp;
    
    this.jasper.parametros['@tasamercado'] = this.registro.tasa;
    this.jasper.parametros['@emisordetalle'] = this.registro.emisorcdetalle;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvMatRentaVariable';
    this.jasper.generaReporteCore();

  }



  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mcampos.fcorte)) {
        lmensaje = "FECHA DE CORTE OBLIGATORIA";
      }  
    return lmensaje;
  }

  

}
