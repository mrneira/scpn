import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {VisorPdfComponent} from '../../../../../util/componentes/pdfViwer/componentes/visorPdf.component';

@Component({
  selector: 'app-perfiles-reporte',
  templateUrl: 'perfilesReporte.html'
})
export class PerfilesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(VisorPdfComponent)
  public visor: VisorPdfComponent;

  public lperfiles: SelectItem[] = [{label: '...', value: null}];
  public lestado: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEPERFILES', false);
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
    
    this.jasper.nombreArchivo = 'ReportePerfiles';
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros

    this.jasper.parametros['@i_nombre'] = this.mcampos.nombre;

    this.jasper.parametros['@i_rol'] = this.mcampos.rol;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguridad/perfiles';
    this.jasper.generaReporteCore();
    
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

    const consultaRol = new Consulta('TsegRol', 'Y', 't.nombre', {}, {});
    consultaRol.cantidad = 100;
    this.addConsultaPorAlias('PERFILES', consultaRol);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lperfiles, resp.PERFILES, 'crol');
    }
    this.lconsulta = [];
  }
}
