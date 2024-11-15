import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovMapsComponent } from '../../../../../../../util/componentes/maps/componentes/lov.maps.component';
import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovProvinciasComponent } from '../../../../../../generales/lov/provincias/componentes/lov.provincias.component';
import { LovCantonesComponent } from '../../../../../../generales/lov/cantones/componentes/lov.cantones.component';
import { LovCiudadesComponent } from '../../../../../../generales/lov/ciudades/componentes/lov.ciudades.component';

@Component({
  selector: 'app-tth-infpersonal',
  templateUrl: '_infPersonal.html'
})
export class InformacionPersonalComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipodocumento: SelectItem[] = [{ label: '...', value: null }];
  public lgenero: SelectItem[] = [{ label: '...', value: null }];
  public lestadocivil: SelectItem[] = [{ label: '...', value: null }];
  public ltipolicencia: SelectItem[] = [{ label: '...', value: null }];
  public ltiposangre: SelectItem[] = [{ label: '...', value: null }];
  public ltiposector: SelectItem[] = [{ label: '...', value: null }];
  public lbanco: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipodiscapacidad: SelectItem[] = [{ label: '...', value: null }];
  public lcentrocostos: SelectItem[] = [{ label: '...', value: null }];
  public ltitulo: SelectItem[] = [{ label: '...', value: null }];
  public ltipopersonal: SelectItem[] = [{ label: '...', value: null }];

  

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovMapsComponent)
  private lovMapa: LovMapsComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;

  @ViewChild(LovCiudadesComponent)
  private lovCiudades: LovCiudadesComponent;
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TTHFuncionarioDetalle', 'FUNCIONARIO', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();

  }
  consultarTitulo(reg:any): void {
    if(!this.estaVacio(reg.value)){
    this.registro.tituloccatalogo=reg.value;
    this.registro.titulocdetalle=null;
    this.encerarConsultaCatalogos();
    const mfiltrosparam = { 'ccatalogo': Number(reg.value) };
    const consultarParametro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('RESP', consultarParametro, this.ltitulo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }else{
    this.ltitulo=[];
  }
  }

  validarDocumento() {

    this.rqConsulta.CODIGOCONSULTA = 'VALFUNCIONARIO';
    this.rqConsulta.mdatos.documento = this.registro.documento;
    this.rqConsulta.mdatos.tipo = this.registro.tipodocumentocdetalle;
    this.rqConsulta.mdatos.esnuevo = this.registro.esnuevo;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
         
          if (resp.cod != 'OK') {
            this.registro.documento = null;
            super.mostrarMensajeError(resp.msgusu);           
          }

        })
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.veractual = 0;
    this.registro.optlock = 0;
    this.registro.tipodocumentoccatalogo = 303;
    this.registro.generoccatalogo = 302;
    this.registro.estadocivilccatalogo = 301;
    this.registro.tipolicenciaconduccionccatalogo = 1105;
    this.registro.tiposangreccatalogo = 1108;
    this.registro.sectorccatalogo = 1109;
    this.registro.bancoccatalago = 305;
    this.registro.tipocuentaccatalogo = 306;
    this.registro.tipodiscapacidadccatalogo = 1127;
    this.registro.centrocostoccatalogo = 1002;
    this.registro.tipopersonalcatalogo=1113;
    this.registro.activo = true;
    this.lovPaises.mfiltros.cpais = this.registro.cpais = 'EC';
    this.lovPaises.mcampos.nombre = this.registro.mdatos.npais = 'ECUADOR';
    this.registro.esjefe = false;
    this.registro.porcentajediscapacidad = 0;
    this.registro.familiaexterior = false;
    this.registro.migrante = false;
    this.registro.discapacidad = false;

  }

  calcularEdad(fecha: any) {
    // Si la fecha es correcta, calculamos la edad
    if (fecha === null) {
      return "";
    }
    var values = new Date(fecha);
    var dia = values.getDate();
    var mes = values.getMonth() + 1;
    var ano = values.getFullYear();

    // escogemos los valores actuales
    var fecha_hoy = new Date();
    var ahora_ano = fecha_hoy.getFullYear();
    var ahora_mes = fecha_hoy.getMonth() + 1;
    var ahora_dia = fecha_hoy.getDate();

    // realizamos el calculo
    var edad = (ahora_ano + 1900) - ano;
    if (ahora_mes < mes) {
      edad--;
    }
    if ((mes == ahora_mes) && (ahora_dia < dia)) {
      edad--;
    }
    if (edad >= 1900) {
      edad -= 1900;
    }

    // calculamos los meses
    var meses = 0;

    if (ahora_mes > mes && dia > ahora_dia)
      meses = ahora_mes - mes - 1;
    else if (ahora_mes > mes)
      meses = ahora_mes - mes
    if (ahora_mes < mes && dia < ahora_dia)
      meses = 12 - (mes - ahora_mes);
    else if (ahora_mes < mes)
      meses = 12 - (mes - ahora_mes + 1);
    if (ahora_mes == mes && dia > ahora_dia)
      meses = 11;

    // calculamos los dias
    var dias = 0;
    if (ahora_dia > dia)
      dias = ahora_dia - dia;
    if (ahora_dia < dia) {
      var ultimoDiaMes = new Date(ahora_ano, ahora_mes - 1, 0);
      dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
    }
    this.mcampos.nfecha = edad + " años, " + meses + " mes(es) y " + dias + " día(s)";

  }


  actualizar() {
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
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cfuncionario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.jefecfuncionario and o.verreg=0 and t.verreg=0", "njefe");
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton');
    consulta.addSubquery('TgenCiudad', 'nombre', 'nciudad', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton and i.cciudad=t.cciudad');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[INFORMACION PERSONAL]');
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.jefecfuncionario = reg.registro.cfuncionario;
      this.registro.mdatos.njefe = reg.registro.mdatos.nombre;
    }
  }

  /**Muestra lov de Personas */
  mostrarLovMapa(): void {
    this.lovMapa.clearAll();
    this.lovMapa.inicializar(this.registro.latituddireccion, this.registro.longituddireccion);
    if (!this.estaVacio(this.registro.latituddireccion) && !this.estaVacio(this.registro.longituddireccion)) {
      this.lovMapa.addMarker(this.registro.latituddireccion, this.registro.longituddireccion, 'Ubicación domiciliaria');
    }
    this.lovMapa.showDialog();
  }

  /**Retorno de lov de Mapa. */
  fijarLovMapa(coords: any): void {
    this.registro.latituddireccion = coords.lat;
    this.registro.longituddireccion = coords.lng;
  }

  /**Muestra lov de Personas */
  mostrarLovPersonas(): void {
    if (this.registro.documento == '' || this.registro.documento == undefined)
      this.mostrarMensajeError('SE REQUIERE EL INGRESO DEL NUMERO DE DOCUMENTO DEL FUNCIONARIO');
    else {
      this.lovPersonas.mcampos.identificacion = this.registro.documento;
      this.lovPersonas.consultar();
      this.lovPersonas.showDialog();
    }
  }

  /**Retorno de lov de Personas. */
  fijarLovPersonas(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.registro.ccompania = reg.registro.ccompania;
      this.registro.mdatos.npersona = reg.registro.nombre;
    }
  }

  /**Muestra lov de paises */
  mostrarLovPaises(): void {
    this.lovPaises.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpais = reg.registro.cpais;
      this.registro.mdatos.npais = reg.registro.nombre;

      if (this.registro.cpais != "EC") {
        this.registro.cpprovincia = null;
        this.registro.mdatos.nprovincia = null;
        this.registro.ccanton = null;
        this.registro.mdatos.ncanton = null;
        this.registro.cciudad = null;
        this.registro.mdatos.nciudad = null;
      } else {
        this.mostrarLovProvincias();
      }
    }
  }

  /**Muestra lov de provincias */
  mostrarLovProvincias(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAIS REQUERIDO');
      return;
    }
    this.lovProvincias.mfiltros.cpais = this.registro.cpais;
    this.lovProvincias.consultar();
    this.lovProvincias.showDialog();
  }

  /**Retorno de lov de provincias. */
  fijarLovProvinciasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpprovincia = reg.registro.cpprovincia;
      this.registro.mdatos.nprovincia = reg.registro.nombre;

      this.registro.ccanton = null;
      this.registro.mdatos.ncanton = null;
      this.mostrarLovCantones();
    }
  }

  /**Muestra lov de cantones */
  mostrarLovCantones(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDO');
      return;
    }
    this.lovCantones.mfiltros.cpais = this.registro.cpais;
    this.lovCantones.mfiltros.cpprovincia = this.registro.cpprovincia;
    this.lovCantones.consultar();
    this.lovCantones.showDialog();
  }

  /**Retorno de lov de cantones. */
  fijarLovCantonesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccanton = reg.registro.ccanton;
      this.registro.mdatos.ncanton = reg.registro.nombre;
      this.mostrarLovCiudades();
    }
  }

  /**Muestra lov de ciudades */
  mostrarLovCiudades(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.ccanton)) {
      this.mostrarMensajeError('CANTÓN REQUERIDO');
      return;
    }
    this.lovCiudades.mfiltros.cpais = this.registro.cpais;
    this.lovCiudades.mfiltros.cpprovincia = this.registro.cpprovincia;
    this.lovCiudades.mfiltros.ccanton = this.registro.ccanton;
    this.lovCiudades.consultar();
    this.lovCiudades.showDialog();
  }

  /**Retorno de lov de ciudades. */
  fijarLovCiudadesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cciudad = reg.registro.cciudad;
      this.registro.mdatos.nciudad = reg.registro.nombre;
    }
  }

  completarInformacion(reg: any): void {
    if (reg != undefined) {
      this.crearNuevo();
      this.registro.ccompania = reg.ccompania;
      this.registro.telefonocelular = reg.celular;
      this.registro.cpersona = reg.cpersona;
      this.registro.email = reg.email;
      this.registro.emailinstitucion = reg.emailcorporativo;
      this.registro.documento = reg.identificacion;
      var nombres = reg.nombre.split(" ");
      if (nombres.length === 2) {
        this.registro.primerapellido = nombres[0];
        this.registro.primernombre = nombres[1];
      }
      if (nombres.length === 4) {
        this.registro.primerapellido = nombres[0];
        this.registro.segundoapellido = nombres[1];
        this.registro.primernombre = nombres[2];
        this.registro.segundonombre = nombres[3];
      }
      this.registro.tipodocumentocdetalle = reg.tipoidentificacdetalle;
      this.registro.mdatos.npersona = reg.nombre;
      this.editable = true;
    }
  }
}
