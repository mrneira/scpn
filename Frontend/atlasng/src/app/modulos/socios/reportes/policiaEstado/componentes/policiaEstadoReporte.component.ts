import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'policiaEstadoReporte.html'
})
export class PoliciaEstadoReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ljerarquias: SelectItem[] = [{ label: '...', value: null }];
  public lgrados: SelectItem[] = [{ label: '...', value: null }];
  public lestadopolicias: SelectItem[] = [{ label: '...', value: null }];
  public lhistorico: SelectItem[] = [{ label: '...', value: null }];
  public selectedEstaods: any = [];



  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocestadosocio', 'POLICIAESTADOREPORTE', false);
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
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    let listaEstados : any = [];

    for (const i in this.mcampos.estadopolicia) {
      const reg = this. mcampos.estadopolicia[i];
      listaEstados.push({"estado": reg});
    }


    this.jasper.nombreArchivo = 'ReporteMiembrosEstado';
    if (this.mcampos.jerarquia === undefined || this.mcampos.jerarquia === null) {
      this.mcampos.jerarquia = '';
    }

    if (this.mcampos.grado === undefined || this.mcampos.grado === null) {
      this.mcampos.grado = -1;
    }

    if (this.mcampos.estadopolicia === undefined || this.mcampos.estadopolicia === null) {
      this.mcampos.estadopolicia = '';
    }

    if (this.mcampos.historicopolicia === undefined || this.mcampos.historicopolicia === null) {
      this.mcampos.historicopolicia = -1;
    }

    if (this.mcampos.fInicio === undefined || this.mcampos.fInicio === null) {
      this.mcampos.fInicio = null
    }

    if (this.mcampos.fFin === undefined || this.mcampos.fFin === null) {
      this.mcampos.fFin = null
    }


    // Agregar parametros
    var fechini=new Date('1900-01-01');
    var fechfin=new Date('2100-01-01');
    this.mcampos.fInicio=(this.estaVacio(this.mcampos.fInicio))?fechini:this.mcampos.fInicio;
    this.mcampos.fFin=(this.estaVacio(this.mcampos.fFin))?fechfin:this.mcampos.fFin;
    this.jasper.parametros['@i_fInicio'] = this.mcampos.fInicio;
    this.jasper.parametros['@i_fFin'] = this.mcampos.fFin;
    this.jasper.parametros['@i_jerarquia'] = this.mcampos.jerarquia;
    this.jasper.parametros['@i_grado'] = this.mcampos.grado;
    this.jasper.parametros['@estadoPolicia'] = listaEstados;
    //this.jasper.parametros['@estadoPolicia'] = this.mcampos.estadopolicia;
    //this.jasper.parametros['@i_estado_policiaHis'] = listaHistorico;
    this.jasper.parametros['@i_estado_policiaHis'] = this.mcampos.historicopolicia;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/Miembros_por_Estado';

    this.jasper.generaReporteCore();
    this.mcampos.fInicio = null;
    this.mcampos.fFin = null;
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;

    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEstUsr: any = { 'ccatalogo': 2701 };
    const consultaJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaJerarquia.cantidad = 50;
    this.addConsultaCatalogos('JERARQUIA', consultaJerarquia, this.ljerarquias, super.llenaListaCatalogo, 'cdetalle');

    const consultaGrado = new Consulta('tsoctipogrado', 'Y', 't.nombre', {}, {});
    consultaGrado.cantidad = 100;
    this.addConsultaCatalogos('GRADO', consultaGrado, this.lgrados, super.llenaListaCatalogo, 'cgrado');

    const mfiltrosEstUsr1: any = { 'ccatalogo': 2703 };
    const consultaEstadoPolicia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr1,{});
    consultaEstadoPolicia.cantidad = 50;
    this.addConsultaCatalogos('ESTADOPOLICIA', consultaEstadoPolicia, this.lestadopolicias, super.llenaListaCatalogo, 'cdetalle', null, false);

    this.mfiltrosesp.cestadosocio='in(\'4\',\'8\',\'11\')'; 
    const consultaHistoricoPolica = new Consulta('tsocestadosocio', 'Y', 't.nombre', {}, this.mfiltrosesp);
    consultaHistoricoPolica.cantidad = 50;
    this.addConsultaCatalogos('HISTORICOPOLICIA', consultaHistoricoPolica, this.lhistorico, super.llenaListaCatalogo, 'cestadosocio');

    this.ejecutarConsultaCatalogos();
  }

}
