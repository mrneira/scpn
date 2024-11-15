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
  templateUrl: 'usuarioCreacionReporte.html'
})
export class UsuarioCreacionReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  public lestado: SelectItem[] = [{label: '...', value: null}];
  public ldia: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEUSUARIOSCREACION', false);
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
    this.jasper.nombreArchivo = 'ReporteUsuariosCreacion';
    if (this.mcampos.identificacion === undefined) {
      this.mcampos.identificacion = '';
    }

    // Agregar parametros
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguridad/CreacionUsuario';



    this.jasper.generaReporteCore();
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

    const mfiltrosDia: any = {'ccatalogo': 5};
    const consultaDia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosDia, {});
    consultaDia.cantidad = 50;
    this.addConsultaPorAlias('DIA', consultaDia);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      
      this.llenaListaCatalogo(this.lestado, resp.ESTADOUSUARIO, 'cdetalle');
      this.llenaListaCatalogo(this.ldia, resp.DIA, 'cdetalle');
    }
    this.lconsulta = [];
  }
}
