import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovUsuariosComponent} from '../../../lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'usuarioReporte.html'
})
export class UsuarioReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  public lestado: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEUSUARIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();

    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }
  
   validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteUsuario';
    
    
    if((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin) ){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      
  }else{
    if (this.mcampos.identificacion === undefined) {
      this.mcampos.identificacion = '';
    }

   

    if (this.mcampos.estado === undefined) {
      this.mcampos.estado = '';
    }

    if (this.mcampos.finicio === undefined || this.mcampos.finicio === null || this.mcampos.finicio ==='') {
      this.mcampos.finicio = null
    }

    if (this.mcampos.ffin === undefined || this.mcampos.ffin === null || this.mcampos.ffin ==='') {
      this.mcampos.ffin = null
    } 
  // Agregar parametros
  this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
  this.jasper.parametros['@i_estado'] = this.mcampos.estado;
  this.jasper.parametros['@i_finicio'] = this.mcampos.finicio;
  this.jasper.parametros['@i_ffin'] = this.mcampos.ffin;
  this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguridad/usuario';

  this.jasper.generaReporteCore();

     }
  }

  /**Muestra lov de usuarios */
  mostrarLovUsuarios(): void {
    this.lovusuariosregistro.showDialog();
  }

  /**Retorno de lov de usuarios. */
  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuario = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      this.mcampos.identificacion = reg.registro.mdatos.identificacion;
    }
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

    
    const mfiltrosEstUsr: any = {'ccatalogo': 1};
    const consultaEstUsr = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaEstUsr.cantidad = 50;
    this.addConsultaPorAlias('ESTADOUSUARIO', consultaEstUsr);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestado, resp.ESTADOUSUARIO, 'cdetalle');
    }
    this.lconsulta = [];
  }
}
