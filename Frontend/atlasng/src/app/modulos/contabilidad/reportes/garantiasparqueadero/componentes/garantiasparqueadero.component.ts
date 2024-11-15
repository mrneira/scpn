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
  selector: 'app-garantias-parqueadero',
  templateUrl: 'garantiasparqueadero.html'
})
export class GarantiasParqueaderoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovClientesComponent)
  public lovClientes: LovClientesComponent;

  public lestadosCxC: any[] = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'DEUDASCLIENTESREPORTE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  /**Muestra lov de Clientes */
  mostrarLovClientes(): void {
    this.lovClientes.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovClientes(reg: any): void {
      if (reg.registro !== undefined) {
        this.mfiltros.cpersona = reg.registro.cpersona;
        this.mfiltros.ccompania = reg.registro.ccompania;
        this.mcampos.identificacionProv = reg.registro.identificacion;
        this.mcampos.nombreProv = reg.registro.nombre;
        this.mcampos.cpersona = reg.registro.cpersona;
      }
  }


  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'GarantiasParqueadero';
    this.jasper.formatoexportar=resp;
    this.jasper.parametros['@i_cpersona'] = this.mfiltros.cpersona;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConGarantiasParqueadero';
    this.jasper.generaReporteCore();
  }
}
