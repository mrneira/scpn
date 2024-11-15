import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { JasperComponent } from "app/util/componentes/jasper/componentes/jasper.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";
import { SelectItem, ConfirmationService } from "primeng/primeng";


@Component({
  selector: 'app-tth-anticiposbuzontes',
  templateUrl: 'anticiposbuzontes.html'
})
export class AnticiposbuzontesComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;



  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  private lGarante: SelectItem[] = [{ label: '...', value: null }];
 // private lEstados: SelectItem[] = [{ label: '...', value: null },{ label: 'INGRESADA', value: 'ING' },{ label: 'APROBADA', value: 'APR' },{ label: 'NEGADA', value: 'NEG' }];

  private lEstados: SelectItem[] = [{ label: 'INGRESADA', value: 'ING' },{ label: 'APROBADA', value: 'APR' },{ label: 'NEGADA', value: 'NEG' }];

  private lCapacidadEndeudamiento: any = [];
  private lTablaCuota: any = [];
  
  private lSolicitudAnticipo: any = [];
  private bolcapacidadendeudamiento: boolean = false;
  private bolPermanencia: boolean = true;
  private totalEndeudamiento: Number = 0;
  private totalCuotas: number = 0;
  private jsonCuotas: any;
  private crearSolicitud: boolean = true;
  private mostrarDialogoSolicitud: boolean = false;
   private cantsolicitud: number = 0;
   private antfecha: any;
   private antfproceso: any;
   private antestado: any;
   private antplazo: any;
   private antmontosolicitado: any;
   private anttipodescuento: any;
   private antmensaje: any;
   private antcomentario: any;
   private cfuncionario: any;
   private nfuncionario: any;
   private documento: any;
   private ccargo: any;
   private ncargo: any;
   private cgrupo: any;
   private ngrupo: any;
   private ctiporelacionlaboral: any;
   private ntiporelacionlaboral: any;
   private fvinculacion: any;
   private tiempovinculacion: any;
   private remuneracion: any;
   private montomaximo: any;
   private garfuncionario: any;
   private garnfuncionario: any;
   private ccargogarante: any;
   private ncargogarante: any;
   private ctiporelacionlaboralgarante: any;
   private ntiporelacionlaboralgarante: any;
   private cgrupogarante: any;
   private ngrupogarante: any;
   private fvinculaciongarante: any;
   private tiempovinculaciongarante: any;
   private remuneraciongarante: any;

   private tablacuota: any = [];

   selectedvalue: string = "";
   public totalRegistros: number = 0;
    

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tthcontratodetalle', 'CONTRATOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.consultarSolicitud();
  }


  ngAfterViewInit() {
  }
  
  consultarSolicitud() {
    this.rqConsulta = [];
    this.lSolicitudAnticipo
    this.rqConsulta.CODIGOCONSULTA = 'ANTICIPOS_LISTA_TESORERIA';
    this.rqConsulta.storeprocedure = "sp_AntListaTesoreria";
    this.rqConsulta.parametro_antestado = "APR";
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {    
        this.lSolicitudAnticipo = resp.ANTICIPOS_LISTA_TESORERIA;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  filtrarListaEstado()
  {
  //   if(this.mcampos.estado != undefined && this.mcampos.estado != null)
  //  {
        const result = this.lSolicitudAnticipo.filter((obj) => {
          return obj.antestado === this.mcampos.estado;
        });

        this.lSolicitudAnticipo = result;
  //  }
   }

   cargaListaCapacidadEndeudamiento(resp: any) {
    this.lCapacidadEndeudamiento = [];
    this.totalEndeudamiento = 0;

      let lEndeudamiento = JSON.parse(resp);
      for (let i in lEndeudamiento) {
          let reg = lEndeudamiento[i];         
          this.lCapacidadEndeudamiento.push({ nombredescuento: reg.nombredescuento, valor: reg.valor });          
          this.totalEndeudamiento += reg.valor;
      }
  } 

  verDialogoSolicitud(reg){
    this.mostrarDialogoSolicitud = true;
    this.cantsolicitud = reg.cantsolicitud;
    this.antfecha = reg.antfecha;
    this.antfproceso = reg.antfproceso;
    this.antestado = reg.antestado == "APR" ? "APROBADA" : reg.antestado;
    this.antplazo = reg.antplazo;
    this.antmontosolicitado = reg.antmontosolicitado;
    this.anttipodescuento = reg.anttipodescuento;
    this.antmensaje = reg.antmensaje;
  //  this.antcomentario = reg.antcomentario;
    this.cfuncionario = reg.cfuncionario;
    this.nfuncionario = reg.nfuncionario;
    this.documento = reg.documento;
    this.ccargo = reg.ccargo;
    this.ncargo = reg.ncargo;
    this.cgrupo = reg.cgrupo;
    this.ngrupo = reg.ngrupo;
    this.ctiporelacionlaboral = reg.ctiporelacionlaboral;
    this.ntiporelacionlaboral = reg.ntiporelacionlaboral;
    this.fvinculacion = reg.fvinculacion;
    this.tiempovinculacion = reg.tiempovinculacion;
    this.remuneracion = reg.remuneracion;
    this.montomaximo = reg.montomaximo;    
    this.garfuncionario = reg.garfuncionario;
    this.garnfuncionario = reg.garnfuncionario;
    this.ccargogarante = reg.ccargogarante;
    this.ncargogarante = reg.ncargogarante;
    this.ctiporelacionlaboralgarante = reg.ctiporelacionlaboralgarante;
    this.ntiporelacionlaboralgarante = reg.ntiporelacionlaboralgarante;
    this.cgrupogarante = reg.cgrupogarante;
    this.ngrupogarante = reg.ngrupogarante;
    this.fvinculaciongarante = reg.fvinculaciongarante;
    this.tiempovinculaciongarante = reg.tiempovinculaciongarante;
    this.remuneraciongarante = reg.remuneraciongarante;
    this.cargaListaCapacidadEndeudamiento(reg.endeudamientodetalle);
    this.lTablaCuota = JSON.parse(reg.tablacuota);
  }

  cerrarDialogoSolicitud()
  {
    this.mostrarDialogoSolicitud = false;
  }

  recargarSolicitud(){
    this.lSolicitudAnticipo = [];
    this.mcampos.finicio = null;
    this.mcampos.ffin = null;
    this.mcampos.estado = null;
    this.totalRegistros = 0;
  }


  guardarDialogoSolicitud(){
    this.rqConsulta = [];
   this.mostrarDialogoSolicitud = false;
   let respuesta = this.selectedvalue === 'DES' ? 'DESEMBOLSO' : 'NEGADA';
   const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
   this.rqConsulta.CODIGOCONSULTA = 'ANTICIPOS_DESEMBOLSO';
   this.rqConsulta.storeprocedure = "sp_AntFinalizar";
   this.rqConsulta.parametro_cantsolicitud = this.cantsolicitud;
   this.rqConsulta.parametro_antestado = this.selectedvalue;
   this.rqConsulta.parametro_antcomentario = this.antcomentario; 
   this.rqConsulta.parametro_cusuariomod = mradicacion.cu;   
   this.msgs = [];

   this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
           .subscribe(
           resp => {      
            
              console.log(resp);

              if (resp.cod === 'OK') {    
                 if(resp.ANTICIPOS_DESEMBOLSO[0].respuesta == "ERROR")
                   this.dtoServicios.manejoError("LA SOLICITUD N°. " + this.cantsolicitud + " NO HA PODIDO SER PROCESADA CORRECTAMENTE");
                 else {
                   if(resp.ANTICIPOS_DESEMBOLSO[0].comprobanteIngresado != "0"){
                      this.generaDocumentoAnticipo_3(resp.ANTICIPOS_DESEMBOLSO[0].comprobanteIngresado, "pdf");  
                    }
                  super.mostrarMensajeSuccess(resp.ANTICIPOS_DESEMBOLSO[0].respuesta); 
                   this.consultarSolicitud();            
                 }
             } 
           },
           error => {
             this.dtoServicios.manejoError(error);
           }); 
 }

 generaDocumentoAnticipo_3(idComprobante: any, resp: any): void {
  this.jasper.nombreArchivo = 'REPORTE';
  this.jasper.parametros['@i_ccomprobante'] = idComprobante;
  this.jasper.formatoexportar = resp;
  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContableDiario';
  this.jasper.generaReporteCore(); 
}



/*   generaDocumentoAnticipo_1(idAnticipo: any, resp: any): void {
    this.jasper.nombreArchivo = 'AnticipoFormulario';
    this.jasper.parametros['@cantsolicitud'] = idAnticipo;
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptAutorizacionSolicitante';
    this.jasper.generaReporteCore();
  }
  
  generaDocumentoAnticipo_2(idAnticipo: any, resp: any): void {
    this.jasper.nombreArchivo = 'AnticipoAutorizacion';
    this.jasper.parametros['@cantsolicitud'] = idAnticipo;
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptFormularioAnticipos';
    this.jasper.generaReporteCore(); 
  } */


/*   ImprimirSolicitud(reg){
    this.generaDocumentoAnticipo_1(reg.cantsolicitud, "pdf");
    this.generaDocumentoAnticipo_2(reg.cantsolicitud, "pdf");
  } */

}