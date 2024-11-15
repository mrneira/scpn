import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';
import {AppService} from 'app/util/servicios/app.service';

@Component({
  selector: 'app-aprobacion-presupuestaria',
  templateUrl: 'aprobacionpresupuestaria.html'
})
export class AprobacionPresupuestariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  public lempresatotal: any[];

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'tconcomprobante', 'COMPROBANTES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    if (this.route === null ) return;
    this.consultarCatalogos();

    this.route['queryParams'].subscribe((p: any) => {
      if (p.buzon) {
        const buzon = JSON.parse(p.buzon);
        this.mfiltros.cmodulo = buzon.cmodulo;
        this.consultar();
      }
    });    
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
1  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }


  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.ruteopresupuesto = true;
    this.mfiltros.aprobadopresupuesto = false;
    this.mfiltros.anulado = false;
    this.mfiltros.eliminado = false;
    this.mfiltrosesp.ccomprobante = 'NOT IN (SELECT ccomprobanteanulacion	 FROM tconcomprobante WHERE ccomprobanteanulacion IS not null)';
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconconcepto', 'nombre', 'nconcepto', 'i.cconcepto = t.cconcepto');
    consulta.addSubqueryPorSentencia(`case t.tipopersona when 'PE' then (select nombre from tperpersonadetalle d where d.cpersona = t.cpersonarecibido and d.verreg=0 and d.ccompania = 1)` +
    `when 'PR' then (select nombre from tperproveedor p where p.cpersona = t.cpersonarecibido ) ` +
    `when 'CL' then (select nombre from tperproveedor p where p.cpersona = t.cpersonarecibido ) ` +
    `end `, 'nbeneficiario');
    // consulta.addSubquery('tperproveedor', 'nombre', 'nbeneficiario', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');    
    // consulta.addSubquery('tperpersonadetalle', 'nombre', 'nbeneficiario', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }


  public fijarFiltrosConsulta() {
  }

  cambiarModulo(){
    this.consultar();
  }

  IrAComprobanteContable(reg: any){
    const opciones = {};
    const tran = 22 ;
    opciones['path'] = sessionStorage.getItem('m') + '-'+ tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-'+ tran + ' Acciones';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {skipLocationChange: true, 
                                              queryParams: {comprobante: JSON.stringify({ccomprobante: reg.ccomprobante,
                                                                                        fcontable: reg.fcontable,
                                                                                        particion: reg.particion,
                                                                                        ccompania: reg.ccompania,
                                                                                        tipopersona: reg.tipopersona,
                                                                                        cmodulo: this.mfiltros.cmodulo })}});
    this.appService.titulopagina = opciones['tit'];
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', { activo:true,negocio:true }, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }

  consultarComentario(reg:any){
    this.mcampos.comentario =reg.comentario;
    this.comportamiento=true;
  } 
  

}
