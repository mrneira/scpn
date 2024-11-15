import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProductosComponent} from '../../../lov/productos/componentes/lov.productos.component';

@Component({
  selector: 'app-reporte-cronologiaValores',
  templateUrl: 'cronologiaValoresReporte.html'
})
export class CronologiaValoresReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;

  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TacfKardex', 'TACFKARDEX', false);
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
      if (this.mfiltros.codigo == null) {
        super.mostrarMensajeError('PRODUCTO REQUERIDO');
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
      this.consultarKardex();
  }
  
  consultarKardex() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_CRONOLOGIAVALORES';
    this.rqConsulta.storeprocedure = "sp_AcfConCronologiaValoresBien";

    this.rqConsulta.parametro_cproducto = this.mfiltros.codigo === undefined ? "" : this.mfiltros.codigo;
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.msgs = [];
    
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaKardex(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaKardex(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_CRONOLOGIAVALORES;
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

    if (this.mfiltros.codigo == null) {
      super.mostrarMensajeError('PRODUCTO REQUERIDO');
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
    this.jasper.nombreArchivo = 'ReporteCronologiaValores';
    // Agregar parametros
    this.jasper.parametros['@i_cproducto'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfCronologiaValores';
    this.jasper.generaReporteCore();
  }

  mostrarlovproductos(): void {
    this.lovproductos.mfiltros.movimiento = true;
    this.lovproductos.showDialog();
  }

  /**Retorno de lov de productos. */
fijarLovProductosSelec(reg: any): void {
  if (reg.registro !== undefined) {
   
    this.registro.mdatos.nproducto = reg.registro.nombre;
    this.mfiltros.cproducto = reg.registro.cproducto;
    this.mfiltros.codigo = reg.registro.codigo;
    
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
