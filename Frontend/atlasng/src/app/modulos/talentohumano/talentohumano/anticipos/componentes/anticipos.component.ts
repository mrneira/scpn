import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { JasperComponent } from "app/util/componentes/jasper/componentes/jasper.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";
import { SelectItem, ConfirmationService } from "primeng/primeng";


@Component({
  selector: 'app-tth-anticipos',
  templateUrl: 'anticipos.html'
})
export class AnticiposComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;

  public lGarante: SelectItem[] = [{ label: '...', value: null }];
  public lPlazo: SelectItem[] = [{ label: '...', value: null }];
  public lCapacidadEndeudamiento: any = [];
  public lTablaCuotas: any = [];
  public bolcapacidadendeudamiento: boolean = false;
  public bolPermanencia: boolean = true;
  public totalEndeudamiento: Number = 0;
  public totalCuotas: number = 0;
  public jsonCuotas: any;
  public crearSolicitud: boolean = true;
  private permiteSolicitud: boolean = true;
  private porcentajeMaximo: number = 0.4;
  private porcentajeDctoDiciembre: number = 0.7;
  private montoSugerido: Number = 0;
  private inactivoCuotas: boolean = true;   
  private numeroCuotaMax: boolean = false;
  private cuotamensualmax: number = 0;
  selectedvalue: string = "";
  vistaTipoCuota: boolean = false;
  public vistaImprimir = false;
  idSolicitudIngresada: any;
  public funcionalidadActiva: boolean = true;
  public vistacuota70: boolean = false;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tthcontratodetalle', 'CONTRATOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }


  ngAfterViewInit() {
    this.verAnticipoSolicitante(sessionStorage.getItem("cfuncionario"));
  //  this.verAnticipoSolicitante(26);
  }
  

  /**
   * Función presenta la información del usuario actual para la solicitud de anticipos
   * Fecha: 20220526
   * @param funcionario 
   */
  verAnticipoSolicitante(funcionario) {
    this.rqConsulta.CODIGOCONSULTA = 'ANTICIPOS_NUEVA_SOLICITUD';
    this.rqConsulta.storeprocedure = "sp_AntCargaDatosSolicitud";
    this.rqConsulta.parametro_cfuncionario = funcionario;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        let solicitud = resp.ANTICIPOS_NUEVA_SOLICITUD[0];               
        this.registro.fsolicitud = this.fechaactual; 
        this.registro.cfuncionario = solicitud.cfuncionario;
        this.registro.nfuncionario = solicitud.nfuncionario;
        this.registro.documento = solicitud.documento;
        this.registro.ctiporelacionlaboral = solicitud.ctiporelacionlaboral;
        this.registro.ntiporelacionlaboral = solicitud.ntiporelacionlaboral;
        
        // el tipo cuota 70% diciembre solo aparece para nombramiento fijo o contrato indefinido
        if(this.registro.ctiporelacionlaboral == 4 || this.registro.ctiporelacionlaboral == 6)
            this.vistacuota70 = true;
        else
            this.vistacuota70 = false;

        this.registro.fvinculacion = solicitud.fvinculacion;
        this.registro.fvinculacionYMD = solicitud.fvinculacion.toISOString().slice(0, 10);
        this.registro.tiempovinculacion = this.diferenciaFechasYYMMDD(solicitud.fvinculacion, this.fechaactual, true);
        this.registro.cgrupo = solicitud.cgrupo;
        this.registro.ngrupo = solicitud.ngrupo;         
        this.registro.remuneracion = solicitud.remuneracion;             
        this.registro.totalendeudamiento = solicitud.totalendeudamiento;

        this.cuotamensualmax = (this.registro.remuneracion - this.registro.totalendeudamiento) * this.porcentajeMaximo;

        this.registro.ccargo = solicitud.ccargo;
        this.registro.ncargo = solicitud.ncargo;          
        this.registro.antcomentario = solicitud.observacion;
        this.registro.respuesta = solicitud.respuesta;
        this.registro.endeudamientodetalle = solicitud.endeudamientodetalle;

        if(this.registro.respuesta != null){
          this.validarIdIngresada(this.registro.respuesta);
        }

        this.registro.estadoultimasolicitud = solicitud.estadoultimasolicitud;
        this.cargaListaCapacidadEndeudamiento(resp);
        this.permiteSolicitud = !solicitud.activo;

        // verifica si estan creados los parametros de inicio y fin para anticipos
        if(solicitud.respuesta == "LA FUNCIONALIDAD DE SOLICITUD DE ANTICIPOS SE ENCUENTRA DESACTIVADA. CONTÁCTESE CON EL DEPARTAMENTO DE TALENTO HUMANO PARA MAYOR INFORMACIÓN.")
        {
          this.permiteSolicitud = false;
          super.mostrarMensajeError(this.registro.respuesta); 
          return;
        }

        if (this.permiteSolicitud) {
            if(this.bolPermanencia){      
                if(solicitud.capacidadendeudamiento >= solicitud.porcentajeendeudamiento){
                    this.bolcapacidadendeudamiento = true;
                    this.registro.montomaximo = solicitud.montomaximo;   
                    this.cargaListaGarante(resp);                                                                        
                    var fechaHoy = new Date(this.fechaactual);
                    let limite: number = 12 - (fechaHoy.getMonth() + (fechaHoy.getDate() > 15 ? 1 : 0)) ; 

                    for (let index = 1; index <= limite; index++) {
                      this.lPlazo.push({ label: index.toString(), value: index });          
                    } 

                  /*   for (let index = 1; index <= 12; index++) {
                      this.lPlazo.push({ label: index.toString(), value: index });          
                    } 
 */
                    this.validarFechaProcesamientoSolicitud();    
                } 
                else{
                  this.bolcapacidadendeudamiento = false;
                  super.mostrarMensajeError("SOLICITUD DENEGADA, ACTUALMENTE SU CAPACIDAD DE ENDEUDAMIENTO SUPERA EL "+ solicitud.porcentajeendeudamiento +"% DE SU REMUNERACIÓN.");
                }
            } else {
              this.bolcapacidadendeudamiento = false;
              super.mostrarMensajeError("SOLICITUD DENEGADA, ACTUALMENTE NO CUMPLE CON EL TIEMPO MINÍMO (3 MESES) DE PERMANENCIA EN LA INSTITUCIÓN.");
            }
        }

      if(this.registro.respuesta != null){
        if(this.registro.estadoultimasolicitud == "NEGADA"){
          super.mostrarMensajeError(this.registro.respuesta); 
        } else {
          if(solicitud.tipomensaje == 1)
            super.mostrarMensajeError(this.registro.respuesta); 
          else if(solicitud.tipomensaje == 2)
            super.mostrarMensajeWarn(this.registro.respuesta); 
          else
            super.mostrarMensajeSuccess(this.registro.respuesta); 
        }
      } 
  
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  
/**
 * Función: Valida si el monto solicitado es <= al monto maximo
 * Fecha: 20220527 
 */
  validarMonto(){
    this.lTablaCuotas = [];
    this.registro.plazo = "";
    this.totalCuotas = 0;
    this.registro.anttipodescuento = false;
    if(this.registro.montosolicitado > this.registro.montomaximo){
      super.mostrarMensajeError("EL MONTO SOLICITADO NO PUEDE EXCEDER: " + this.registro.montomaximo + " USD");
      this.lTablaCuotas = [];
      this.registro.montosolicitado = "";    
      this.jsonCuotas = null; 
    }
}



  /**
   * Función: Valida si la solicitud se hizo pasado el dia 15 del mes y envia un mensaje de alerta
   * Fecha: 20220526
   */
  validarFechaProcesamientoSolicitud(){
    var fechaHoy = new Date(this.fechaactual);

    fechaHoy.setMonth(fechaHoy.getMonth() + 1);
    let mes = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fechaHoy);

    if(fechaHoy.getDate() >= 15)
    {
      super.mostrarMensajeInfo("AVISO, SI REALIZA SU SOLICITUD PASADO EL DÍA 15 DEL MES EN CURSO, SERÁ PROCESADA CON LA NÓMINA DEL MES DE " + mes.toUpperCase() + ".");
    }
  }

  /**
   * Función: Carga la lista de garantes con el mismo grupo ocupacional (Ej. SERVIDOR PÚBLICO 7)
   * Fecha: 20220526
   * @param resp 
   */
  cargaListaGarante(resp: any) {
    this.lregistros = [];
    
    if (resp.cod === 'OK') {
      this.lregistros = JSON.parse(resp.ANTICIPOS_NUEVA_SOLICITUD[0].garante);
      for (let i in this.lregistros) {
          let reg = this.lregistros[i];
          if(this.registro.cfuncionario != reg.cfuncionario && reg.capacidadendeudamientogar >= 40){
            this.lGarante.push({ label: reg.nfuncionario, value: reg.cfuncionario });
          }
      }
    }
  }

  /**
   * Función: Carga la lista de las deudas que mantiene el usuario
   * Fecha: 20220526
   * @param resp 
   */
  cargaListaCapacidadEndeudamiento(resp: any) {
    this.totalEndeudamiento = 0;
    if (resp.cod === 'OK') {
      let lEndeudamiento = JSON.parse(resp.ANTICIPOS_NUEVA_SOLICITUD[0].endeudamientodetalle);
      for (let i in lEndeudamiento) {
          let reg = lEndeudamiento[i];         
          this.lCapacidadEndeudamiento.push({ nombredescuento: reg.nombredescuento, valor: reg.valor });          
          this.totalEndeudamiento += reg.valor;
      }
    }
  }

  /**
   * Función: Detalle garante
   * Fecha: 20220525
   * @param idGarante 
   */
  consultarInfoGarante(idGarante)
  {
    this.registro.cfuncionariogarante = null;
    this.registro.nfuncionariogarante = null;
    this.registro.ctiporelacionlaboralgarante = null;
    this.registro.ntiporelacionlaboralgarante = null;
    this.registro.fvinculaciongarante = null;
    this.registro.tiempovinculaciongarante = null;
    this.registro.cgrupogarante = null;
    this.registro.ngrupogarante = null;
    this.registro.remuneraciongarante = null;                
    this.registro.ccargogarante = null;
    this.registro.ncargogarante = null;
    this.registro.anttipodescuento = false;
    this.jsonCuotas = null;

    if(idGarante != null)
    {
        for (let i in this.lregistros) {
            let reg = this.lregistros[i];
            if(reg.cfuncionario == idGarante){
              this.registro.cfuncionariogarante = reg.cfuncionario;
              this.registro.nfuncionariogarante = reg.nfuncionario;
              this.registro.ctiporelacionlaboralgarante = reg.ctiporelacionlaboral;
              this.registro.ntiporelacionlaboralgarante = reg.ntiporelacionlaboral;
              this.registro.fvinculaciongarante = reg.fvinculacion;
              this.registro.fvinculaciongaranteYMD = (new Date(reg.fvinculacion)).toISOString().slice(0, 10);

              this.registro.tiempovinculaciongarante = this.diferenciaFechasYYMMDD(reg.fvinculacion, this.fechaactual);
              this.registro.cgrupogarante = reg.cgrupo;
              this.registro.ngrupogarante = reg.ngrupo;
              this.registro.remuneraciongarante = reg.remuneracion;                 
              this.registro.ccargogarante = reg.ccargo;
              this.registro.ncargogarante = reg.ncargo;      
            }
        }
      }
  }
 
/**
 * Función: Genera la tabla de pagos
 * Fecha: 20220726
 * @param cuota 
 */
calcularCuotas(cuota){
  this.totalCuotas = 0;
  this.lTablaCuotas = [];
  let lTablaCuotasTmp: any = [];  
 
  if(this.registro.montosolicitado != "" && this.registro.montosolicitado != null && this.registro.montosolicitado != 0)
  {
      const mes = ["","Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      var fechaHoy = new Date(this.fechaactual);
      let limite = fechaHoy.getMonth() + 1 + cuota;
      let recaudacion: number = this.registro.montosolicitado / cuota;     
      recaudacion = Number(recaudacion.toFixed(2));
      for (let i = (fechaHoy.getMonth() + 1); i < limite; i++) {    
          if(fechaHoy.getDate() > 15 && i == (fechaHoy.getMonth() + 1)){
            i = i +1;
          }

          lTablaCuotasTmp.push({mescuota: mes[i], valorcuota: recaudacion });

          if(fechaHoy.getDate() > 15 && i == limite - 1 ){
            lTablaCuotasTmp.push({mescuota: mes[i+1], valorcuota: recaudacion });
          }
      }

      let contador = 1;
      let totalTmp: number = 0;
      for (let k = 0; k < lTablaCuotasTmp.length; k++) {
        totalTmp += lTablaCuotasTmp[k].valorcuota;
      }

      let capitalreducido:number = 0;
      if(this.selectedvalue == "1")//(!this.registro.anttipodescuento)
      {                 
          for (let j = 0; j < lTablaCuotasTmp.length; j++) {
            let valorCuotaTmp: number = Number(lTablaCuotasTmp[j].valorcuota.toFixed(2));

            if(j == lTablaCuotasTmp.length - 1){
              valorCuotaTmp = Number((lTablaCuotasTmp[j].valorcuota + this.registro.montosolicitado - totalTmp).toFixed(2));
              this.totalCuotas += lTablaCuotasTmp[j].valorcuota + this.registro.montosolicitado - totalTmp;
            }
            else {
              this.totalCuotas += lTablaCuotasTmp[j].valorcuota;  
            }

            capitalreducido =  capitalreducido + valorCuotaTmp;
            this.lTablaCuotas.push({idcuota: contador, 
                                    mescuota: lTablaCuotasTmp[j].mescuota, 
                                    valorcuota: valorCuotaTmp, 
                                    capitalreducido: Number(this.registro.montosolicitado - capitalreducido).toFixed(2),
                                    finicio: this.verPrimerUltimoDiaMes(lTablaCuotasTmp[j].mescuota, false),
                                    fvencimiento: this.verPrimerUltimoDiaMes(lTablaCuotasTmp[j].mescuota, true),
                                    cestatus: 'VIG' });   
            contador++;     
          }

          this.jsonCuotas =  JSON.stringify(this.lTablaCuotas);

      } else {
        if(lTablaCuotasTmp[lTablaCuotasTmp.length - 1].mescuota == 'Diciembre'){
          let cuotas70: number =  (this.registro.remuneracion - this.registro.totalendeudamiento) * this.porcentajeDctoDiciembre;
          cuotas70 = Number(cuotas70.toFixed(2));
         
          for (let j = 0; j < lTablaCuotasTmp.length; j++) {
            capitalreducido =  capitalreducido + (j== lTablaCuotasTmp.length - 1 ? Number(cuotas70.toFixed(2)) : Number(((this.registro.montosolicitado - cuotas70)/(lTablaCuotasTmp.length - 1)).toFixed(2)));

            this.lTablaCuotas.push({idcuota: contador, 
                                    mescuota: lTablaCuotasTmp[j].mescuota + (j== lTablaCuotasTmp.length - 1 ? " (70%)" : ""), 
                                    valorcuota: (j== lTablaCuotasTmp.length - 1 ? Number((cuotas70 + this.registro.montosolicitado - capitalreducido).toFixed(2))  : Number(((this.registro.montosolicitado - cuotas70)/(lTablaCuotasTmp.length - 1)).toFixed(2))), 
                                    capitalreducido: (j== lTablaCuotasTmp.length - 1 ?  0 : Number(this.registro.montosolicitado - capitalreducido).toFixed(2)),
                                    finicio: this.verPrimerUltimoDiaMes(lTablaCuotasTmp[j].mescuota, false),
                                    fvencimiento: this.verPrimerUltimoDiaMes(lTablaCuotasTmp[j].mescuota, true),
                                    cestatus: 'VIG' });   

             if(j== lTablaCuotasTmp.length - 1)
               this.totalCuotas += this.registro.montosolicitado - this.totalCuotas;
            else
              this.totalCuotas += cuotas70; 

            contador++;     
          }

         this.jsonCuotas =  JSON.stringify(this.lTablaCuotas);          
        }
        else {
          this.registro.anttipodescuento = false;                
          this.jsonCuotas = null;
       //   this.registro.plazo = "";
          super.mostrarMensajeError("ERROR, PARA ESTE TIPO DE DESCUENTO, LA ÚLTIMA CUOTA DEBERÁ SER EN EL MES DE DICIEMBRE");
        }
      }
     }
    else
    {
      this.jsonCuotas = null;
    //  this.registro.plazo = "";
      super.mostrarMensajeError("INGRESE MANUALMENTE EL MONTO SOLICITADO. EL VALOR NO PUEDE EXCEDER: " + this.montoSugerido.toFixed(2) + " USD");
    }
}

seleccionarCuota(tipo){
  this.vistaTipoCuota = true;

  this.inactivoCuotas = true;
  this.lTablaCuotas = [];
  this.registro.montosolicitado = "";    
  this.jsonCuotas = null; 
  this.montoSugerido = null;

  this.registro.plazo = "";

  if(tipo == 1)
    this.registro.anttipodescuento = false; 
  else
    this.registro.anttipodescuento = true; 
 }

/**
 * Función: Calcula el monto maximo sugerido
 * Fecha: 20220726
 * @param cuota 
 */
calcularMontoSugerido(cuota, tipoCuota: any){
  this.inactivoCuotas = true;
  this.lTablaCuotas = [];
  this.registro.montosolicitado = "";    
  this.jsonCuotas = null; 
  this.montoSugerido = null;
  this.encerarMensajes();
  if(tipoCuota == 2 )
  {
      const fecha = new Date();
      const mesActual = fecha.getMonth() + 1; 
      const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];   


      console.log("mesActual",mesActual);
      console.log("cuota",cuota);
      console.log("mes.length",mes.length);

      var fechaHoy = new Date(this.fechaactual);
      fechaHoy.setMonth(fechaHoy.getMonth() + 1);
      let valida: any;
      if(fechaHoy.getDate() >= 15)
      {
        valida = mesActual + cuota;
      } else {
        valida = mesActual + cuota - 1;
      }
  
      //if(mesActual + cuota - 1 == mes.length )
      if(valida  == mes.length )
          this.montoSugerido = this.calcularMontoSugerido70(cuota);
      else
      {
        this.inactivoCuotas = true;
        this.lTablaCuotas = [];
        this.registro.montosolicitado = "";    
        this.jsonCuotas = null; 
        this.montoSugerido = null;  
        this.registro.plazo = "";   
        super.mostrarMensajeError("NO HA SELECCIONADO EL MÁXIMO NÚMERO DE CUOTAS PARA ESTE TIPO DE CUOTA....");
      }
  }
  else
  {
      let montoMaxPorCuota: number  = cuota * ((this.registro.remuneracion - this.registro.totalendeudamiento) * this.porcentajeMaximo);
      if(montoMaxPorCuota > this.registro.montomaximo)        
        this.montoSugerido = this.registro.montomaximo;
      else
        this.montoSugerido = montoMaxPorCuota;    
  }


/*   if(montoMaxPorCuota > this.registro.montomaximo)  {       
    this.montoSugerido = this.registro.montomaximo;
   } else {
    this.montoSugerido = montoMaxPorCuota;
   } */

   if(cuota == (this.lPlazo.length - 1)){
      this.numeroCuotaMax = true;      
   }
    else{
      this.numeroCuotaMax = false;
      this.registro.anttipodescuento = false;
    }
}


calcularMontoSugerido70(cuota): number{
  this.inactivoCuotas = true;
  this.lTablaCuotas = [];
  this.registro.montosolicitado = "";    
  this.jsonCuotas = null; 
  this.montoSugerido = null;
  let cuota70: number  = ((this.registro.remuneracion - this.registro.totalendeudamiento) * this.porcentajeDctoDiciembre);
  let cuotaMax: number  = ((this.registro.remuneracion - this.registro.totalendeudamiento) * this.porcentajeMaximo);
  let sumMontoCalculado: number = 0;
  sumMontoCalculado = (cuotaMax * (cuota - 1)) + cuota70;
  let maximoMonto: number = sumMontoCalculado;
  if(sumMontoCalculado > this.registro.montomaximo)
  {
    maximoMonto = this.registro.montomaximo;
  } 
  sumMontoCalculado = 0;
  sumMontoCalculado = (maximoMonto - cuota70) / (cuota - 1);
  return (sumMontoCalculado * (cuota - 1)) + cuota70;
}

/**
 * Función: Valida el monto solicitado
 * Fecha: 20220726
 */
validarMontoSolicitado(){
  this.encerarMensajes();
  this.inactivoCuotas = false;

  if(this.montoSugerido == null){
    super.mostrarMensajeError("NO HA SELECCIONADO EL MÁXIMO NÚMERO DE CUOTAS PARA ESTE TIPO DE CUOTA");
    return;
  }

  if(this.registro.montosolicitado > this.montoSugerido.toFixed(2) ){
      super.mostrarMensajeError("DEBIDO A SU CAPACIDAD DE PAGO, EL MONTO MÁXIMO ES: " + this.montoSugerido.toFixed(2)  + " USD, PARA "  + this.registro.plazo + (this.registro.plazo == 1 ? " CUOTA" : " CUOTAS")  );
      this.lTablaCuotas = [];
      this.registro.montosolicitado = "";    
      this.jsonCuotas = null;      
      this.inactivoCuotas = true;   
  }
  else 
  { 
    if(this.registro.plazo > 2)
    {
        if (this.registro.montosolicitado > 0 && this.registro.montosolicitado <= this.registro.remuneracion)
        {
          super.mostrarMensajeError("SI EL MONTO SOLICITADO ES MENOR O IGUAL A 1 REMUNERACIÓN, LA CANTIDAD MÁXIMA DE CUOTAS ES: 2");
          this.lTablaCuotas = [];
          this.registro.montosolicitado = "";    
          this.jsonCuotas = null;      
          this.inactivoCuotas = true;   
        }
    } else {
      if (this.registro.montosolicitado > this.montoSugerido.toFixed(2) )
      {
        super.mostrarMensajeError("DEBIDO A SU CAPACIDAD DE PAGO, EL MONTO MÁXIMO ES: " + this.montoSugerido.toFixed(2) + " USD, PARA "  + this.registro.plazo + (this.registro.plazo == 1 ? " CUOTA" : " CUOTAS")  );
        this.lTablaCuotas = [];
        this.registro.montosolicitado = "";    
        this.jsonCuotas = null;      
        this.inactivoCuotas = true;   
      }
    }
  }
}




/**
 * Función: Validar el tipo de dcto. 
 * Fecha: 20220603
 */
validarTipoDcto(){
  if(this.registro.plazo > 0)
    this.calcularCuotas(this.registro.plazo);
  else
    super.mostrarMensajeError("SELECCIONE EL PLAZO");
}

/**
 * Función: Crear nueva solicitud de anticipos
 * Fecha: 20220603
 */
grabarSolicitud(){
  if(this.jsonCuotas == null) {
    this.totalCuotas = 0;
    this.registro.plazo = "";
    this.registro.montosolicitado = null;      
    this.registro.anttipodescuento = false; 
    super.mostrarMensajeError("NO SE HA GENERADO LA TABLA DE CUOTAS, VERIFIQUE QUE SE HAYA INGRESADO EL MONTO MANUALMENTE Y SE HAYA SELECCIONADO EL PLAZO");
  }
  else {
    this.confirmationService.confirm({
      message: 'Los datos de la solicitud estan correctos?',
      header: 'Confirmación',
      accept: () => {
          const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
      
          let anticiposolicitud: string ='[{ "antestado": "'+ 'ING' +
                                                '","antplazo": "'+ this.registro.plazo + 
                                                '","antmontosolicitado": "'+ this.registro.montosolicitado + 
                                                '","anttipodescuento": "'+ this.registro.anttipodescuento + 
                                                '","antmensaje": "'+ 'MENSAJE SOLICITUD ANTICIPO' +
                                                '","antcomentario": "'+ 'COMENTARIO SOLICITUD ANTICIPO' +
                                                '","cfuncionario": "'+ sessionStorage.getItem("cfuncionario") + 
                                                '","nfuncionario": "'+ this.registro.nfuncionario + 
                                                '","ccargo": "'+ this.registro.ccargo + 
                                                '","ncargo": "'+ this.registro.ncargo + 
                                                '","cgrupo": "'+ this.registro.cgrupo + 
                                                '","ngrupo": "'+ this.registro.ngrupo + 
                                                '","ctiporelacionlaboral": "'+ this.registro.ctiporelacionlaboral +
                                                '","ntiporelacionlaboral": "'+ this.registro.ntiporelacionlaboral +
                                                '","fvinculacion": "'+ this.registro.fvinculacionYMD +  
                                                '","tiempovinculacion": "'+ this.registro.tiempovinculacion +  
                                                '","remuneracion": "'+ this.registro.remuneracion + 
                                                '","garfuncionario": "'+ this.registro.garante + 
                                                '","garnfuncionario": "'+ this.registro.nfuncionariogarante + 
                                                '","ccargogarante": "'+ this.registro.ccargogarante + 
                                                '","ncargogarante": "'+ this.registro.ncargogarante + 
                                                '","ctiporelacionlaboralgarante": "'+ this.registro.ctiporelacionlaboralgarante + 
                                                '","ntiporelacionlaboralgarante": "'+  this.registro.ntiporelacionlaboralgarante +
                                                '","cgrupogarante": "'+ this.registro.cgrupogarante +
                                                '","ngrupogarante": "'+ this.registro.ngrupogarante + 
                                                '","fvinculaciongarante": "'+ this.registro.fvinculaciongaranteYMD + 
                                                '","tiempovinculaciongarante": "'+ this.registro.tiempovinculaciongarante +   
                                                '","remuneraciongarante": "'+ this.registro.remuneraciongarante + 
                                                '","cusuarioing": "'+ mradicacion.cu + 
                                                '","antmontosugerido": "'+ this.montoSugerido.toFixed(2) +                                                                                                                                                 
                                                '","anticipocuotas": '+ this.jsonCuotas +         
                                               // ',"endeudamientodetalle": '+ this.registro.endeudamientodetalle +                                                                                                     
                                                '}]';
         
          this.rqConsulta = { 'mdatos': {} };
          this.rqConsulta.CODIGOCONSULTA = 'ANTICIPOS_CREAR_SOLICITUD';
          this.rqConsulta.storeprocedure = "sp_AntCrearSolicitud";
          this.rqConsulta.parametro_anticiposolicitud = anticiposolicitud;
          this.msgs = [];
              
          this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
            resp => {                                  
               if (resp.cod === 'OK') {    
                this.crearSolicitud = false;
                this.validarIdIngresada(resp.ANTICIPOS_CREAR_SOLICITUD[0].respuesta, true)
              } 
            },
            error => {
              this.dtoServicios.manejoError(error);
            });          
      }
    }); 
  }
}

validarIdIngresada(respuesta: any, mostrarMensaje: boolean = false){
  const arrRespuesta = respuesta.split("-");
  if(mostrarMensaje)
    super.mostrarMensajeSuccess(arrRespuesta[0]);

  this.idSolicitudIngresada = arrRespuesta[1];
  if(parseInt(this.idSolicitudIngresada) > 0)
     this.vistaImprimir = true;
  else
     this.vistaImprimir = false;
}


descargarReporte(reg: any) {
  this.generaDocumentoAnticipo_1(this.idSolicitudIngresada, reg);
  this.generaDocumentoAnticipo_2(this.idSolicitudIngresada, reg);
}


generaDocumentoAnticipo_1(idAnticipo: any, resp: any): void {
  this.jasper.nombreArchivo = 'AnticipoFormulario';
  this.jasper.parametros['@cantsolicitud'] = this.idSolicitudIngresada;
  this.jasper.formatoexportar = resp;
  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptAutorizacionSolicitante';
  this.jasper.generaReporteCore();
}

generaDocumentoAnticipo_2(idAnticipo: any, resp: any): void {
  this.jasper.nombreArchivo = 'AnticipoAutorizacion';
  this.jasper.parametros['@cantsolicitud'] = this.idSolicitudIngresada;
  this.jasper.formatoexportar = resp;
  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptFormularioAnticipos';
  this.jasper.generaReporteCore(); 
}


/**
 * Función: Resetea el formulario de solicitud de anticipos
 * Fecha: 20220603
 */
cancelarSolicitud(){
  // garante
  this.registro.garante = null;
  this.registro.cfuncionariogarante = null;
  this.registro.nfuncionariogarante = null;
  this.registro.ctiporelacionlaboralgarante = null;
  this.registro.ntiporelacionlaboralgarante = null;
  this.registro.fvinculaciongarante = null;
  this.registro.tiempovinculaciongarante = null;
  this.registro.cgrupogarante = null;
  this.registro.ngrupogarante = null;
  this.registro.remuneraciongarante = null;                
  this.registro.ccargogarante = null;
  this.registro.ncargogarante = null;
  // monto
  this.totalCuotas = 0;
  this.lTablaCuotas = [];
  this.lGarante = [{ label: '...', value: null }];
  this.lPlazo = [{ label: '...', value: null }];
  this.registro.plazo = "";
  this.registro.montosolicitado = null;      
  this.registro.anttipodescuento = false; 
  this.jsonCuotas = null;
  this.lCapacidadEndeudamiento = [];
  this.totalEndeudamiento = 0;
  this.vistaTipoCuota = false;
  this.selectedvalue = "";

  this.verAnticipoSolicitante(sessionStorage.getItem("cfuncionario"));
}

  /**
   * Función: Devuelve la diferencia entre la fecha actual y la fecha de vinculación, en formato: años, meses, días
   * Fecha: 20220526
   * @param startingDate 
   * @param endingDate 
   * @returns 
   */
   diferenciaFechasYYMMDD(startingDate, endingDate, principal: boolean = false) {

    var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
        endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
    }
    var endDate = new Date(endingDate);
    if (startDate > endDate) {
        var swap = startDate;
        startDate = endDate;
        endDate = swap;
    }
    var startYear = startDate.getFullYear();
    var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var yearDiff = endDate.getFullYear() - startYear;
    var monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    var dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
        if (monthDiff > 0) {
            monthDiff--;
        } else {
            yearDiff--;
            monthDiff = 11;
        }
        dayDiff += daysInMonth[startDate.getMonth()];
    }

    let anios =  (yearDiff == 0 ? '': yearDiff + (yearDiff > 1 ? ' años, ' : ' año, ') ) ;
    let meses = (monthDiff == 0 ? '': monthDiff + (monthDiff > 1 ? ' meses, ' : ' mes, '));
    let dias = (dayDiff == 0 ? '' : dayDiff +  (dayDiff > 1 ? ' días' : ' día'));

    if(principal && yearDiff == 0 && monthDiff < 3)
    {
      this.bolPermanencia = false;
    }
    return anios + meses + dias; 
}

/**
 * Función: Presenta el primer o último día del mes ingresado
 * @param mesNombre 
 * @param ultimoDia 
 * @returns 
 */
 verPrimerUltimoDiaMes(mesNombre: string, ultimoDia: boolean)
 {
   let respfecha: string = "";
   const arrMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
 
   for (let i = 1; i <= arrMes.length; i++) {
     if(arrMes[i] == mesNombre)
     {
       if(ultimoDia){
         let dia = new Date((new Date().getFullYear()), i+1, 0);
         respfecha = dia.toISOString().slice(0, 10);
       } else
       {
         respfecha = new Date().getFullYear().toString() + '-' + (i+1 < 10 ? "0" + (i+1).toString() : (i+1).toString()) + '-01';
       }
     }    
   }
   return respfecha;
 }

}