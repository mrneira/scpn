
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-mantenimientocash',
  templateUrl: 'mantenimientocash.html'
})
export class MantenimientoCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  public lTransaccion: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvemisorvalornominal', 'MANCASH', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }
    else {
      super.crearNuevo();

      this.registro.emisorcdetalle = this.mcampos.emisorcdetalle;

      this.actualizarDatos();

      this.registro.optlock = 0;

      //this.registro.debito = true;

    }
  }

  actualizarDatos() {

    if (!this.estaVacio(this.registro.mdatos.nftransaccion)) {

      try {
        this.registro.ftransaccion = (this.registro.mdatos.nftransaccion.getFullYear() * 10000) + ((this.registro.mdatos.nftransaccion.getMonth() + 1) * 100) + this.registro.mdatos.nftransaccion.getDate();
      }
      catch (ex) {
        let anio: number = Number(this.registro.mdatos.nftransaccion.substring(0, 4));
        let mes: number = Number(this.registro.mdatos.nftransaccion.substring(5, 7));
        let dia: number = Number(this.registro.mdatos.nftransaccion.substring(8, 10));
        this.registro.ftransaccion = (anio * 10000) + (mes * 100) + dia;
      }
    }

    if (this.estaVacio(this.registro.transaccionccatalogo)) {
      this.registro.transaccionccatalogo = 1219;
    }

    if (this.estaVacio(this.registro.emisorccatalogo)) {
      this.registro.emisorccatalogo = 1213;
    }

    if (this.estaVacio(this.registro.estadoccatalogo)) {
      this.registro.estadoccatalogo = 1204;
    }

    if (this.estaVacio(this.registro.estadocdetalle)) {
      this.registro.estadocdetalle = 'APR';
    }

    //insert into tgencatalogodetalle select 1204,'APR',0,'APROBADA',NULL,1
    //insert into tgencatalogodetalle select 1204,'ENVAPR',0,'ENVIADA PARA APROBACIÓN',NULL,1


    if (this.estaVacio(this.registro.precio)) this.registro.precio = null;
    if (this.estaVacio(this.registro.valornominal)) this.registro.valornominal = null;

    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.mcampos.emisorcdetalle)) {
      lmensaje = "DEBE EL EMISOR";
    }

    return lmensaje;
  }

  actualizar() {

    this.actualizarDatos();

    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);

    this.registro.fmodificacion = this.fecha;
    this.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    if (this.estaVacio(this.validarCabecera())) {
      this.crearDtoConsulta();
      super.consultar();

      // INI

      if (!this.estaVacio(this.mcampos.emisorcdetalle)) {
        const rqConsulta: any = new Object();
        rqConsulta.CODIGOCONSULTA = 'INVERSION';
        rqConsulta.inversion = 14;
        rqConsulta.emisorcdetalle = this.mcampos.emisorcdetalle;

        this.dtoServicios.ejecutarConsultaRest(rqConsulta)
          .subscribe(
            resp => {
              this.dtoServicios.llenarMensaje(resp, false);
              if (resp.cod !== 'OK') {
                return;
              }

              this.mcampos.vnominal = resp.VALORNOMINAL;

              //this.lregistros = resp.TABAMO;
            },
            error => {
              this.dtoServicios.manejoError(error);
            });

      }

    }
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.emisorccatalogo = 1213;
    this.mfiltros.emisorcdetalle = this.mcampos.emisorcdetalle;

    this.mfiltros.estadocdetalle = 'ING';

    const consulta = new Consulta(this.entityBean, 'Y', 't.ftransaccion desc', this.mfiltros, {});
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntransaccion', 'i.ccatalogo = t.transaccionccatalogo and i.cdetalle = t.transaccioncdetalle');
    consulta.addSubqueryPorSentencia('select cast(str(a.ftransaccion,8) as date) from tinvemisorvalornominal a where a.cinvemisorvalornominal = t.cinvemisorvalornominal', 'nftransaccion');

    this.addConsulta(consulta);
    return consulta;
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosEmisor: any = { 'ccatalogo': 1213 };

    this.mfiltrosesp = { 'cdetalle': " IN (select distinct i.emisorcdetalle from tinvinversion i where i.instrumentocdetalle like 'cash%') " };

    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, this.mfiltrosesp);
    consultaEmisor.cantidad = 1000;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

    const mfiltrosTrnEsp: any = { "cdetalle": " in ('IMPUES','COMISI', 'INT','DIV','ING','PERDID') " };

    const mfiltrosTransac: any = { 'ccatalogo': 1219 };
    const consultaTransac = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTransac, mfiltrosTrnEsp);
    consultaTransac.cantidad = 1000;
    this.addConsultaPorAlias('TRANSAC', consultaTransac);

    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lTransaccion, resp.TRANSAC, 'cdetalle');

    }
    this.lconsulta = [];
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }


  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

    if (resp.ccomprobante != undefined) {

      //let lccomprobante: string = 
      //let lnumerocomprobantecesantia: string  = 
      //this.router.navigate([''], { skipLocationChange: true });

      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;

      this.lregistros = [];

    }
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA SELECCIONADO LAS OPCIONES DE CABECERA";
    }
    else if (this.lregistros.length === 0) {
      lmensaje = "NO HA INGRESADO NINGÚN REGISTRO";
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }

    let lContabiliza: any = [];

    let ltransac: string;


    // ini
    /*

    for (const i in this.lregistros) {
      const reg = this.lregistros[i];

      let lValor = this.redondear(reg.valornominal,2);

      let ldebito: boolean = false;

      if (!this.estaVacio(reg.debito)) ldebito = reg.debito;

      if (!this.estaVacio(lValor) && Number(lValor) != 0)
      {
        ltransac = reg.transaccioncdetalle == 'INT' ? 'ING' : reg.transaccioncdetalle;

        lContabiliza.push({ rubrocdetalle: 'CAP', valor: lValor, debito: !ldebito, procesocdetalle: 'COMPRA', emisorccatalogo: reg.emisorccatalogo, emisorcdetalle: reg.emisorcdetalle });
  
        lContabiliza.push({ rubrocdetalle: ltransac, valor: lValor, debito: !ldebito, procesocdetalle: 'COMPRA', emisorccatalogo: reg.emisorccatalogo, emisorcdetalle: reg.emisorcdetalle });
  
      }
    } 

    */

    // fin





    let lsaldo: number = 0;

    if (!this.estaVacio(this.mcampos.vnominal) && Number(this.mcampos.vnominal) != 0) {
      lsaldo = this.redondear(this.mcampos.vnominal, 2);
    }

    let lcapital: number = 0;

    let ldebitoCapital: boolean;


    for (const i in this.lregistros) {
      const reg = this.lregistros[i];

      ltransac = reg.transaccioncdetalle == 'INT' ? 'ING' : reg.transaccioncdetalle;

      if (reg.transaccioncdetalle == 'DIV') {
        ltransac = 'ING';
      }

      if (ltransac == 'ING') {
        lsaldo = lsaldo + reg.valornominal;
        ldebitoCapital = true;
      }
      else {
        lsaldo = lsaldo - reg.valornominal;
        ldebitoCapital = false;
      }

      if(reg.transaccioncdetalle=='PERDID'){
        ldebitoCapital = true;
      }

      lContabiliza.push({ rubrocdetalle: 'CAP', valor: reg.valornominal, debito: ldebitoCapital, procesocdetalle: 'COMPRA', emisorccatalogo: reg.emisorccatalogo, emisorcdetalle: reg.emisorcdetalle });

      lContabiliza.push({ rubrocdetalle: ltransac, valor: reg.valornominal, debito: !ldebitoCapital, procesocdetalle: 'COMPRA', emisorccatalogo: reg.emisorccatalogo, emisorcdetalle: reg.emisorcdetalle });

    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.cinversion = -1;
    this.rqMantenimiento.contabilizar = true;
    this.rqMantenimiento.procesocdetalle = 'COMPRA';
    this.rqMantenimiento.lregistroContabilidad = lContabiliza;

    this.rqMantenimiento.emisorcdetalle = this.mcampos.emisorcdetalle;
    this.rqMantenimiento.valornominal = lsaldo;
    this.crearDtoMantenimiento();

    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

}
