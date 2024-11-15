import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-consultagarantia',
  templateUrl: 'consultagarantia.html'
})
export class ConsultaGarantiaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipogarantia: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTECONSULTAGARANTIAS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteConsultaGarantias';

    if (this.estaVacio(this.mcampos.ctipogarantia)) {
      this.mcampos.ctipogarantia = -1;
    }
    if (this.estaVacio(this.mcampos.cestatus)) {
      this.mcampos.cestatus = -1;
    }

    // Agregar parametros
    this.jasper.parametros['@ctipogarantia'] = this.mcampos.ctipogarantia;
    this.jasper.parametros['@cestatus'] = this.mcampos.cestatus;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Garantias/rptGarEstadoGarantia';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const conTipoGarantia = new Consulta('tgartipogarantia', 'Y', 't.nombre', {}, {});
    conTipoGarantia.cantidad = 100;
    this.addConsultaCatalogos('TIPOGARANTIA', conTipoGarantia, this.ltipogarantia, super.llenaListaCatalogo, 'ctipogarantia');

    const conEmpresa = new Consulta('tgarestatus', 'Y', 't.nombre', {}, {});
    conEmpresa.cantidad = 100;
    this.addConsultaCatalogos('ESTATUS', conEmpresa, this.lestado, super.llenaListaCatalogo, 'cestatus');

    this.ejecutarConsultaCatalogos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

}
