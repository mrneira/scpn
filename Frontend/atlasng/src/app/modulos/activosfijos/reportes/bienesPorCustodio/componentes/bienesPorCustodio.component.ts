import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProductosComponent} from '../../../lov/productos/componentes/lov.productos.component';

@Component({
  selector: 'app-reporte-bienesPorCustodio',
  templateUrl: 'bienesPorCustodio.html'
})
export class BienesPorCustodioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;

  @ViewChild(LovFuncionariosComponent)
  lovFuncionarioAvala: LovFuncionariosComponent;
 
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'TACFKARDEXPRODCODI', false);
    this.componentehijo = this;
  }

  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  comportamiento:boolean=false;

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
      if (this.registro.cusuarioavala === undefined || this.registro.cusuarioavala === null)
      {
        super.mostrarMensajeError('FILTROS REQUERIDOS');
        return;
      }
      if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
        this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
        return;
      }
      if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null) {
        this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
        return;
      }
      this.consultarKardex();

  }
  
  consultarKardex() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_BIENESCUSTODIO';
    this.rqConsulta.storeprocedure = "sp_AcfConCronologiaBienesCustodio";
    this.rqConsulta.parametro_cfuncionario = this.registro.cusuarioavala === undefined ? "" : this.registro.cusuarioavala;
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
      this.lregistros = resp.AF_BIENESCUSTODIO;
    }
  }

  private fijarFiltrosConsulta() {
      this.mfiltros.activo = 0;
  }
  descargarReporte(reg: any): void {
    if (this.registro.cusuarioavala === undefined || this.registro.cusuarioavala === null)
    {
      super.mostrarMensajeError('FILTROS REQUERIDOS');
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
    this.jasper.nombreArchivo = 'ReporteCronologiaBienesCustodio';
    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = this.registro.cusuarioavala;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfCronologiaBienesCustodio';
    this.jasper.generaReporteCore();
  }
  mostrarLovFuncionarioAvala(): void {
    this.lovFuncionarioAvala.showDialog();
 
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioAvala(reg: any): void {

    if (reg.registro !== undefined) {
      this.registro.cusuarioavala = reg.registro.cpersona;
      this.registro.nfuncionarioavala = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.registro.mdatos.nfuncionarioavala = reg.registro.primernombre +" "+reg.registro.primerapellido; 
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
  public formatoFecha(valor: number): string {
    const anio = valor.toString().substring(0, 4);
    const mes = valor.toString().substring(4, 6);
    const dia = valor.toString().substring(6, 8);
    const fecha = anio + '-' + mes + '-' + dia;
    return fecha;
  }
  consultarInfo(reg:any){
    this.mcampos.infoadicional=reg.infoadicional;
    this.comportamiento=true;
  
  }   
}
