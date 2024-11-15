import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { JasperComponent } from "app/util/componentes/jasper/componentes/jasper.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";
import { SelectItem, ConfirmationService } from "primeng/primeng";


@Component({
  selector: 'app-anticipo',
  templateUrl: 'anticipo.html'
})
export class AnticipoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  //RRO 20230123
  private lEstados: SelectItem[] = [{ label: 'TODOS', value: 0 },{ label: 'ACTIVO', value: 1 },{ label: 'INACTIVO', value: 2 }];  
  private lSolicitudAnticipo: any = [];
  selectedvalue: string = "";
  public totalRegistros: number = 0;    
  private Totalsaldoinicial: number = 0;
  private Totalpagado: number = 0;
  private Totaldiferencia: number = 0;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tthcontratodetalle', 'CONTRATOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.estado = 0;
    this.mcampos.finicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    this.mcampos.ffin = new Date(new Date().getFullYear(), new Date().getMonth(), this.getDaysInMonth(new Date().getFullYear(), new Date().getMonth()))
  }


  ngAfterViewInit() {
  }

  getDaysInMonth(m, y) {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}
  
  consultarSolicitud() {
    this.rqConsulta = [];
    let inicio: string = this.mcampos.finicio.toISOString().slice(0, 10);
    let fin: string = this.mcampos.ffin.toISOString().slice(0, 10);

    this.lSolicitudAnticipo = [];
    this.totalRegistros = 0;
    this.Totalsaldoinicial = 0;
    this.Totalpagado = 0;
    this.Totaldiferencia = 0;
    this.rqConsulta.CODIGOCONSULTA = 'ANTICIPOS_REPORTE_FINANCIERO';
    this.rqConsulta.storeprocedure = "sp_AntReporteFinanciero";
    this.rqConsulta.parametro_finicio = inicio.replace(/-/g,'');
    this.rqConsulta.parametro_ffin = fin.replace(/-/g,'');
    this.rqConsulta.parametro_filtro = this.mcampos.estado;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {    
          this.lSolicitudAnticipo = resp.ANTICIPOS_REPORTE_FINANCIERO;
          this.totalRegistros = this.lSolicitudAnticipo.length;
          this.lSolicitudAnticipo.forEach(li => {
          this.Totalsaldoinicial += li.saldoinicial;
          this.Totalpagado += li.pagado;
          this.Totaldiferencia += li.diferencia;
        });  
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }


  recargarSolicitud(){
    this.lSolicitudAnticipo = [];
    this.mcampos.finicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    this.mcampos.ffin = new Date(new Date().getFullYear(), new Date().getMonth(), this.getDaysInMonth(new Date().getFullYear(), new Date().getMonth())) 
    this.mcampos.estado = 0;
    this.totalRegistros = 0;
  }

  generaReporte(resp: any): void {
    let inicio: string = this.mcampos.finicio.toISOString().slice(0, 10);
    let fin: string = this.mcampos.ffin.toISOString().slice(0, 10);

    this.jasper.nombreArchivo = 'Reporte_saldo_anticipos';
    this.jasper.parametros['@finicio'] = inicio.replace(/-/g,'');
    this.jasper.parametros['@ffin'] = fin.replace(/-/g,'');
    this.jasper.parametros['@filtro'] = this.mcampos.estado;
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptReporteAnticipos';
    this.jasper.generaReporteCore();
  }

  /**
   * Función: Exportar reporte (pdf/xls)
   * @param tipo 
   */
  ImprimirSolicitud(tipo: any){
    this.generaReporte(tipo);
  }

}
