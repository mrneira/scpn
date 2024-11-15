import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../../lov/capacitacion/componentes/lov.capacitacion.component';
import { CatalogoDetalleComponent } from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { PermisoComponent } from '../submodulos/permiso/componentes/permiso.component';
import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-solicitudpermiso',
  templateUrl: 'solicitudpermiso.html'
})
export class SolicitudPermisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(PermisoComponent)
  private tablaPermiso: PermisoComponent;



  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public funcionario = true;
  public valido= true;
  private catalogoDetalle: CatalogoDetalleComponent;
  public lparametro: any = [];
  public lparametrorrh: any = [];
  
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tnomsolicitud', 'SOLPERMISO', true);
  }

  solicitar() {
    

    if (!this.validaGrabar()) {
      return;
    }
    this.confirmationService.confirm({
      message: 'Usted está generando un nuevo permiso, está seguro de enviar la solicitud?',
      header: 'Confirmación',
      accept: () => {
        this.grabar();
      }
    });
  }
  validaGrabar() {
    return this.tablaPermiso.validaGrabar();
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.tablaPermiso.mcampos.fechaactual = new Date();
    this.tablaPermiso.mcampos.fmin= new Date();
    this.tablaPermiso.mcampos.factiva= false;
    
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.registro.tipoccatalogo = 1139;
    this.registro.tipocdetalle = 'PER';
    this.registro.estado = true;
    this.registro.estadoccatalogo = 1138;
    this.registro.estadocdetalle = 'GEN';
    this.registro.cfuncionario= sessionStorage.getItem("cfuncionario");
    let jefe =sessionStorage.getItem("cfuncionariojefe");
    if(jefe=="-1"){
      this.valido =false;
    }else{
      this.registro.cfuncionariojefe= jefe
    }
   
    this.mcampos.cfuncionario=this.registro.cfuncionario;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cinstruccion)) {
      this.mostrarMensajeError('ELIJA UNA CAPACITACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }
  private fijarFiltrosConsulta() {
  }
  consultarCatalogos(): void {
    const mfiltrosparam = { 'codigo': 'CFUNDIREJECUTIVO' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('CFUNDIR', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero');

    const mfiltrosparamRRH = { 'codigo': 'USRRRH' };
    const consultarParametroRRH = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametroRRH.cantidad = 100;
    this.addConsultaCatalogos('CFUNRRH', consultarParametroRRH, this.lparametrorrh, super.llenaListaCatalogo, 'numero');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1102;
    const consTipo = this.catalogoDetalle.crearDtoConsulta();
    consTipo.cantidad = 100;
    this.addConsultaCatalogos('TIPO', consTipo, this.tablaPermiso.ltipo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.nuevo = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento


    this.crearDtoMantenimiento();
    if (this.nuevo) {
      this.selectRegistro(this.registro);
      this.actualizar();
      this.registro.fingreso = this.fechaactual;
      this.registro.arrhh = false;
      this.registro.ajefe = false;
      this.registro.adir = false;
      this.registro.finalizada = false;
      this.registro.aprobada = false;
      let con = this.lparametro[1].value;
      let RRH = this.lparametrorrh[1].value;
      this.registro.cfuncionarioejecutivo = con;
      this.registro.cusuariorrh = RRH;
      
      this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
    }
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));

    super.grabar();
  }


  public postCommit(resp: any) {

    if (resp.cod === 'OK') {
      if (!this.estaVacio(resp.SOLPERMISO)) {
        this.mcampos.csolicitud = resp.SOLPERMISO[0].csolicitud;
        this.grabarDetalle();
      }
      if (!this.estaVacio(resp.FINALIZADA)) {
        if (resp.FINALIZADA = 'OK') {
          this.recargar();
        }
      }

    }


  }
  grabarDetalle() {
    this.lmantenimiento = [];
    this.tablaPermiso.registro.csolicitud = this.mcampos.csolicitud;
    this.rqMantenimiento.mdatos.registro = this.tablaPermiso.registro;
    this.rqMantenimiento.mdatos.csolicitud = this.mcampos.csolicitud;
    this.rqMantenimiento.mdatos.archivo = this.tablaPermiso.mcampos.archivo;
    this.rqMantenimiento.mdatos.narchivo = this.tablaPermiso.mcampos.narchivo;
    this.rqMantenimiento.mdatos.tipo = this.tablaPermiso.mcampos.tipo;
    this.rqMantenimiento.mdatos.tamanio = this.tablaPermiso.mcampos.tamanio;
    this.rqMantenimiento.mdatos.extension = this.tablaPermiso.mcampos.extension;
    this.rqMantenimiento.mdatos.cfuncionario = this.mcampos.cfuncionario;

    this.enproceso = false;
    super.grabar();

  }


  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.cfuncionariojefe = reg.registro.jefecfuncionario;
    }
  }
  onSelectArchivo(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);

    this.mcampos.narchivo = file.name;
    this.mcampos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.tipo = file.type;
    this.mcampos.tamanio = file.size / 1000; // bytes/1000
    this.mcampos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }
  actualizaArchivo = (event) => {
    this.mcampos.archivo = event.srcElement.result.split('base64,')[1];

  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }
  public formatoHora($event: any, num: number): void {
    var temp = new Date($event);
    var hours = ("0" + temp.getHours()).slice(-2);
    var minutes = ("0" + temp.getMinutes()).slice(-2);
    var res = [hours, minutes].join(":");


    switch (num) {
      case 1: {
        this.registro.hinicio = res;
        break;
      }
      case 2: {
        this.registro.hfin = res;
        break;
      }



    }
  }


}
