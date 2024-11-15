import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';

import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { GestorDocumentalComponent } from '../../../../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
  selector: 'app-permiso',
  templateUrl: 'permiso.html'
})
export class PermisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  
  @ViewChild(GestorDocumentalComponent) 
  private lovGestor: GestorDocumentalComponent;
  


  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;

  private catalogoDetalle: CatalogoDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios,private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tnomsolicitud', 'PERMISO', true);
  }

  solicitar(){
    if(!this.validaGrabar()){
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
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS SOLICITUD]');
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.registro.cgesarchivo = reg.cgesarchivo;
      this.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();
      this.grabar();
    }
  }
  crearNuevo() {
  this.registro.tipoccatalogo=1139;
  this.registro.tipocdetalle='PER';
  this.registro.permisoccatalogo=1102;
  this.registro.estado= true;
  //this.registro.cfuncionario = sessionStorage.getItem("cfuncionario");
  this.registro.estadoccatalogo=1138;
  this.registro.estadocdetalle='GEN';
  this.registro.diacompleto= false;
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.mcampos.fmin = new Date(this.registro.finicio);
    }
    this.registro.ffin=null;
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
   
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }
  private fijarFiltrosConsulta() {
  }
  consultarCatalogos(): void {
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1102;
    const consTipo = this.catalogoDetalle.crearDtoConsulta();
    consTipo.cantidad = 100;
    this.addConsultaCatalogos('TIPO', consTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
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
        this.registro.fingreso= this.fechaactual;
        this.registro.cusuarioing=this.dtoServicios.mradicacion.cusuario;
      } else {
      }
      super.grabar();
    }
  

 
  public postCommit(resp: any) {

    if (resp.cod === 'OK') {
      this.grabo = true;
    }
   
   
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
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
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
  public formatoHora($event: any,num: number): void {
    var temp = new Date($event);
    var hours  = ("0" + temp.getHours()).slice(-2);
    var minutes = ("0" + temp.getMinutes()).slice(-2);
    var res= [hours, minutes].join(":");
  
  
    switch(num) {
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
