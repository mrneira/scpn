import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPartidaGastoComponent } from '../../../lov/partidagasto/componentes/lov.partidagasto.component';


@Component({
  selector: 'app-reporte-historialPartidaGasto',
  templateUrl: 'historialPartidaGasto.html'
})
export class HistorialPartidaGastoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPartidaGastoComponent)
  lovpartidasgasto: LovPartidaGastoComponent;

  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptcompromisodetalle', 'TPPCOMPROMISO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mfiltros.finicio =  finicio;
    this.mfiltros.ffin = this.fechaactual; 
    this.consultarCatalogos();
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
  
  // Inicia CONSULTA *********************
  consultar() {
      if (this.mfiltros.cpartidagasto == null) {
        super.mostrarMensajeError('PARTIDA REQUERIDA');
        return;
      }
      if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
        this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
        return;
      }
      if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
        this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
        return;
      }
      this.consultarPartida();
  }
  
  consultarPartida() {
    this.rqConsulta.CODIGOCONSULTA = 'PPT_HISTORIALPARTIDAGASTO';
    this.rqConsulta.storeprocedure = "sp_PptConHistorialPartidaGasto";

    this.rqConsulta.parametro_cpartidagasto = this.mfiltros.cpartidagasto === undefined ? "" : this.mfiltros.cpartidagasto;
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.msgs = [];
    
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaPartida(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaPartida(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.PPT_HISTORIALPARTIDAGASTO;
    }
  }

  public crearDtoConsulta() {
      this.fijarFiltrosConsulta();
      const consulta = new Consulta(this.entityBean, 'Y', 't.ckardex', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('Tacfproducto', 'codigo', 'nombre', 'i.cproducto = t.cproducto');
          
      this.addConsulta(consulta);
      return consulta;
  }
  private fijarFiltrosConsulta() {
  }

  descargarReporte(reg: any): void {

    if (this.mfiltros.cpartidagasto == null) {
      super.mostrarMensajeError('PARTIDA REQUERIDA');
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.jasper.formatoexportar=reg;
    this.jasper.nombreArchivo = 'ReporteHistorialPartidaGasto';
    // Agregar parametros
    this.jasper.parametros['@i_cpartidagasto'] = this.mfiltros.cpartidagasto;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptHistorialPartidaGasto';
    this.jasper.generaReporteCore();
  }

  mostrarlovpartidasgasto(): void {
    this.lovpartidasgasto.showDialog();
  }

  /**Retorno de lov de productos. */
fijarlovpartidasgastoSelec(reg: any): void {
  if (reg.registro !== undefined) {

    this.registro.mdatos.nproducto = reg.registro.nombre;
    this.mfiltros.cpartidagasto = reg.registro.cpartidagasto;
    
  }
}

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
        resp => {
            this.encerarMensajes();
            this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        },
        error => {
            this.dtoServicios.manejoError(error);
        });
}


    
}
