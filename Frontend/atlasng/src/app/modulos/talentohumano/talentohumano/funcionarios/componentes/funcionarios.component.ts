import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { InformacionPersonalComponent } from '../submodulos/infpersonal/componentes/_infPersonal.component';
import { ContactosComponent } from '../submodulos/contactos/componentes/_contactos.component';
import { FamiliaresComponent } from '../submodulos/cargasfamiliares/componentes/_familiares.component';
import { EnfermedadesComponent } from '../submodulos/enfermedades/componentes/_enfermedades.component';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-tth-funcionarios',
  templateUrl: 'funcionarios.html'
})
export class FuncionariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  lovFuncionarios: LovFuncionariosComponent;

  @ViewChild(InformacionPersonalComponent)
  informacionPersonal: InformacionPersonalComponent;

  @ViewChild(ContactosComponent)
  contactos: ContactosComponent;

  @ViewChild(FamiliaresComponent)
  familiares: FamiliaresComponent;

  @ViewChild(EnfermedadesComponent)
  enfermedades: EnfermedadesComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'FUNCIONARIOS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lconsulta = [];
    this.rqConsulta = { 'mdatos': {} };
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    this.addConsultaPorAlias(this.informacionPersonal.alias, this.informacionPersonal.crearDtoConsulta());
    this.addConsultaPorAlias(this.contactos.alias, this.contactos.crearDtoConsulta());
    this.addConsultaPorAlias(this.familiares.alias, this.familiares.crearDtoConsulta());
    this.addConsultaPorAlias(this.enfermedades.alias, this.enfermedades.crearDtoConsulta());
  }

  private fijarFiltrosConsulta() {
    this.informacionPersonal.fijarFiltrosConsulta();
    this.contactos.fijarFiltrosConsulta();
    this.familiares.fijarFiltrosConsulta();
    this.enfermedades.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.informacionPersonal.validaFiltrosRequeridos()
         && this.contactos.validaFiltrosRequeridos()
         && this.familiares.validaFiltrosRequeridos()
         && this.enfermedades.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.informacionPersonal.postQuery(resp);
    this.contactos.postQuery(resp);
    this.familiares.postQuery(resp);
    this.enfermedades.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    super.addMantenimientoPorAlias(this.informacionPersonal.alias, this.informacionPersonal.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.contactos.alias, this.contactos.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.familiares.alias, this.familiares.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.enfermedades.alias, this.enfermedades.getMantenimiento(5));
    this.rqMantenimiento.cfuncionario = this.informacionPersonal.registro.cfuncionario !== undefined ?
      this.informacionPersonal.registro.cfuncionario : 0;
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.informacionPersonal.validaGrabar()
      && this.contactos.validaGrabar()
      && this.familiares.validaGrabar()
      && this.enfermedades.validaGrabar();
  }

  public postCommit(resp: any) {
    this.informacionPersonal.postCommitEntityBean(resp, this.getDtoMantenimiento(this.informacionPersonal.alias));
    this.contactos.postCommitEntityBean(resp, this.getDtoMantenimiento(this.contactos.alias));
    this.familiares.postCommitEntityBean(resp, this.getDtoMantenimiento(this.familiares.alias));
    this.enfermedades.postCommitEntityBean(resp, this.getDtoMantenimiento(this.enfermedades.alias));
  }
  public  calcularEdad(fecha:any) :string{
    // Si la fecha es correcta, calculamos la edad
    if(fecha===null){
      return "";
    }
    var values = new Date(fecha);
    var dia =values.getDate();
    var mes = values.getMonth()+1;
    var ano = values.getFullYear();

    // escogemos los valores actuales
    var fecha_hoy = new  Date();
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

    return edad + " años, " + meses + " mes(es) y " + dias + " día(s)";
}
  /**Muestra lov de funcionarios */
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.informacionPersonal.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.contactos.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.familiares.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.enfermedades.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.informacionPersonal.mcampos.nfecha=this.calcularEdad(reg.registro.fnacimiento);
      this.consultarTitulo(reg.registro.tituloccatalogo);
      this.consultar();
    }
  }
  consultarTitulo(reg:any): void {
    this.encerarConsultaCatalogos();
    const mfiltrosparam = { 'ccatalogo': reg };
    const consultarParametro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TITULO', consultarParametro, this.informacionPersonal.ltitulo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
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
    //inf personal
    const mfiltroTipoDocumento: any = { 'ccatalogo': 303 };
    const consultaTipoDocumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoDocumento, {});
    consultaTipoDocumento.cantidad = 20;
    this.addConsultaPorAlias('TIPDOC', consultaTipoDocumento);

    const mfiltroGenero: any = { 'ccatalogo': 302 };
    const consultaGenero = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroGenero, {});
    consultaGenero.cantidad = 20;
    this.addConsultaPorAlias('GENERO', consultaGenero);

    const mfiltroEstadoCivil: any = { 'ccatalogo': 301 };
    const consultaEstadoCivil = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroEstadoCivil, {});
    consultaEstadoCivil.cantidad = 20;
    this.addConsultaPorAlias('ESTCIV', consultaEstadoCivil);

    const mfiltroTipoLicencia: any = { 'ccatalogo': 1105 };
    const consultaTipoLicencia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoLicencia, {});
    consultaTipoLicencia.cantidad = 20;
    this.addConsultaPorAlias('TIPLIC', consultaTipoLicencia);

    const mfiltroNacionalidad: any = {};
    const consultaNacionalidad = new Consulta('tgennacionalidad', 'Y', 't.nombre', mfiltroNacionalidad, {});
    consultaNacionalidad.cantidad = 5000;
    this.addConsultaPorAlias('NACION', consultaNacionalidad);

    const mfiltroTipoSangre: any = { 'ccatalogo': 1108 };
    const consultaTipoSangre = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoSangre, {});
    consultaTipoSangre.cantidad = 20;
    this.addConsultaPorAlias('TIPSAN', consultaTipoSangre);

    const mfiltroSector: any = { 'ccatalogo': 1109 };
    const consultaSector = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroSector, {});
    consultaSector.cantidad = 20;
    this.addConsultaPorAlias('TIPSEC', consultaSector);

    const mfiltroBanco: any = { 'ccatalogo': 305,'activo': true };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroBanco, {});
    consultaBanco.cantidad = 500;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaPorAlias('TIPCUEN', consultaTipoCuenta);

    //contacto
    const mfiltroTipoContacto: any = { 'ccatalogo': 1125 };
    const consultaTipoContacto = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoContacto, {});
    consultaTipoContacto.cantidad = 20;
    this.addConsultaPorAlias('TIPCON', consultaTipoContacto);

    //familiar
    const mfiltroParentezco: any = { 'ccatalogo': 1126 };
    const consultaParentezco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroParentezco, {});
    consultaParentezco.cantidad = 20;
    this.addConsultaPorAlias('PARENT', consultaParentezco);

    const mfiltroTipoDiscapacidad: any = { 'ccatalogo': 1127 };
    const consultaTipoDiscapacidad = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoDiscapacidad, {});
    consultaTipoDiscapacidad.cantidad = 20;
    this.addConsultaPorAlias('TIPDIS', consultaTipoDiscapacidad);

    //enfermedad
    const mfiltroTipoEnfermedad: any = { 'ccatalogo': 1128 };
    const consultaTipoEnfermedad = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoEnfermedad, {});
    consultaTipoEnfermedad.cantidad = 20;
    this.addConsultaPorAlias('TIPENF', consultaTipoEnfermedad);
      //centro de costos
    const mfiltroTipoCentroCosto: any = { 'ccatalogo': 1002 };
    const consultaTipoCentroCosto = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCentroCosto, {});
    consultaTipoCentroCosto.cantidad = 20;
    this.addConsultaPorAlias('TCENCOS', consultaTipoCentroCosto);
    //TIPO DE PERSONAL
    const mfiltroTipoPersonal: any = { 'ccatalogo': 1113 };
    const consultaTipoPersonal = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoPersonal, {});
    consultaTipoPersonal.cantidad = 20;
    this.addConsultaPorAlias('PERSONAL', consultaTipoPersonal);

    
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {

      //informacion personal
      this.llenaListaCatalogo(this.informacionPersonal.ltipodocumento, resp.TIPDOC, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.lgenero, resp.GENERO, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.lestadocivil, resp.ESTCIV, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltipolicencia, resp.TIPLIC, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltiposangre, resp.TIPSAN, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltiposector, resp.TIPSEC, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.lbanco, resp.BANCO, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltipocuenta, resp.TIPCUEN, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltipodiscapacidad, resp.TIPDIS, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.lcentrocostos, resp.TCENCOS, 'cdetalle');
      this.llenaListaCatalogo(this.informacionPersonal.ltipopersonal, resp.PERSONAL, 'cdetalle');
      
      //contacto
      this.llenaListaCatalogo(this.contactos.ltipocontacto, resp.TIPCON, 'cdetalle');

      //familiar
      this.llenaListaCatalogo(this.familiares.lparentezco, resp.PARENT, 'cdetalle');
      this.llenaListaCatalogo(this.familiares.ltipodiscapacidad, resp.TIPDIS, 'cdetalle');

      //enfermedad
      this.llenaListaCatalogo(this.enfermedades.ltipoenfermedad, resp.TIPENF, 'cdetalle');

    }
    this.lconsulta = [];
  }

  busquedaEnPersonas() {
    this.lconsulta = [];
    this.rqConsulta = { 'mdatos': {} };

    this.confirmationService.confirm({
      key: 'cd',
      message: 'Desea realizar la búsqueda en socios?',
      header: 'No se han encontrado funcionarios con los datos indicados',
      accept: () => {
        this.rqConsulta.mdatos.documento = this.lovFuncionarios.mfiltros.documento === undefined ? "" :
          this.lovFuncionarios.mfiltros.documento;

        this.rqConsulta.CODIGOCONSULTA = 'BUSQUEDACRUZADAFUNCIONARIOS';
        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
          .subscribe(
            resp => {
              if (resp.BUSQUEDACRUZADAFUNCIONARIOS != null) {
                this.informacionPersonal.completarInformacion(resp.BUSQUEDACRUZADAFUNCIONARIOS);
                this.lovFuncionarios.displayLov = false;
              }
            },
            error => {
              this.dtoServicios.manejoError(error);
            });
      },
      reject: () => {
      }
    });
  }
}
