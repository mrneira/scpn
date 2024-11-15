import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { AppService } from '../../../../util/servicios/app.service';

@Component({
  selector: 'app-expedientereporte',
  templateUrl: 'expedientereporte.html'
})
export class ExpedienteReporteComponent extends BaseComponent implements OnInit {
  public registroExpediente: any = { 'mdatos': {} };
  public rqManexp: any = { 'mdatos': {} };
  private listExpedientes = [];
  private ltiposexpediente: SelectItem[] = [{ label: 'Seleccione un tipo de expediente', value: null }];
  private titleActual = "";

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'EXPEDIENTEREPORTE', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.route);
    this.consultarReporteExpedientes();
  }

  //CONSULTA EL TOTAL DE EXPEDIENTES
  consultarReporteExpedientes() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 57;
    this.rqConsulta.filterlike = "AE";
    this.rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEREPORTE';
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod === 'OK') {
          resp['EXPEDIENTEREPORTE'].forEach(element => {
            if(!(this.ltiposexpediente.find(el=>(String(el['value']) == String(element['csecuencia']).split("-")[0])))){
              this.ltiposexpediente.push({ label:  this.getLabel(String(element['csecuencia']).split("-")[0]), value: String(element['csecuencia']).split("-")[0]});
            }
          });
          this.ltiposexpediente.sort((x, y) => parseInt(x['label']) - parseInt(y['label']));
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
    this.lconsulta = [];
  }

  getLabel(secuencia= null){
    switch (secuencia) {
      case "AECEFOF":return "CESANTÍAS FALLECIDOS OFICIALES";
      case "AECEFCL":return "CESANTÍAS FALLECIDOS CLASES";
      case "AECESNC":return "CESANTÍAS BAJAS NORMALES CLASE";
      case "AECESNO":return "CESANTÍAS BAJAS NORMALES OFICIALES";
      case "AECESNM":return "CESANTÍAS BAJAS NORMALES GENERALES";
      case "AECESOF":return "CESANTÍAS EXCESOS OFICIALES";
      case "AECESCL":return "CESANTÍAS EXCESOS CLASES";
      case "AEDEVOF":return "DEVOLUCIÓN APORTES OFICIALES";
      case "AEDEVCL":return "DEVOLUCIÓN APORTES CLASE";
      default:return null;
    }
  }

  eventSelectTipoExpediente(data: any) {
    if(data['value'] === null){
      this.titleActual = "";
    }else{
      this.titleActual = " - " + ((this.ltiposexpediente).find(el => (el['value'] === data['value'])))['label'];
    }
    this.rqConsulta = [];
    this.listExpedientes = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 57;
    this.rqConsulta.filterlike = String(data['value']);
    this.rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEREPORTE';
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod === 'OK') {
          let aux = [];
          resp['EXPEDIENTEREPORTE'].forEach(element => {
            aux.push({ 
              anio:  String(element['csecuencia']).split("-")[1], 
              valor: (parseInt(element['valoractual']) === 0) ? "Sin definir" : element['valoractual']
            });
          });
          aux.sort((x, y) => x['anio'] - y['anio']);
          this.listExpedientes = aux;
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
    this.lconsulta = [];
  }

  //RECARGAR LA PAGINA
  recargar() {super.recargar();}
}

