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
  selector: 'app-historialEntregaAF',
  templateUrl: 'historialEntregaAF.html'
})
export class HistorialEntregaAFComponent extends BaseComponent implements OnInit, AfterViewInit {

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
    super(router, dtoServicios, 'ABSTRACT', 'ENTREGASAF', false);
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
    this.mfiltrosesp.ctipoproducto = 'not in(\'3\')'; 
    const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre',{}, this.mfiltrosesp);
    conTipoProducto.cantidad = 10;
    this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
    this.ejecutarConsultaCatalogos();
  }

  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReporteHistorialEntregasAF';

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
    if(this.mfiltros.ctipoproducto === undefined ||this.mfiltros.ctipoproducto === null) 
    {
      this.mfiltros.ctipoproducto = -1;
    }
    
    // Agregar parametros
    this.mfiltros.ubicacion;
    this.jasper.parametros['@i_fecha_ini'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_fecha_fin'] = this.mfiltros.ffin; 
    this.jasper.parametros['@i_tipoproducto'] = this.mfiltros.ctipoproducto;   
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfHistorialEntregasAF';
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

    /**Muestra lov de proveedores */
    mostrarLovProveedores(): void {
      this.lovProveedores.showDialog();
    }
  
    /**Retorno de lov de proveedores. */
    fijarLovProveedoresSelect(reg: any): void {
      if (reg.registro !== undefined) {
        this.mcampos.cpersona = reg.registro.cpersona;
        this.mcampos.npersona = reg.registro.nombre;
      }
    }


}
