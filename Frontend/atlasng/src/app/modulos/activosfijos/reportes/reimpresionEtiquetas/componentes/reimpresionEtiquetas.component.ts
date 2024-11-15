import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { LovCodificadosComponent } from '../../../lov/codificados/componentes/lov.codificados.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-reporte-reimpresionEtiquetas',
  templateUrl: 'reimpresionEtiquetas.html'
})
export class ReimpresionEtiquetasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCodificadosComponent)
  private lovcodificados: LovCodificadosComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'TACFTIPOPRODUCTO', false);
    this.componentehijo = this;
  }

  public cbarras = '';
  public indice: number;
  public codigo = '';
  private print = false;
  ngOnInit() {
    super.init(this.formFiltros);  

  }

  ngAfterViewInit() {
  }

  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }

  agregarFila() {
    super.crearnuevoRegistro();
    this.actualizar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }


  descargarReporte(): void {

    let listaCbarras : any = [];


    for (const i in this.lregistros) {
        const reg = this.lregistros[i];
          listaCbarras.push({"cbarras": reg.mdatos.cbarras,"datos": reg.mdatos.nproducto +' '+reg.mdatos.infoadicional+' '+reg.mdatos.comentario+' '+'RESPONSABLE:'+reg.mdatos.responsable});
    }


    this.jasper.nombreArchivo = 'ReimpresionEtiquetas';

    if(this.mfiltros.ctipoproducto === undefined ||this.mfiltros.ctipoproducto === null) 
    {
      this.mfiltros.ctipoproducto = -1;
    }
    
    // Agregar parametros
    this.jasper.parametros['@i_lcbarras'] = listaCbarras;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfReImpresionEtiquetas';
    this.jasper.generaReporteCore();
  }

  codigoFocus(reg: any, index: number) {
    this.indice = index;
    this.cbarras = reg.mdatos.cbarras;
  }

  codigoBlur(reg: any, index: number) {

    if (reg.mdatos.cbarras === '') {
      this.lregistros[index].mdatos.cbarras = undefined;
      this.lregistros[index].mdatos.nproducto = undefined;
      return;
    }

    if (reg.mdatos.cbarras === this.cbarras) {
      return;
    }

    const consulta = new Consulta('tacfproductocodificado', 'N', '', { 'cbarras': reg.mdatos.cbarras}, {});
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addFiltroCondicion('cbarras', reg.mdatos.cbarras, '=');
    this.addConsultaPorAlias('PRODUCTO', consulta);
  
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp, index);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any, index: number) {
    let producto;
    if (resp.PRODUCTO !== undefined && resp.PRODUCTO !== null) {
      producto = resp.PRODUCTO;
      this.lregistros[index].cproducto = producto.cproducto;
      this.lregistros[index].mdatos.nproducto = producto.mdatos.nproducto;
      this.lregistros[index].mdatos.serial = producto.serial;
      this.print = true;      
    }else{
      this.lregistros[index].cproducto = undefined;
      this.lregistros[index].mdatos.cbarras = undefined;
    }
  }

  mostrarlovcodificados(): void {
    this.lovcodificados.showDialog();
  }

  fijarLovCodificadosSelec(reg: any): void {
    this.registro.mdatos.nproducto = reg.registro.mdatos.nombre;
    this.registro.mdatos.cbarras = reg.registro.cbarras;
    this.registro.cproducto = reg.registro.cproducto;
    this.registro.mdatos.serial = reg.registro.serial;
    this.registro.mdatos.infoadicional = reg.registro.infoadicional;
    this.registro.mdatos.comentario = reg.registro.comentario;
    this.registro.mdatos.responsable = reg.registro.mdatos.Responsable;
    this.print = true;

  }

}
