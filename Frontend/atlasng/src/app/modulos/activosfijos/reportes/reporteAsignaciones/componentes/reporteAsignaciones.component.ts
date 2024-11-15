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
import { LovProveedoresComponent } from '../../../../contabilidad/lov/proveedores/componentes/lov.proveedores.component';

@Component({
  selector: 'app-reporteAsignaciones',
  templateUrl: 'reporteAsignaciones.html'
})
export class ReporteAsignacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;
 
  @ViewChild(LovFuncionariosComponent)
  lovFuncionario: LovFuncionariosComponent;

  @ViewChild(LovProveedoresComponent)
  lovProveedores: LovProveedoresComponent;

  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
 
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTEASIGNACIONES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    let fIngreso = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mfiltros.finicio = fIngreso;
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
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.ejecutarConsultaCatalogos();
  }


  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReporteAsignaciones';

    if(this.mfiltros.codigo === undefined ||this.mfiltros.codigo === null) 
    {
      this.mfiltros.codigo ='';
    }
    if(this.mfiltros.nombre === undefined ||this.mfiltros.nombre === null) 
    {
      this.mfiltros.nombre = '';
    }  
    if (this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("LA FECHA DESDE ES MAYOR A LA FECHA HASTA");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mfiltros.finicio=null;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null) {
      this.mfiltros.ffin=null;
    }
    if (this.registro.cusuarioavala === undefined || this.registro.cusuarioavala === null)
    {
      this.registro.cusuarioavala=-1;
    }
 
    // Agregar parametros

    this.jasper.parametros['@i_codigo'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_nombre'] = this.mfiltros.nombre;
    this.jasper.parametros['@i_usuario_asig'] = this.registro.cusuarioavala;
    this.jasper.parametros['@i_fecha_ini'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_fecha_fin'] = this.mfiltros.ffin;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfAsignaciones';
    this.jasper.generaReporteCore();
    this.mcampos.cpersona=null;
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {

    if (reg.registro !== undefined) {
      this.registro.cusuarioavala = reg.registro.cpersona;
      this.registro.nfuncionarioavala = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.registro.mdatos.nfuncionarioavala = reg.registro.primernombre +" "+reg.registro.primerapellido; 
    }
  }


}
