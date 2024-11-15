import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent, Archivo } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-foto-firma',
  templateUrl: 'fotoFirma.html'
})
export class FotoFirmaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  public archivoFirma: Archivo;

  public archivoFoto: Archivo;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperpersonadetalle', 'PERSONADETALLE', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
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
    const consulta = new Consulta(this.entityBean, 'N', '', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.inicializarArchivos();
    this.consultarImagenes();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    this.marchivosng['carchivofirma'] = this.archivoFirma;
    this.marchivosng['carchivofoto'] = this.archivoFoto;
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.registro.nombre = reg.registro.nombre;
      this.rqMantenimiento.cpersona = reg.registro.cpersona;
      this.consultar();
    }
  }

  inicializarArchivos() {
    this.archivoFirma = this.crearNuevoArchivo();
    this.archivoFoto = this.crearNuevoArchivo();
    this.archivoFirma.codigo = this.registro.carchivofirma;
    this.archivoFoto.codigo = this.registro.carchivofoto;
  }
  consultarImagenes() {
    this.encerarConsultaImagenes();
    this.addConsultaImagen('carchivofirma', this.archivoFirma.codigo);
    this.addConsultaImagen('carchivofoto', this.archivoFoto.codigo);
    this.ejecutarConsultaImagenes();
  }

  onSelectArchivoFirma(event) {
      const file =  event.files[0];
      this.archivoFirma.nombre = file.name;
      this.archivoFirma.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
      this.archivoFirma.tamanio = file.size / 1000; // bytes/1000

      const fReader = new FileReader();
      fReader.addEventListener('loadend', this.actualizaArchivoFirma);
      fReader.readAsDataURL(file);
  }
  actualizaArchivoFirma = (event) => {
      this.archivoFirma.archivobytes = event.srcElement.result.split('base64,')[1];
      this.actualizaArchivoNg('carchivofirma', this.archivoFirma.archivobytes);
  }

  onSelectArchivoFoto(event) {
      const file =  event.files[0];
      this.archivoFoto.nombre = file.name;
      this.archivoFoto.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
      this.archivoFoto.tamanio = file.size / 1000; // bytes/1000

      const fReader = new FileReader();
      fReader.addEventListener('loadend', this.actualizaArchivoFoto);
      fReader.readAsDataURL(file);
  }
  actualizaArchivoFoto = (event) => {
      this.archivoFoto.archivobytes = event.srcElement.result.split('base64,')[1];
      this.actualizaArchivoNg('carchivofoto', this.archivoFoto.archivobytes);
  }

}
