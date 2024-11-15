import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPartidaIngresoComponent } from '../../../lov/partidaingreso/componentes/lov.partidaingreso.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/util/servicios/app.service';

@Component({
  selector: 'app-reporte-auxiliar-presupuestario-ingresos',
  templateUrl: 'AuxiliarPresupuestarioIngresos.html'
})
export class AuxiliarPresupuestarioIngresosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPartidaIngresoComponent)
  public lovpartidasingreso: LovPartidaIngresoComponent;

  public totalvalor: Number = 0;
  public totaldevengado: Number = 0;
  public totalsaldopordevengar: Number = 0;

  public codigoDetalle: String = "";

  public regconsulta: any = [];
  public infoadicional = false;
  
  public lperiodo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'tpptcedulaingreso', 'PPT_AUXILIARINGRESOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(null, this.route);

    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;
    this.cargarLPeriodos();
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

  mostrarlovpartidasingreso(): void {
    this.lovpartidasingreso.mfiltros.movimiento = true;
    this.lovpartidasingreso.showDialog();
  }

  /**Retorno de lov de productos. */
  fijarlovpartidasingresoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.npartida = reg.registro.nombre;
      this.mfiltros.cpartidaingreso = reg.registro.cpartidaingreso;
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
    this.consultarAuxiliarPresupuestarioIngresos();
  }

  consultarAuxiliarPresupuestarioIngresos() {
    this.rqConsulta.CODIGOCONSULTA = 'PPT_AUXILIARINGRESOS';
    this.rqConsulta.storeprocedure = "sp_PptRptAuxiliarPresupuestarioIngresos";
    delete this.rqConsulta.parametro_ccomprobante;

    this.rqConsulta.parametro_aniofiscal = this.mcampos.periodo;
    this.rqConsulta.parametro_cpartidaingreso = this.mfiltros.cpartidaingreso;
    this.rqConsulta.parametro_usuariolog = this.dtoServicios.mradicacion.np;
    this.rqConsulta.parametro_nombrepartida = this.mcampos.npartida;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaComprobantes(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaComprobantes(resp: any) {
    this.lregistros = [];
    this.totalvalor = 0;
    this.totaldevengado = 0;
    this.totalsaldopordevengar = 0;
    if (resp.cod !== 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    for (const i in resp.PPT_AUXILIARINGRESOS){
      const reg = resp.PPT_AUXILIARINGRESOS[i];
      this.totalvalor += reg.valor;
      this.totaldevengado += reg.devengado;
      this.totalsaldopordevengar += reg.saldopordevengar;
    }
    this.lregistros = resp.PPT_AUXILIARINGRESOS;
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

  IrAComprobanteContable(reg){

    const opciones = {};
    const tran = 2 ;
    opciones['path'] = 10 + '-'+ tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-'+ tran + ' Acciones';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {skipLocationChange: true, 
                                              queryParams: {comprobante: JSON.stringify({ccomprobante: reg.comprobante,
                                                                                        cmodulo: 10 })}});
    this.appService.titulopagina = opciones['tit'];
  }

  descargarReporte(reg: any): void {


    if (this.estaVacio(this.mfiltros.cpartidaingreso) || this.mfiltros.cpartidaingreso === null) {
      this.mostrarMensajeError("INGRESE CÓDIGO DE PARTIDA");
      return;
    }

    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptPptAuxiliarPresupuestarioIngresos';

    // Agregar parametros
    this.jasper.parametros['@@i_cpartidaingreso'] = this.mfiltros.cpartidaingreso;
    this.jasper.parametros['@@i_aniofiscal'] = this.mcampos.periodo;
    this.jasper.parametros['@i_nombrepartida'] = this.mcampos.npartida;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.cusuario;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAuxiliarPresupuestarioIngresos';
    this.jasper.generaReporteCore();
  }

  cargarLPeriodos(){
    let i = 2018;
    for (i = 2018; i<= 2050; i++){
      this.lperiodo.push({label:i.toString(), value: i });
    }
  }

}
