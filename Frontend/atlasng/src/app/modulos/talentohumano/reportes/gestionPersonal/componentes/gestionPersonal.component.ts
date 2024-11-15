import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SpinnerModule } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { LovPaisesComponent } from '../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovProvinciasComponent } from '../../../../generales/lov/provincias/componentes/lov.provincias.component';
import { LovCantonesComponent } from '../../../../generales/lov/cantones/componentes/lov.cantones.component';
import { LovCiudadesComponent } from '../../../../generales/lov/ciudades/componentes/lov.ciudades.component';

@Component({
  selector: 'app-reporte-GestionPersonal',
  templateUrl: 'gestionPersonal.html'
})
export class GestionPersonalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;

  @ViewChild(LovCiudadesComponent)
  private lovCiudades: LovCiudadesComponent;

  public ldepartamento: SelectItem[] = [{ label: '...', value: null }];
  public lproceso: SelectItem[] = [{ label: '...', value: null }];
  public lgenero: SelectItem[] = [{ label: '...', value: null }];
  public lgocupacional: SelectItem[] = [{ label: '...', value: null }];
  public lregimen: SelectItem[] = [{ label: '...', value: null }];
  public lvinculacion: SelectItem[] = [{ label: '...', value: null }];

  departamentosS: string[] = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'GESTIONPERSONAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }


  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReporteGestionPersonal';

    if (this.mfiltros.cfuncionario === undefined || this.mfiltros.cfuncionario === null) {
      this.mfiltros.cfuncionario = -1;
    }
    
    if (this.departamentosS === undefined || this.departamentosS.length === 0) {
      this.mfiltros.departamento = -1;
    }
    if (this.mfiltros.area === undefined || this.mfiltros.area === null) {
      this.mfiltros.area = -1;
    }
    if (this.mfiltros.genero === undefined || this.mfiltros.genero === null) {
      this.mfiltros.genero = 'N';
    }
   
    if (this.mfiltros.gOcupacional === undefined || this.mfiltros.gOcupacional === null) {
      this.mfiltros.gOcupacional = -1;
    }
    if (this.mfiltros.regimen === undefined || this.mfiltros.regimen === null) {
      this.mfiltros.regimen = 'N';
    }
    if (this.mfiltros.tipoContrato === undefined || this.mfiltros.tipoContrato === null) {
      var tipo = -1
      this.mfiltros.tipoContrato = tipo;
    }
 
    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = this.mfiltros.cfuncionario;
    this.jasper.parametros['@i_departamento'] = this.mfiltros.cdepartamento;
    this.jasper.parametros['@i_area'] = this.mfiltros.area;
    this.jasper.parametros['@i_genero'] = this.mfiltros.genero;
     this.jasper.parametros['@i_gOcupacional'] = this.mfiltros.gOcupacional;
    this.jasper.parametros['@i_regimen'] = this.mfiltros.regimen;
    this.jasper.parametros['@i_tipoContrato'] = this.mfiltros.tipoContrato;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/GestionPersonal';
    this.jasper.generaReporteCore();
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.consultar();
    }
  }

  

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaEstatus = new Consulta('tthdepartamento', 'Y', 't.nombre', {}, {});
    consultaEstatus.cantidad = 100;
    this.addConsultaCatalogos('DEPARTAMENTO', consultaEstatus, this.ldepartamento, super.llenaListaCatalogo, 'cdepartamento');

    const consultaEstatusProceso = new Consulta('tthproceso', 'Y', 't.nombre', {}, {});
    consultaEstatusProceso.cantidad = 100;
    this.addConsultaCatalogos('PROCESO', consultaEstatusProceso, this.lproceso, super.llenaListaCatalogo, 'cproceso');

    const mfiltrosEstGenero: any = { 'ccatalogo': 302 };
    const consultaEstatusGenero = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstGenero, {});
    consultaEstatusGenero.cantidad = 100;
    this.addConsultaCatalogos('GENERO', consultaEstatusGenero, this.lgenero, super.llenaListaCatalogo, 'cdetalle');

    const consultaEstatusGOcupacional = new Consulta('tthgrupoocupacional', 'Y', 't.nombre', {}, {});
    consultaEstatusGOcupacional.cantidad = 100;
    this.addConsultaCatalogos('GOCUPACIONAL', consultaEstatusGOcupacional, this.lgocupacional, super.llenaListaCatalogo, 'cgrupo');

    const mfiltrosEstRegimen: any = { 'ccatalogo': 1114 };
    const consultaEstatusRegimen = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstRegimen, {});
    consultaEstatusRegimen.cantidad = 100;
    this.addConsultaCatalogos('REGIMEN', consultaEstatusRegimen, this.lregimen, super.llenaListaCatalogo, 'cdetalle');

    const consultaEstatusVinculacion = new Consulta('tthtipovinculacion', 'Y', 't.nombre', {}, {});
    consultaEstatusVinculacion.cantidad = 100;
    this.addConsultaCatalogos('VINCULACION', consultaEstatusVinculacion, this.lvinculacion, super.llenaListaCatalogo, 'ctipovinculacion');

   

    this.ejecutarConsultaCatalogos();
    this.ldepartamento.splice(0, 1);
    
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }


}
