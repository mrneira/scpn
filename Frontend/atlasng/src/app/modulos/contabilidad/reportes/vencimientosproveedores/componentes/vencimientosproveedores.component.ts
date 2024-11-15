import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProveedoresComponent} from '../../../lov/proveedores/componentes/lov.proveedores.component';

@Component({
  selector: 'app-vencimientos-proveedores',
  templateUrl: 'vencimientosproveedores.html'
})
export class VencimientosProveedoresComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProveedoresComponent)
  public lovProveedores: LovProveedoresComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'VENCIMIENTOSPROVEEDORES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  consultar() {
    this.consultarCartera();
  }

  consultarCartera() {
    this.rqConsulta.CODIGOCONSULTA = 'CON_VENCIMIENTOSPROVEEDORES';
    this.rqConsulta.storeprocedure = "sp_ConRptVencimientoCuentasPorPagar";
    this.rqConsulta.parametro_cpersona = this.mcampos.cpersona;
    this.msgs = [];    
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any) {
    this.lregistros = resp.CON_VENCIMIENTOSPROVEEDORES;
  }

  /**Muestra lov de Clientes */
  mostrarLovProveedores(): void {
    this.lovProveedores.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovProveedores(reg: any): void {
      if (reg.registro !== undefined) {
        this.mcampos.identificacion = reg.registro.identificacion;
        this.mcampos.nombre = reg.registro.nombre;
        this.mcampos.cpersona = reg.registro.cpersona;
      }
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rptConVencimientosProveedores';
    this.jasper.formatoexportar=resp;
    this.jasper.parametros['@i_cpersona'] = this.mcampos.cpersona;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConVencimientosProveedores';
    this.jasper.generaReporteCore();
  }
}
