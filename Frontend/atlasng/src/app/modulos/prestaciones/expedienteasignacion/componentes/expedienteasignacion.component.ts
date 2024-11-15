import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';
import { AppService } from '../../../../util/servicios/app.service';
import { MenuItem } from 'primeng/components/common/menuitem';



@Component({
  selector: 'app-expedientesignacion',
  templateUrl: 'expedienteasignacion.html'
})
export class ExpedienteAsignacionComponent extends BaseComponent implements OnInit {
  
  atencioncliente: any;
  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(JasperComponent) public jasper: JasperComponent;
  @ViewChild(LovPersonasComponent) private lovSocios: LovPersonasComponent;
  public collapsed = false;
  public bandeja = false;
  devolucion = false;
  cesantia = false;
  loperaciones: any = [];
  public siguienteestatus = "";
  public anteriorestatus = "";
  public itemsPasos: MenuItem[];
  selectedValues: string[] = [];
  public registroExpediente: any = { 'mdatos': {} };
  public rqManexp: any = { 'mdatos': {} };
  public rollback = true;
  public lregistrosRequisito: any = [];
  public existInfo = false;
  public statusPrint = false;
  private listaExpedientes = [];
  public nombrecdetalletipoexp = null;
  public registerAsignacionExpediente = false;
  private dataSend = {};
  private cexpediente = null;
  private cpersona = null;
  private archivoReporteUrl = null;
  private typeExpediente = null;//MNE 20231213
  

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'EXPEDIENTEASIGNACION', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.mcampos.valorsolicitado = 0;
    this.mcampos.numberexpediente = "Aún no ha seleccionado un socio";
    super.init(this.formFiltros, this.route);
  }

  //RECARGAR LA PAGINA
  recargar() {super.recargar();}

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {
    if (reg.registro !== undefined && reg.registro.identificacion !== this.mcampos.identificacion) {
      this.mcampos.cdetalletipoexp = null;
      this.mcampos.numberexpediente = "Aún no ha seleccionado un socio";
      this.cexpediente = null;
      this.cpersona = null;
      this.archivoReporteUrl = null;
      this.listaExpedientes = [];
      this.dataSend = {};
      this.nombrecdetalletipoexp = null;
      this.registerAsignacionExpediente = false;
      this.statusPrint = false;
      this.collapsed = false;
      this.bandeja = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.rollback = true;
      this.consultarSocio();
    }
  }

  //CONSULTA EL EXPEDIENTE DE UN SOCIO
  consultarSocio() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSEXPEDIENTE';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.rqConsulta.bandeja = this.bandeja;
    this.rqConsulta.etapa = "2";
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod === 'OK') {
          this.manejaRespuestaDatosSocio(resp);
          if(
            resp && 
            resp instanceof Object &&
            resp['DATOSSOCIO'] &&
            Array.isArray(resp['DATOSSOCIO']) &&
            resp['DATOSSOCIO'].length>0 &&
            resp['DATOSSOCIO'][0] instanceof Object &&
            resp['DATOSSOCIO'][0]['cdetalletipoexp'] &&
            resp['DATOSSOCIO'][0]['fbaja'] &&
            resp['DATOSSOCIO'][0]['cjerarquia'] &&
            resp['DATOSSOCIO'][0]['estatus']
          ){
            let csecuencia = null;
            switch (String(resp['DATOSSOCIO'][0]['cdetalletipoexp'])) {
              case "DEV":{
                this.typeExpediente = "DEV";
                const aniobaja = new Date(resp['DATOSSOCIO'][0]['fbaja']).getFullYear();
                const jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                csecuencia = "AEDEV"+ jerarquia + "-" + aniobaja;
              }break;
              case "CES":{
                const aniobaja = new Date(resp['DATOSSOCIO'][0]['fbaja']).getFullYear();
                let jerarquia = null;
                if(
                  resp['DATOSSOCIO'][0]['ctipobaja'] &&
                  resp['DATOSSOCIO'][0]['esbaja'] &&
                  (resp['DATOSSOCIO'][0]['ctipobaja'] == 2 || resp['DATOSSOCIO'][0]['ctipobaja'] == 3)
                ){
                  this.typeExpediente = "CEF";
                  csecuencia = "AECEF";
                  jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                }else{
                  this.typeExpediente = "CES";
                  csecuencia = "AECES";
                  if(aniobaja>=2023){
                    if(String(resp['DATOSSOCIO'][0]['tipobaja']).toUpperCase() == "DESTITUCION"){
                      jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                    }else{
                      jerarquia = "NM";
                    }
                  }else if(String(resp['DATOSSOCIO'][0]['tipobaja']).toUpperCase() == "DESTITUCION"){
                    jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                  }else{
                    jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "NC" : "NO";
                  }
                }
                csecuencia = csecuencia + jerarquia + "-" + aniobaja;
              }break;
              case "CEF":{
                this.typeExpediente = "CEF";
                const aniobaja = new Date(resp['DATOSSOCIO'][0]['fbaja']).getFullYear();
                const jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                csecuencia = "AECEF"+ jerarquia + "-" + aniobaja;
              }break;
              case "DEH":{
                this.typeExpediente = "DEH";
                const aniobaja = new Date(resp['DATOSSOCIO'][0]['fbaja']).getFullYear();
                const jerarquia = (resp['DATOSSOCIO'][0]['cjerarquia'] == "CLA") ? "CL" : "OF";
                csecuencia = "AEDEV"+ jerarquia + "-" + aniobaja;
              } break;
              case "ANT":{
                this.dtoServicios.manejoError({message: "No es posible asignar un expediente; no se encuentra habilitado la asignación de expediente para el tipo ANT"});
              } break;
              default:break;
            }
            if(csecuencia != null){
              this.validateExpedienteSocio(csecuencia);
            }else{
              this.dtoServicios.manejoError({message: "No es posible asignar un expediente; el socio no se encuentra validado para realizar la asignación de expediente"});
            }
          }else{
            this.dtoServicios.manejoError({message: "No es posible asignar un expediente; los datos que se requiere se encuentran incompletos"});
          }
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
    this.lconsulta = [];
  }

  //ASIGNA LOS DATOS DEL EXPEDIENTE DE UN SOCIO PARA VISUALIZAR EN LA VISTA
  manejaRespuestaDatosSocio(resp: any) {
    if (resp.cod === 'OK') {
      const msocio = resp.DATOSSOCIO[0];
      this.mcampos.identificacion = msocio.identificacion;
      if (msocio.liquidado) this.mcampos.fechaAlta = msocio.falta < msocio.fingreso ? msocio.fingreso : msocio.falta;
      else this.mcampos.fechaAlta = msocio.falta > msocio.fingreso ? msocio.fingreso : msocio.falta;
      this.mcampos.grado = msocio.grado;
      this.mcampos.cjerarquia = msocio.cjerarquia;
      this.mcampos.fingreso = msocio.fingreso;
      this.mcampos.fechaBaja = new Date(msocio.fbaja);
      this.mcampos.fnacimiento = msocio.fnacimiento;
      this.mcampos.tiemposervicio = msocio.tiemposervico;
      this.mcampos.edad = msocio.edad;
      this.mcampos.coeficiente = msocio.coeficiente;
      this.mcampos.tipobaja = msocio.tipobaja;
      this.mcampos.ctipobaja = msocio.ctipobaja;
      this.devolucion = msocio.devolucion;
      this.cesantia = msocio.cesantia;
      this.mcampos.estadoSocio = msocio.estadosocio;
      this.mcampos.genero = msocio.genero;
      this.mcampos.numaportaciones = msocio.totalaportes;
      this.mcampos.aporteacumuladoCabecera = msocio.acumuladoaportes;
      this.listaExpedientes = resp.TIPLIQUID;
      this.mcampos.cdetalletipoexp = msocio.cdetalletipoexp;
    }
  }

  //VALIDAR LOS DATOS DEL EXPEDIENTE DE UN SOCIO
  validateExpedienteSocio(csecuencia= null): void {
    this.lmantenimiento = [];
    const rollback = true;
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento.validaexp = true;
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = parseInt(cmoduloorg);
    this.rqMantenimiento['ctransaccion'] = parseInt(ctransaccionorg);
    this.rqMantenimiento['rollback'] = rollback;
    this.rqMantenimiento.etapa = '2';
    this.rqMantenimiento.bandeja = this.bandeja;
    if (this.estaVacio(this.mcampos.porcentaje)) this.rqMantenimiento.porcentaje = 0;
    else this.rqMantenimiento.porcentaje = this.mcampos.porcentaje
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.rqMantenimiento.cdetallejerarquia = this.mcampos.cjerarquia;
    this.rqMantenimiento.fechaalta = this.mcampos.fingreso;
    this.rqMantenimiento.fechabaja = this.mcampos.fechaBaja;
    this.rqMantenimiento.coeficiente = this.mcampos.coeficiente;
    this.rqMantenimiento.siguienteestatus = '2';
    this.rqMantenimiento.anteriorestatus = '1';
    this.rqMantenimiento.lregistrosRequisito = this.lregistrosRequisito;
    this.rqMantenimiento.valorsolicitado = this.mcampos.valorsolicitado;
    this.rqMantenimiento.ctipobaja = this.mcampos.ctipobaja;
    this.mcampos.numerocarpeta = this.registro.numerocarpeta;
    this.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.mcampos.fechaAlta = this.mcampos.fechaAlta;
    this.mcampos.fechaBaja = this.mcampos.fechaBaja;
    this.mcampos.tiemposervicio = this.mcampos.tiemposervicio;
    this.selectRegistro(this.registro);
    this.fijarValoresGrabarExpediente();
    super.actualizar();
    super.addMantenimientoPorAlias("DATOSEXPEDIENTE", this.getMantenimiento(1));
    let req = this.getRequestMantenimiento();
    req['cmodulo']=28;
    req['ctransaccion']=2;
    req['CODMODULOORIGEN']="28";
    req['CODTRANSACCIONORIGEN']="2";
    req['DATOSEXPEDIENTE']['bean']="tpreexpediente";
    req['AUX_CMODULO']=28;
    req['AUX_CTRANSACCION']=56;
    if(csecuencia){
      req['AUX_QUERY']=JSON.stringify({
        bean:"tgensecuencia",
        function: "FindSecuenceByTypeExpedient",
        param: csecuencia
      });
    }
    this.dtoServicios.ejecutarRestMantenimiento(req)
    .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false, false);
        if (resp.cod === 'OK') {
          for (const i in this.listaExpedientes) {
            if (this.listaExpedientes.hasOwnProperty(i)) {
              const reg: any = this.listaExpedientes[i];
              if(reg['cdetalle'] === resp['EXPEDIENTE']['cdetalletipoexp']){
                this.nombrecdetalletipoexp = reg['nombre'];
                break;
              }
            }
          }
          const session = JSON.parse(sessionStorage.getItem("mradicacion"));
          const valorActual = parseInt(resp['tgensecuencia']['valoractual']) + parseInt(resp['tgensecuencia']['valorincremento']);
          this.mcampos.numberexpediente = String(csecuencia).split("-")[0] + "-" + valorActual + "/" + String(csecuencia).split("-")[1];
          this.dataSend = {
            cexpediente: this.mcampos.numberexpediente,
            cpersona: resp['EXPEDIENTE']['cpersona'],
            secuencial: valorActual,
            csecuencia: csecuencia,
            fbaja: resp['EXPEDIENTE']['fsalidapolicia'],
            fingreso: new Date(),
            estadoasignacion:0,
            tipoexp: resp['EXPEDIENTE']['cdetalletipoexp'],
            cusuarioing: resp['cusuario'],
            cagencia: resp['cagencia'],
            csucursal: resp['csucursal'],
            ccompania: resp['ccompania']
          };
          this.registerAsignacionExpediente = true;
        } else {
          this.collapsed = false;
          if(
            resp['cod'] === "PRE-032" &&
            resp['cexpediente'] &&
            resp['cpersona'] &&
            resp['tipoexp'] &&
            this.typeExpediente
          ){
            switch (this.typeExpediente) {
              case "CES": {
                this.jasper.formatoexportar = 'pdf';
                this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteCes"; 
              }break;
              case "DEV": {
                this.jasper.formatoexportar = 'pdf';
                this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteDev";
              } break;
              case "CEF": {
                this.jasper.formatoexportar = 'pdf';
                this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteCef";
              } break;
              case "DEH":{
                this.jasper.formatoexportar = "pdf";
                this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteDeh";
              } break;
              case "ANT":{
                this.dtoServicios.manejoError({message: "No es posible generar el reporte; no se encuentra habilitado la asignación de expediente para el tipo ANT"});
              } break;
              default:break;
            }
            if(this.archivoReporteUrl){
              this.cexpediente = resp['cexpediente'];
              this.cpersona = resp['cpersona'];
              this.mcampos.numberexpediente = this.cexpediente;
              this.statusPrint = true; 
            }else{
              this.mcampos.numberexpediente = "No es posible imprimir el expediente";
            }
          }else{
            this.mcampos.numberexpediente = "No es posible asignar un número de expediente";
          }
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
    this.existInfo = true;
  }

  //COMPLEMENTA EL REQUEST PARA VALIDAR LOS EXPEDIENTES DE UN SOCIO
  fijarValoresGrabarExpediente(): void {
    this.registro.mdatos.jerarquia = this.mcampos.cjerarquia;
    this.registro.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.registro.cpersona = this.mcampos.cpersona;
    if (!this.mcampos.bandeja) {
      this.registro.cdetalleetapa = '2';
    }
    this.registro.fentradapolicia = this.mcampos.fechaAlta;
    this.registro.fsalidapolicia = this.mcampos.fechaBaja;
    this.registro.tiemposervicio = this.mcampos.tiemposervicio;
    if (this.mcampos.cdetalletipoexp !== 'ANT') {
      this.registro.numerocarpeta = this.mcampos.numerocarpeta;
    } else {
      this.registro.numerocarpeta = 'N/A';
    }
  }

  //GRABAR EN LA BASE DE DATOS LA ASIGNACIÓN DEL EXPEDIENTE
  asignarExpediente (){
    if(Object.keys(this.dataSend).length > 0 && this.typeExpediente){
      switch (this.typeExpediente) {
        case "CES": {
          this.jasper.formatoexportar = 'pdf';
          this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteCes"; 
        }break;
        case "DEV": {
          this.jasper.formatoexportar = 'pdf';
          this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteDev";
        } break;
        case "CEF": {
          this.jasper.formatoexportar = 'pdf';
          this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteCef";
        } break;
        case "DEH":{
          this.jasper.formatoexportar = "pdf";
          this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/rptAsignacionExpedienteDeh";
        } break;
        case "ANT":{
          this.dtoServicios.manejoError({message: "No es posible generar el reporte; no se encuentra habilitado la asignación de expediente para el tipo ANT"});
        } break;
        default:break;
      }
      if(this.archivoReporteUrl){
        let req = {
          mdatos: {},
          cpersona: this.dataSend['cpersona'],
          INGRESOASIGNACIONEXPEDIENTE: {ins: [this.dataSend], upd: [], del: [], esMonetario: false, enviarSP: false, bean: "tpreexpedienteasignacion", pos: 1},
          UPDATETGENTRANSACCION:{ins: [], upd: [{csecuencia:this.dataSend['csecuencia'], valoractual:this.dataSend['secuencial']}], del: [], esMonetario: false, enviarSP: false, bean: "tgensecuencia", pos: 1}
        };
        this.dtoServicios.ejecutarRestMantenimiento(req)
        .subscribe(
          resp => {
            if (resp.cod === 'OK') {
              this.registerAsignacionExpediente = false;
              this.statusPrint = true;
              this.cexpediente = this.dataSend['cexpediente'];
              this.cpersona = this.dataSend['cpersona'];
              this.dtoServicios.llenarMensaje(resp, true, true);
            }else{
              this.dtoServicios.manejoError({message: (resp['msgusu']) ? resp['msgusu'] : "No es posible asignar un expediente; sucedio un error interno"});
            }
          },
          error => {
            this.dtoServicios.manejoError(error);  
          }
        );
      }else{
        this.dtoServicios.manejoError({message: "No es posible asignar un expediente; el tipo de expediente que intenta asignar, no esta permitido"});
      }
    }else{
      this.dtoServicios.manejoError({message: "No es posible asignar un expediente; no existen datos para asignar o el tipo de expediente no existe"});
    }
  }

  //IMPRIMI EL REPORTE DE ASIGNACION
  print(){
    if(this.cexpediente && this.cpersona){
      this.jasper.parametros['@i_cexpediente'] = this.cexpediente;
      this.jasper.parametros['@i_cpersona'] = this.cpersona;
      this.jasper.parametros['@i_ambiente'] = this.dtoServicios.mradicacion["nambiente"];//MNE 20240910
      this.jasper.parametros['archivoReporteUrl'] = this.archivoReporteUrl;
      this.jasper.generaReporteCore();
    }else{
      this.dtoServicios.manejoError({message: "No existen los parametros necesarios para generar el reporte"});
    }
  }
}