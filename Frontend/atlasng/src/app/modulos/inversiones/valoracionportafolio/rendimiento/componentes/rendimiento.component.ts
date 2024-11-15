
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
  selector: 'app-rendimiento',
  templateUrl: 'rendimiento.html'
})
export class RendimientoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  public lemisor: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RENDIMIENTOPRIVATIVO', false);
    this.componentehijo = this;
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();



    const mfiltrosTipo: any = { 'ccatalogo': 1213 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('EMISORES', consultaTipo, this.lemisor, super.llenaListaCatalogo, 'cdetalle', this.componentehijo, false);

    this.ejecutarConsultaCatalogos();
  }
  fmax = new Date();
  ngOnInit() {
    super.init();
    this.fmax = new Date();
    let fechatmp = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    let fechan = new Date(fechatmp);
    this.fmax.setDate(fechan.getDate() + 1);
    this.mcampos.fcorte = this.fmax;
    this.consultarCatalogos();
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

    this.jasper.nombreArchivo = 'rptInvRendimiento';


    this.jasper.formatoexportar = resp;

    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mcampos.fdesde);
    this.jasper.parametros['@i_fcierre'] = this.fechaToInteger(this.mcampos.fcorte);
    this.jasper.parametros['@i_cemisor'] = (this.estaVacio(this.mcampos.emisor)) ? 'V' : this.mcampos.emisor;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRendimiento';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";
    if (this.estaVacio(this.mcampos.fdesde)) {

      lmensaje += "NO SE HA INGRESADO UNA FECHA DE INICIO DE CORTE";
    }


    return lmensaje;
  }


}
