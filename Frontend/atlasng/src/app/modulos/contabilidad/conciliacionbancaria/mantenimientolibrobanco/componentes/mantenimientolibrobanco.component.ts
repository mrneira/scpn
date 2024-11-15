import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { ConfirmationService, SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { Console } from 'console';

@Component({
  selector: 'app-mantenimientolibrobanco',
  templateUrl: 'mantenimientolibrobanco.html'
})
export class MantenimientolibrobancoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public lestadoconciliacion: SelectItem[] = [{ label: '...', value: null }];
  private lSolicitudAnticipo: any = [];
  fecha = new Date();
  public lcuentasbancarias: any[];
  public totalCredito: number = 0;
  public totalDebito: number = 0;
  totalRegistros: number  =0 ;
  archivoCargado = 0;
  private mostrarDialogoSolicitud: boolean = false;
  lOperacion: any = [];

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tconlibrobancos', 'CUENTABANCO', false, false);
    this.componentehijo = this;
  }
  //RRO 20230130
  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fechainicial = new Date(
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
      ),
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)
      ) - 1,
      1
    );
    this.mcampos.fechafinal = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }


  verDialogoSolicitud(){
    if (this.estaVacio(this.mcampos.ncuenta)) {
      this.mostrarMensajeError("DEBE SELECCIONAR UNA CUENTA CONTABLE");
      return;
    }

    this.mostrarDialogoSolicitud = true;
  }

  cerrarDialogoSolicitud()
  {
    this.mostrarDialogoSolicitud = false;
  }


  crearNuevo() {
  }

  actualizar() {

    if (this.registro.montocredito != 0 && this.registro.montodebito != 0) {
      this.mostrarMensajeError("EXTRACTO NO PUEDE CONTENER VALOR DE CRÉDITO Y DÉBITO A LA VEZ.");
    }
    if (this.registro.montocredito === 0 && this.registro.montodebito === 0) {
      this.mostrarMensajeError("EXTRACTO DEBE TENER AL MENOS UN VALOR DE CRÉDITO O DÉBITO.");
    }
    super.actualizar();
    this.registrarEtiqueta(this.registro, this.lestadoconciliacion, "estadoconciliacioncdetalle", "ncatalogoestado");
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  consultar() {
    if (this.mcampos.ccuenta != undefined && this.mcampos.fechainicial != undefined && this.mcampos.fechafinal != undefined) {
      if (this.mcampos.fechafinal < this.mcampos.fechainicial) {
        this.mostrarMensajeError("LA FECHA FINAL DEBE SER IGUAL O MAYOR A LA FECHA INICIAL");
        return;
      }
      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.ajustelibro = false;
    this.mfiltros.conciliado = false;   
    let filteredElements=this.lcuentasbancarias.filter(element => element.ccuenta == this.mfiltros.cuentabanco);
    this.mfiltros.cuentabanco = filteredElements[0].ccuentabanco;
    let lfechainicial: number = (this.mcampos.fechainicial.getFullYear() * 10000) + ((this.mcampos.fechainicial.getMonth() + 1) * 100) + this.mcampos.fechainicial.getDate();
    let lfechafinal: number = (this.mcampos.fechafinal.getFullYear() * 10000) + ((this.mcampos.fechafinal.getMonth() + 1) * 100) + this.mcampos.fechafinal.getDate();
    this.mfiltrosesp.fcontable = 'between ' + lfechainicial + ' and ' + lfechafinal + ' ';    
    const consulta = new Consulta(this.entityBean, 'Y', 't.clibrobanco', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 10000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

/*
  grabar(): void {
    this.lmantenimiento = []; 
    this.crearDtoMantenimiento();
    super.grabar(); 
  }
*/

  grabar(): void {
    if(this.archivoCargado == 1)
    {
        this.confirmationService.confirm({
          message: 'Está seguro que desea actualizar los registros cargados?',
          header: 'Confirmación',
          accept: () => {
              let cont: number = 0;
              this.lSolicitudAnticipo.forEach(lb => {
                this.guardarCargaLibro(lb.clibrobanco, lb.documento);
              cont++;        
              });
      
            if(this.lSolicitudAnticipo.length == cont){
              this.totalRegistros = 0;
              this.totalCredito = 0;
              this.totalDebito = 0;
              this.lSolicitudAnticipo = [];
              this.archivoCargado = 0;
              this.mostrarMensajeSuccess("TRANSACCIÓN FINALIZADA CORRECTAMENTE");
            }
          }
        });
     }
    else
    {
        this.lmantenimiento = []; 
        this.crearDtoMantenimiento();
        super.grabar(); 
     }
  }

  guardarCargaLibro(clibrobanco: any, documento: any)
  {
    this.rqConsulta = [];
    this.mostrarDialogoGenerico = false;
    const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
    this.rqConsulta.CODIGOCONSULTA = 'LIBROBANCO_MODIFICA';
    this.rqConsulta.storeprocedure = "sp_LibroBancoCambiarDocumento";
    this.rqConsulta.parametro_clibrobanco = clibrobanco;
    this.rqConsulta.parametro_documento = documento; 
    this.rqConsulta.parametro_cusuariomod = mradicacion.cu;    
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
            resp => {       
               if (resp.cod === 'OK') {    
                 // this.consultarLibro();
              } 
            },
            error => {
              this.dtoServicios.manejoError(error);
            });  
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.msgs = [];
      this.mfiltros.cuentabanco = reg.registro.ccuenta
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();  
    const mfiltroscuenta: any = { ccuenta: this.mfiltros.ccuentabanco };
    const conDestino = new Consulta('tconbanco', 'Y', 't.ccuentabanco', mfiltroscuenta, {});
    conDestino.cantidad = 5;
    this.addConsultaCatalogos('CUENTASBANCARIAS', conDestino, this.lcuentasbancarias, this.llenarCuentasBancarias, '', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }

  public llenarCuentasBancarias(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lcuentasbancarias = pListaResp;
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestadoconciliacion, resp.ESTADOCONCILIACION, 'cdetalle');
    }
    this.lconsulta = [];
  }

  cerrarDialogoLibro ()
  {
    this.rqConsulta = [];
    this.mostrarDialogoGenerico = false;
  }

  guardarDialogoLibro(){
  this.rqConsulta = [];
   this.mostrarDialogoGenerico = false;
   const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
   this.rqConsulta.CODIGOCONSULTA = 'LIBROBANCO_MODIFICA';
   this.rqConsulta.storeprocedure = "sp_LibroBancoCambiarDocumento";
   this.rqConsulta.parametro_clibrobanco = this.registro.clibrobanco;
  // this.rqConsulta.parametro_ccomprobante = this.registro.ccomprobante;
   this.rqConsulta.parametro_documento = this.registro.documento; 
   this.rqConsulta.parametro_cusuariomod = mradicacion.cu;   
   this.msgs = [];

   this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
           .subscribe(
           resp => {       
              if (resp.cod === 'OK') {    
                 this.consultarLibro();
             } 
           },
           error => {
             this.dtoServicios.manejoError(error);
           });  
 }

 consultarLibro() {
  this.rqConsulta = [];
  let inicio: string = this.mcampos.fechainicial.toISOString().slice(0, 10);
  let fin: string = this.mcampos.fechafinal.toISOString().slice(0, 10);

  this.lSolicitudAnticipo = [];
  this.totalRegistros = 0;
  this.rqConsulta.CODIGOCONSULTA = 'LIBROBANCO_LISTA';
  this.rqConsulta.storeprocedure = "sp_LibroBancoLista";
  this.rqConsulta.parametro_cuentabanco = this.mcampos.ccuenta; // this.mfiltros.cuentabanco;
  this.rqConsulta.parametro_finicio = inicio.replace(/-/g,'');
  this.rqConsulta.parametro_ffin = fin.replace(/-/g,'');
  this.msgs = [];
  this.totalCredito = 0;
  this.totalDebito = 0;
  this.totalRegistros = 0;
  this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
    resp => {    
      this.lSolicitudAnticipo = resp.LIBROBANCO_LISTA;
      this.totalRegistros = this.lSolicitudAnticipo.length;
      this.lSolicitudAnticipo.forEach(li => {
        this.totalCredito += li.montocredito;
        this.totalDebito += li.montodebito;
      });            
    },
    error => {
      this.dtoServicios.manejoError(error);
    }); 
}

recargarLibro(){
  this.totalRegistros = 0;
  this.totalCredito = 0;
  this.totalDebito = 0;
  this.lSolicitudAnticipo = [];
  this.archivoCargado = 0;
}


uploadHandler(event) {
   if (this.estaVacio(this.mcampos.ncuenta)) {
    this.mostrarMensajeError("DEBE SELECCIONAR UNA CUENTA CONTABLE");
    return;
  }
 
  this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;
  this.rqMantenimiento.narchivo = event.files[0].name;
  this.lOperacion = [];
  this.rqMantenimiento.cargaarchivo = 'upload';
  this.getBase64(event);
}

getBase64(inputValue: any): void {
  var file: File = inputValue.files[0];
  var myReader: FileReader = new FileReader();
  myReader.onloadend = (e) => {
    this.propagateChange(myReader.result);
  }
  myReader.readAsDataURL(file);
}

propagateChange = (value: any) => {
  this.mostrarDialogoSolicitud = false;

  this.rqMantenimiento.archivo = value;
  const rqMan = this.getRequestMantenimiento();
  this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
    resp => {
      if (resp.cod === 'OK') {
        this.grabo = true;
      }
      this.encerarMensajes();
      this.respuestacore = resp;
      this.componentehijo.postCommit(resp);
      this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
      this.enproceso = false;
      this.lSolicitudAnticipo = resp.lregistros;
      this.totalCredito = 0;
      this.totalDebito = 0;
      this.totalRegistros = 0;
      this.lSolicitudAnticipo.forEach(li => {
        this.totalCredito += li.montocredito;
        this.totalDebito += li.montodebito;
      });

      this.totalRegistros = this.lSolicitudAnticipo.length;

      this.mostrarDialogoSolicitud = false;
      this.archivoCargado = resp.archivoCargado;
      this.mostrarMensajeInfo("DEBE GRABAR LOS REGISTROS");

    },
    error => {
      this.mostrarDialogoSolicitud = false;
      this.dtoServicios.manejoError(error);
      this.enproceso = false;
      this.grabo = false;
    }
  );
};

  public calcularTotalesMayor(lista: any) {
    this.totalCredito = 0;
    this.totalDebito = 0;
    this.totalRegistros = 0;
    
    lista.forEach(li => {
      this.totalCredito += li.montocredito;
      this.totalDebito += li.montodebito;
    });
    this.totalRegistros = lista.length;
  }

}
