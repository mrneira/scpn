import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../../../generales/archivo/componentes/archivo.component';
import { ConfirmationService } from 'primeng/primeng';
import * as moment from 'moment';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';


@Component({
    selector: 'app-tnom-cargaarchivofondosreserva',
    templateUrl: 'cargaarchivofondosreserva.html'
})
export class CargaArchivosFRComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    
  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;
    
    public laccfonres: SelectItem[] = [{ label: '...', value: null }];
    public lregistrosProb = [];
    permiteGrabar: boolean = false;
    factorFR: any;
    maxDay: any;

    constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
        super(router, dtoServicios, 'tnomfondoreserva', 'FONDOSDERESERVA', false);
        this.componentehijo = this;
        this.maxDay = moment().add(1, 'months').date(1).subtract('days', 1).format('DD');
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.consultarCatalogos();
       this.mcampos.mescde
    }


    ngAfterViewInit() {
    }
    consultaCatalogoMes(): any {
        this.encerarConsultaCatalogos();
    
        const mfiltrosMes: any = { 'ccatalogo': 4 };
        const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
        consultaMes.cantidad = 50;
        this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    
        this.ejecutarConsultaCatalogos();
      }

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
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

    // Inicia CONSULTA *********************
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cgrupo', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nregimen', 'i.cdetalle = t.regimencdetalle and t.regimenccatalogo = i.ccatalogo');
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
        return true;
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (!this.permiteGrabar) {
            super.mostrarMensajeError("Todavía no ha cargado ningun archivo");
            return;
        }

        delete this.rqMantenimiento.archivo;
        delete this.rqMantenimiento.narchivo;

        this.permiteGrabar = false;
        this.rqMantenimiento.cargaarchivo = 'save';
        this.rqMantenimiento.lregistros = this.lregistros;
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.crearDtoMantenimiento();
        // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes        
        super.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        if (resp.tnomfondoreservaOK != undefined) {
            this.permiteGrabar = resp.tnomfondoreservaOK.length > 0;
            for (let index = 0; index < resp.tnomfondoreservaOK.length; index++) {
                resp.tnomfondoreservaOK[index].idreg = Math.floor((Math.random() * 100000) + 1);
                if (resp.tnomfondoreservaOK[index].cfondoreserva == 0)
                    delete resp.tnomfondoreservaOK[index].cfondoreserva;
            }
            this.lregistros = resp.tnomfondoreservaOK;

            this.lregistrosProb = resp.tnomfondoreservaProb;
            this.factorFR = resp.factorFR;
        }


        if (resp.TNOMFONDORESERVA != undefined) {
            for (let i = 0; i < resp.TNOMFONDORESERVA.length; i++) {
                for (let j = 0; j < this.lregistros.length; j++) {
                    if (resp.TNOMFONDORESERVA[i].idreg == this.lregistros[j].idreg) {
                        this.lregistros[j].cfondoreserva = resp.TNOMFONDORESERVA[i].cfondoreserva;
                        break;
                    }
                }
            }
        }
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
        const mfiltroACCFONRES: any = { 'ccatalogo': 1143 };
        const consultaACCFONRES = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroACCFONRES, {});
        consultaACCFONRES.cantidad = 500;
        this.addConsultaPorAlias('ACCFONRES', consultaACCFONRES);
    }

    /**Manejo respuesta de consulta de catalogos. */
    private manejaRespuestaCatalogos(resp: any) {
        const msgs = [];
        if (resp.cod === 'OK') {
            this.llenaListaCatalogo(this.laccfonres, resp.ACCFONRES, 'cdetalle');
        }
        this.lconsulta = [];
    }

    uploadHandler(event) {
        if (this.permiteGrabar) {
            super.mostrarMensajeError("Ya ha realizado una carga, por favor refresque la página");
            return;
        }

        this.rqMantenimiento.narchivo = event.files[0].name;
        this.rqMantenimiento.cargaarchivo = 'upload';
        this.getBase64(event);
    }

    getBase64(inputValue: any): void {
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.propagateChange(myReader.result);
        }
        myReader.readAsDataURL(file);
    }

    propagateChange = (value: any) => {
        this.rqMantenimiento.archivo = value;
        const rqMan = this.getRequestMantenimiento();
        this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
            resp => {
                if (resp.cod === 'OK') {
                    this.grabo = true;
                }
                this.encerarMensajes();
                this.respuestacore = resp;
                this.componentehijo.postCommit(resp);
                this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
                this.enproceso = false;
            },
            error => {
                this.dtoServicios.manejoError(error);
                this.enproceso = false;
                this.grabo = false;
            }
            // finalizacion
        );
    };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    cancelarSubir() {
        this.limpiarCampos();
    }

    limpiarCampos() {
    }

    calcularProporcional() {
        this.registro.valor = (this.registro.diasproporcionales/this.maxDay)*this.registro.sueldoactual*this.factorFR/100;
    }
    mostrarLovParametro(): void {
        this.lovParametro.mfiltros.verreg = 0;
        this.lovParametro.showDialog();
      }
    
      /**Retorno de lov de paises. */
      fijarLovParametroSelec(reg: any): void {
        if (reg.registro !== undefined) {
          this.registro.anio = reg.registro.anio;
          this.rqMantenimiento.mdatos.anio =reg.registro.anio;
        }
      }
}