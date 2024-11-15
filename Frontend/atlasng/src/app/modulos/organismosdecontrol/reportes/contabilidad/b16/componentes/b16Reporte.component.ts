import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-b16Reporte',
  templateUrl: 'b16Reporte.html'
})
export class B16ReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lmesesini: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEB16', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.fperiodo = this.anioactual;
    this.fijarListaMeses();
    this.consultarCatalogos();
    
  }

  ngAfterViewInit() {
  }

  
  consultar() {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mcampos.tipoplancuenta === undefined || this.mcampos.tipoplancuenta === null){
      this.mostrarMensajeError("INGRESE TIPO DE PLAN");
      return;
    }
    this.generarReporte();
  }
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: 1 });
    this.lmesesini.push({ label: "FEBRERO", value: 2 });
    this.lmesesini.push({ label: "MARZO", value: 3 });
    this.lmesesini.push({ label: "ABRIL", value: 4 });
    this.lmesesini.push({ label: "MAYO", value: 5 });
    this.lmesesini.push({ label: "JUNIO", value: 6 });
    this.lmesesini.push({ label: "JULIO", value: 7 });
    this.lmesesini.push({ label: "AGOSTO", value: 8 });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: 9 });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }
  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosEstUsr: any = {'ccatalogo': 1001,'cdetalle':'PC-FA'};
    const consultaTipoPlanCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaTipoPlanCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOPLANCUENTA', consultaTipoPlanCuenta);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipoplancuentas, resp.TIPOPLANCUENTA, 'cdetalle');
    }
    this.lconsulta = [];
  }
  

  public generarReporte() {
    this.rqConsulta.CODIGOCONSULTA = 'OC_B16REPORTE';
    this.rqConsulta.storeprocedure = "sp_OdcRptReporteb16";
    this.rqConsulta.parametro_fperiodo= this.mfiltros.fperiodo
    this.rqConsulta.parametro_finicio= this.mfiltros.finicio 
    this.rqConsulta.parametro_tipoplancuenta = this.mcampos.tipoplancuenta === undefined ?"": this.mcampos.tipoplancuenta    

    this.dtoServicios.ejecutarConsultaRest(this.rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.lregistros = resp.OC_B16REPORTE;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
 
   imprimir(resp: any): void {
    const linkElement1 = document.createElement('a');
    var fechaUltimoDia = new Date(this.mfiltros.fperiodo, this.mfiltros.finicio, 0).getDate() ;
    var data = ""; 
    var archivo = "";
    var separador = ('\t');; 
    var salto = ('\r\n');
    var cabecera = 'B16'+ separador + this.lregistros[0].codigo +  separador + fechaUltimoDia  + '/' + this.mfiltros.finicio +'/'  + this.mfiltros.fperiodo;
    var contador = 0;
    var numerolineas = 0;
    var cuadre =0;
    
    for(const i in this.lregistros){
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if(this.estaVacio(reg.monto)|| reg.monto === 0)
            {
              reg.monto = '0.00';
            }  

            if( reg.ccuenta === '734' || reg.ccuenta === '73402'|| reg.ccuenta === '76'){
              reg.monto = '0.00'
            }      
            data =  data + reg.ccuenta  + separador + 
                 reg.monto + separador + 
                 salto ;
                 contador ++;
                 cuadre += Number(reg.monto);
          
        }  
      }       
          numerolineas = contador + 1; 
          archivo = cabecera +separador + numerolineas + separador + this.redondear(cuadre,2) + salto + data;      
          var blob = new Blob([archivo], { type: 'application/octet-stream' });
          const bloburl = URL.createObjectURL(blob);        
          linkElement1.href = bloburl;        
          linkElement1.download = "B16M"+this.lregistros[0].codigo + + fechaUltimoDia + '' + this.mfiltros.finicio + '' + this.mfiltros.fperiodo + '.'+"txt";
          const clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
        linkElement1.dispatchEvent(clickEvent);
  
  }


}
