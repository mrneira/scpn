import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';


import { MenuItem } from 'primeng/components/common/menuitem';
import { runInThisContext } from 'vm';
@Component({
  selector: 'app-mantenimientoActivos',
  templateUrl: 'buzonprestaciones.html'
})
export class BuzonprestacionesComponent extends BaseComponent implements OnInit {

  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ttestransaccion', 'datoscca', false);
    this.componentehijo = this;
    //console.log("CCA mantenimientoActivos constructor")
  }

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  private tranpagina;
  private opcionespagina = 'false';

  private  contador =0;
 
  ngOnInit() {
    const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
    //console.log("CCA prueba mradicacion "+JSON.stringify(mradicacion))
    //console.log("CCA prueba mradicacion cpersona "+JSON.stringify(mradicacion.cp))

    this.mfiltros.cusuarioing = "ECATOTAY";
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 1;
    this.mfiltros.esmanual = true;
    this.consultar();
    //this.mfiltros = [];
    this.contador =0;
    
    
  }
 
  /*mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  metodoPruebacca(){
    console.log("Ingresa metodo")
  }*/

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
    this.contador = 0;
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 100;
    //consulta.addSubquery('tperpersonadetalle', 'identificacion', 'nidentificacion', 'i.cpersona = t.cpersona');
    //consulta.addSubqueryPorSentencia('select cpersona, fingreso, fmodificacion from tperpersonadetalle p where p.cpersona = t.cpersona', 'tpersona');
    //console.log("CCA this.entityBean "+ JSON.stringify(this.entityBean))
    //console.log("CCA this.mfiltros "+ JSON.stringify(this.mfiltros))
    //console.log("CCA this.mfiltrosesp "+ JSON.stringify(this.mfiltrosesp))
    //console.log("CCA mantenimientoActivos crearDtoConsulta" +sessionStorage.getItem('c'))
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.tranpagina = sessionStorage.getItem('t');
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    //console.log("CCA contador a"+this.contador)
    if(this.contador == 0){
      super.postQueryEntityBean(resp);
      this.contador ++;
      //console.log("CCA contador ++"+this.contador)
    }
    //console.log("CCA respuesta final "+JSON.stringify(resp))
    //console.log("CCA respuesta tamaño "+(resp.datoscca).length)
    
  }

  /*PRUEBAS CARGAS DE NUEVAS PAGINAS*/

  /*public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 2;
    this.titulo = '40-1 Prueba Transaccion Cca 1';
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    console.log("CCA opciones['path'] "+opciones['path'])
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = this.opcionespagina;
    opciones['del'] = this.opcionespagina;
    opciones['upd'] = this.opcionespagina;

    console.log("CCA this.titulo "+this.titulo)

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          cpersona: reg.cpersona, tran: this.tranpagina, tit: this.titulo
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
															   
  }*/

  /*public obtenerDatos(reg: any){
    console.log("CCA ingresa obtener datos "+ JSON.stringify(reg));
    this.mfiltros = [];
    this.mfiltros.cusuarioing = "CCABASCANGOV";
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 1;
    this.consultar1();
    this.mfiltros = [];
  }*/

  /*consultar1() {
    this.crearDtoConsulta1();
    super.consultar();
  }*/

  /*public crearDtoConsulta1(): Consulta {
    //this.fijarFiltrosConsulta();
    const consulta = new Consulta('tacfproductocodificado', 'Y', 't.cusuarioasignado', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 100;
    //consulta.addSubquery('tperpersonadetalle', 'identificacion', 'nidentificacion', 'i.cpersona = t.cpersona');
    //consulta.addSubqueryPorSentencia('select cpersona, fingreso, fmodificacion from tperpersonadetalle p where p.cpersona = t.cpersona', 'tpersona');
    console.log("CCA this.entityBean "+ JSON.stringify(this.entityBean))
    console.log("CCA this.mfiltros "+ JSON.stringify(this.mfiltros))
    console.log("CCA this.mfiltrosesp "+ JSON.stringify(this.mfiltrosesp))
    console.log("CCA mantenimientoActivos crearDtoConsulta" +sessionStorage.getItem('c'))
    this.addConsulta(consulta);
    return consulta;
  }*/
  
  IrAComprobanteContable(reg: any){
    const opciones = {};
    const tran = 99 ;
    opciones['path'] = 10 + '-'+ 99;
    opciones['tit'] = 10 + '-'+ 99 + ' Transacción Prestaciones';
    opciones['mod'] = 10;
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

    this.router.navigate([opciones['path']]);
    this.appService.titulopagina = opciones['tit'];
  }

}
