import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
import { AppService } from 'app/util/servicios/app.service';
import { LovCompromisoComponent } from '../../../../presupuesto/lov/compromiso/componentes/lov.compromiso.component';
import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-nomina',
  templateUrl: 'nomina.html'
})
export class NominaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  @ViewChild(LovCompromisoComponent)
  private lovcompromiso: LovCompromisoComponent;

  public itemsNomina: MenuItem[] = [{ label: 'Aprobar Nómina', icon: 'ui-icon-circle-arrow-e', command: () => { this.aprobarEtapa(); } },
  { label: 'Rechazar Nómina', icon: 'ui-icon-circle-arrow-w', command: () => { this.rechazarEtapa(); } }];
  public ldatos: any = [];
  public cerrar: boolean = false;
  public aprobada: boolean = false;
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'tnomnomina', 'NOMINA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }
  aprobarEtapa() {
    if (this.aprobarSolicitud()) {
      this.grabar();

    } else {
      super.mostrarMensajeError("NO HA SELECCIONADO NINGUNA NÓMINA PARA EL MANTENIMIENTO O AÚN NO SE HA INGRESADO EL PRESUPUESTO")
    }
  }
  aprobarSolicitud() {

    this.ldatos = [];
    this.aprobada = true;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (!this.estaVacio(reg.ccompromiso)) {
          this.ldatos.push(reg);
        }

        this.cerrar = true;
      }
    }
    if (this.estaVacio(this.ldatos) || this.ldatos.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  rechazarEtapa() {
    if (this.negarSolicitud()) {
      this.grabar();
    } else {
      super.mostrarMensajeError("NO HA SELECCIONADO NINGUNA NÓMINA PARA EL MANTENIMIENTO")
    }

  }


  negarSolicitud(): boolean {

    this.cerrar = false;
    this.ldatos = [];
    this.aprobada = false;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        this.ldatos.push(reg);
        this.cerrar = true;
      }
    }
    if (this.estaVacio(this.selectedRegistros) || this.selectedRegistros.length == 0) {
      this.cerrar = false;
      return false;

    }
    return true;
  }
  ngAfterViewInit() {
  }

  crearNuevo() {


  }

  actualizar() {
    super.actualizar()
  }

  eliminar() {

  }
  generarCompromisoPrevio(reg: any) {
    delete this.rqConsulta.CODIGOCONSULTA;
    delete this.rqConsulta.mdatos.nomina;

    this.rqConsulta.CODIGOCONSULTA = 'PREVIOPRESUPUESTO';
    this.rqConsulta.mdatos.nomina = reg;


    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
         
          if (resp.cod === 'OK') {

            this.descargarBytes(resp.REPORTE);

          } else if (resp.msgusu) {
            this.mostrarMensajeError(resp.msgusu);

          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }

  descargarBytes(bytes: any): void {
    const linkElement = document.createElement('a');
    try {
      let contenttype = '';

      contenttype = 'application/pdf';

      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: contenttype });
      const bloburl = URL.createObjectURL(blob);


      window.open(bloburl);


      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);



    } catch (ex) {
    }
  }


  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  cancelar() {
    super.cancelar();
  }

  public buscar(registro: any) {
    this.cargarPagina(registro);
  }
  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }
  // Inicia CONSULTA *********************
  consultar() {
    delete this.rqConsulta.CODIGOCONSULTA;

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cnomina', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nestado', 'i.ccatalogo=t.estadoccatalogo and i.cdetalle=t.estadicdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.estadicdetalle='APR';
    this.mfiltros.direjecutiva=true;
    this.mfiltrosesp.tipocdetalle="IN (\'GEN\')";
  }
  mostrarlovCompromiso(): void {

    this.lovcompromiso.showDialog(true);
  }

  /**Retorno de lov de Compromiso presupuestario. */
  fijarLovCompromisoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccompromiso = reg.registro.ccompromiso;
      this.registro.mdatos.infoadicional = reg.registro.infoadicional;

    }

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
    this.lmantenimiento = []; // Encerar Mantenimiento

    this.rqMantenimiento.mdatos.cerrar = this.cerrar;
    this.rqMantenimiento.mdatos.nomina = this.ldatos;
    this.rqMantenimiento.mdatos.aprobada = this.aprobada;
    this.crearDtoMantenimiento();

    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();

  }


  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if(resp.FINALIZADA){
      this.recargar();
    }

  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1144 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;
    }
  }

  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;

      this.consultar();
    }
  }
  listaNomina() {
    const opciones = {};
    const tran = 415;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'false';
    opciones['del'] = 'false';
    opciones['upd'] = 'false';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);

    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {

      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 413;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          mfiltros: reg.mfiltros, cnomina: reg.cnomina, nmes: reg.mdatos.nmes,
          nuevaNomina: false,
          cerrada: reg.cerrada
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
}
