import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPartidaGastoComponent } from '../../../lov/partidagasto/componentes/lov.partidagasto.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/util/servicios/app.service';

@Component({
  selector: 'app-reporte-auxiliar-presupuestario-gastos',
  templateUrl: 'AuxiliarPresupuestarioGastos.html'
})
export class AuxiliarPresupuestarioGastosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPartidaGastoComponent)
  public lovpartidasgasto: LovPartidaGastoComponent;

  public totalVModificado: Number = 0;
  public totalVCompromiso: Number = 0;
  public totalVDevengado: Number = 0;
  public totalVPagado: Number = 0;

  public codigoDetalle: String = "";

  public regconsulta: any = [];
  public infoadicional = false;

  public lperiodo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'tpptauxiliargasto', 'PPT_AUXILIARGASTOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(null, this.route);

    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;
    this.cargarLPeriodos();
    this.mcampos.periodo = this.anioactual;
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  mostrarlovpartidasgasto(): void {
    this.lovpartidasgasto.mfiltros.movimiento = true;
    this.lovpartidasgasto.showDialog();
  }

  /**Retorno de lov de productos. */
  fijarlovpartidasgastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.npartida = reg.registro.nombre;
      this.mfiltros.cpartidagasto = reg.registro.cpartidagasto;
    }
  }
  // Inicia CONSULTA *********************
  consultar() {

    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.consultarAuxiliarPresupuestarioGastos();
  }

  consultarAuxiliarPresupuestarioGastos() {
    this.rqConsulta.CODIGOCONSULTA = 'PPT_AUXILIARGASTOS';
    this.rqConsulta.storeprocedure = "sp_PptRptAuxiliarPresupuestarioGastos";
    delete this.rqConsulta.parametro_ccomprobante;

    this.rqConsulta.parametro_aniofiscal = this.mcampos.periodo;
    this.rqConsulta.parametro_cpartidagasto = this.mfiltros.cpartidagasto;
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
    this.lregistros = [];
    this.lregistros = resp.PPT_AUXILIARGASTOS;
    for (const i in resp.PPT_AUXILIARINGRESOS) {
      const reg = resp.PPT_AUXILIARINGRESOS[i];
      this.totalVCompromiso += reg.vcompromiso;
      this.totalVModificado += reg.vmodificado;
      this.totalVDevengado += reg.vdevengado;
      this.totalVPagado += reg.vpagado;
    }
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cclasificador', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tpptclasificador', 'codigo', 'nombre', 'i.cclasificador = t.cclasificador');

    this.addConsulta(consulta);
    return consulta;
  }
  private fijarFiltrosConsulta() {
  }


  descargarReporte(reg: any): void {

    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptPptAuxiliarPresupuestarioGastos';

    // Agregar parametros
    this.jasper.parametros['@i_aniofiscal'] = this.mcampos.periodo;
    this.jasper.parametros['@i_cpartidagasto'] = this.mfiltros.cpartidagasto;
    this.jasper.parametros['@i_nombrepartida'] = this.mcampos.npartida;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.cusuario;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAuxiliarPresupuestarioGastos';
    this.jasper.generaReporteCore();
  }

  cargarLPeriodos() {
    let i = 2018;
    for (i = 2018; i <= 2050; i++) {
      this.lperiodo.push({ label: i.toString(), value: i });
    }
  }

}
