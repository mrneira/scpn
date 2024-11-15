import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovClientesComponent} from '../../../lov/clientes/componentes/lov.clientes.component';

@Component({
  selector: 'app-antiguedad-cartera-cliente',
  templateUrl: 'antiguedadCarteraCliente.html'
})
export class AntiguedadCarteraClienteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovClientesComponent)
  public lovClientes: LovClientesComponent;

  public lestadosCxC: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ANTIGUEDADCARTERACLIENTE', false);
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
    this.rqConsulta.CODIGOCONSULTA = 'CON_ANTIGUEDADCARTERACLIENTE';
    this.rqConsulta.storeprocedure = "sp_ConRptAntiguedadCarteraCliente";
    this.rqConsulta.parametro_identificacion = this.mcampos.identificacion;
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
    this.lregistros = resp.CON_ANTIGUEDADCARTERACLIENTE;
  }

  /**Muestra lov de Clientes */
  mostrarLovClientes(): void {
    this.lovClientes.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovClientes(reg: any): void {
      if (reg.registro !== undefined) {
        this.mcampos.identificacion = reg.registro.identificacion;
        this.mcampos.nombre = reg.registro.nombre;
        this.mcampos.cpersona = reg.registro.cpersona;
      }
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rpt';
    this.jasper.formatoexportar=resp;
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacionProv;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConAntiguedadCarteraCliente';
    this.jasper.generaReporteCore();
  }
}
