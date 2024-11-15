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
  selector: 'app-rendimientoprivativo',
  templateUrl: 'rendimientoprivativo.html'
})
export class RendimientoprivativoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];

  public ltipoproductogen: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RENDIMIENTOPRIVATIVO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
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

    this.jasper.nombreArchivo = 'rptInvRendimientoPrivativoPago';
    let finicio: number = (this.mcampos.finicio.getFullYear() * 10000) + ((this.mcampos.finicio.getMonth() + 1) * 100) + this.mcampos.finicio.getDate();
    let ffin: number = (this.mcampos.ffin.getFullYear() * 10000) + ((this.mcampos.ffin.getMonth() + 1) * 100) + this.mcampos.ffin.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    let cproducto = this.estaVacio(this.mcampos.cproducto)?-1:this.mcampos.cproducto;
    let tipoProducto = this.estaVacio(this.mcampos.ctipoproducto)?-1:this.mcampos.ctipoproducto;
   
    this.jasper.parametros['@i_finicio'] = finicio;
    this.jasper.parametros['@i_ffin'] = ffin;
    this.jasper.parametros['@i_producto'] = cproducto;
    this.jasper.parametros['@i_tipoProducto'] = tipoProducto;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRendimientoPrivativopago';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";


    if (this.estaVacio(this.mcampos.fcorte)) {
      lmensaje = "FECHA DE CORTE OBLIGATORIA";
    }
    return lmensaje;
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    let cmodulo = 7;
    const mfiltrosProducto: any = { 'cmodulo': cmodulo };
    const consultaProducto = new Consulta('tgenproducto', 'Y', 't.cproducto', mfiltrosProducto, {});
    consultaProducto.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProducto, this.lproducto, super.llenaListaCatalogo, 'cproducto');


    const mfiltrosparamcalif = { 'cmodulo': cmodulo };
    const consultaParametrosCalificacion = new Consulta('tgentipoproducto', 'Y', 't.cproducto', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('TIPOPRODUCTOGEN', consultaParametrosCalificacion, this.ltipoproductogen, this.llenarCalidad, '', this.componentehijo, false);


    this.ejecutarConsultaCatalogos();
  }
  public llenarCalidad(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ltipoproductogen = pListaResp;

  }
  consultartipo(producto: any) {

    this.ltipoproducto = [{ label: '...', value: null }];
    for (const i in this.ltipoproductogen) {
      if (this.ltipoproductogen.hasOwnProperty(i)) {
        const reg = this.ltipoproductogen[i];
        if (reg.cproducto === this.mcampos.cproducto && reg.cmodulo === 7) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
  }

}
