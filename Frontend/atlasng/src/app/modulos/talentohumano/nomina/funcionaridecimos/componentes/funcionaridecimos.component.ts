import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';
@Component({
  selector: 'app-funcionaridecimos',
  templateUrl: 'funcionaridecimos.html'
})
export class FuncionarionominaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public totalvalidos: number = 0;
  public totalinvalidos: number = 0;
  public total: number = 0;
  public centrocostocdetalle: string;
  public ldatos: any = [];
  selectedRegistros;
  public totalnegados: number = 0;
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'FUNCIONARIOSNOMINA', false);
    this.componentehijo = this;
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosTipo: any = { 'ccatalogo': 1153 };
    const mfiltrosesp: any = { 'cdetalle': 'not in (\'GEN\')' };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, mfiltrosesp);
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('CENTROCOSTOS', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle', this, false);

    this.ejecutarConsultaCatalogos();
  }

  ngOnInit() {


    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();

  }
  obtnerdatos() {
    if (this.estaVacio(this.mcampos.tipocdetalle)) {
      super.mostrarMensajeError("SELECCIONE UN TIPO DE DÉCIMO PARA GENERAR EL PAGO")
      return;
    }
    this.rqConsulta.CODIGOCONSULTA = 'LISTAPAGODECIMO';
    this.rqConsulta.mdatos.tipo = this.mcampos.tipocdetalle;
    //this.rqConsulta.parametro_centrocostocdetalle = this.centrocostocdetalle;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          this.mcampos.total=0;
          if (resp.cod === 'OK') {
            this.lregistros = resp.LISTAPERSONAL;
            this.total = 0;
            for (let i in this.lregistros) {
              let reg = this.lregistros[i];
              this.totalinvalidos += 1;
              this.mcampos.total += reg.total;
            }
           
          }


        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  getTotal(): Number {
    let total = 0;
    this.totalvalidos = 0;
    this.totalinvalidos = 0;
    this.mcampos.total=0;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];

        this.totalvalidos += 1;
        this.mcampos.total += reg.total;

      }

    }

   

    return this.totalvalidos;
  }
  aprobarEtapa() {
    this.mcampos.msg = "INGRESE EL COMENTARIO PARA GENERAR PAGO DEL DÉCIMO ";
    this.mostrarDialogoGenerico = true;
  }
  aprobarpago() {
    if (this.aprobarListado()) {
      this.mostrarDialogoGenerico = false;
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
     // this.rqMantenimiento.mdatos.mescdetalle = this.mfiltros.mescdetalle;
      this.rqMantenimiento.mdatos.tipocdetalle = this.mcampos.tipocdetalle;
      this.grabar();

    } else {
      super.mostrarMensajeError("NO SE HAN SELECIONADO REGISTROS PARA GENERAR EL PAGO");
    }
  }

  getColorAprobadoPresupuesto(x, reg) {
    var color: string;
    if (!reg.avisoentrada) {
      color = 'lightgreen';

    } else {
      color = 'red';
    }
    x.parentNode.parentNode.style.background = color;
  }

  aprobarListado() {

    this.ldatos = [];
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        this.ldatos.push(reg);
      }
    }
    if (this.totalvalidos <= 0) {
      return false;

    }
    return true;
  }
  ngAfterViewInit() {
  }

  crearNuevo() {

  }

  actualizar() {
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

  public nuevaNomina() {
    if (this.totalvalidos <= 0) {
      super.mostrarMensajeError("NO HAY PERSONAS PARA REALIZAR EL PAGO DE DÉCIMOS");
      return;
    }
    if (!this.aprobarListado()) {
      super.mostrarMensajeError("NO HAY PERSONAS PARA REALIZAR EL PAGO DE DÉCIMOS");
    }
    const opciones = {};
    const tran = 475;
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
          ldatos: this.ldatos,
          estado: 'GEN',
          nuevaNomina: true,
          tipo:this.mcampos.tipocdetalle
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

  private fijarFiltrosConsulta() {
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



  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if(resp.VALIDADO){
      this.recargar();
    }
  }




}
