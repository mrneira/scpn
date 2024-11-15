import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../util/servicios/dto.servicios';
import { Consulta } from '../../../util/dto/dto.component';
import { DtoConsulta } from '../../../util/dto/dto.component';
import { Mantenimiento } from '../../../util/dto/dto.component';
import { DtoMantenimiento } from '../../../util/dto/dto.component';
import { Message } from 'primeng/primeng';
import { isIdentifierStart } from 'typescript';
import { MenuItem } from 'primeng/components/common/menuitem';


export abstract class BaseComponent {

    public KEY_CODE = {
        KEY_ENTER: 13,
        KEY_FLECHA_ABAJO: 40,
        KEY_FLECHA_IZQUIERDA: 37,
        KEY_FLECHA_DERECHA: 39,
        KEY_RE_PAG: 33,
        KEY_AV_PAG: 34,
    };
    /** Variable que indica si la pagina es de autoconsulta.  */
    public autoconsulta = false;
    /** Variable que verifica si envio una peticion al core y esta en ejecucion.  */
    public enproceso = false;
    /** Variable que verifica si envio una peticion al core y esta en ejecucion.  */
    public grabo = false;
    /**true, Indica que la transaccion permite eliminar registros.*/
    public del = false;
    /**true, Indica que la transaccion permite insertar datos.*/
    public ins = false;
    /** Variable editar original, sin cambiar cuando es formulario */
    public editarorg = false;
    /** true indica que permite el ingreso de datos, de un solo registro. */
    public editable = false;
    /**Titulo de la transaccion. */
    /** true indica que permite el ingreso de datos en un form, de un solo registro. */
    public formeditable = false;
    /**Codigo del modulo.*/
    public mod = null;
    /**Codigo de transaccion.*/
    public tran = null;
    /**Titulo de la transaccion. */
    public titulo: string;
    /**Referencia al bean hijo, utilizado para ejecuatr postQuery y postCommit */
    public componentehijo: any;
    /**Referencia al bean del componente principal usado desde el componente BpmDatos */
    public componenteprincipal: any;
    /**Referencia al form de filtros por defecto de una pagina */
    public formFiltrosBase: NgForm;
    /**Lista de objetos Consulta, a enviar al core para ejecutar consultas. */
    lconsulta: DtoConsulta[] = [];
    /**Lista de registros originales de consulta. */
    public lregistrosOriginales: any = [];
    /**Lista de objetos Mantenimiento, a enviar al core para ejecutar mantenimientos. */
    lmantenimiento: DtoMantenimiento[] = [];
    /**Lista de objetos que contienen definicion de entity beans vacios con los cuales se crea nuevos entity beans. */
    // protected registroNuevo: any = { 'pk': [] };
    protected registroNuevo: any = { 'mdatos': {}, 'actualizar': false, 'idreg': 0, 'esnuevo': true };
    /**Lista de registros de trabajo del bean. */
    public lregistros: any = [];
    /**Lista de registros de trabajo bce. */
    public lregistrosbce: any = [];
    /**Lista de registros a eliminar. */
    public lregistroseliminar: any = [];
    /**Registro de trabajo. */
    public registro: any = { 'mdatos': {} };
    /**Registro seleccionado de un datatable, con los datos originales antes del registro. */
    protected registroSeleccionado: any = { 'mdatos': {} };
    /**Registro bce de trabajo. */
    public registrosbce: any = { 'mdatos': {} };
    /**Objeto que gurada datos temporales utiiados en la transaccion. */
    public mcampos: any = { camposfecha: {} };
    /**Objeto que contiene filtros del entity bean. */
    public mfiltros: any = {};
    /**Objeto que contiene filtros a ser procesados sin like. */
    public mfiltrosigual: any = {};
    /**Objeto que contiene filtros especiales del entity bean. */
    public mfiltrosesp: any = {};
    /**Campos de control a enviar en consultas. */
    public rqConsulta: any = { 'mdatos': {} };
    /**Campos de control a enviar en consultas. */
    public rqConsultaArchivo: any = { 'mdatos': {} };
    /**Campos de control a enviar en consultas. */
    public rqMantenimiento: any = { 'mdatos': {} };
    /**Objeto que contine mensajes aplicativos. */
    msgs: Message[] = [];
    /**Variable generica para mostrar un dialogo por defecto en las paginas de mantenimiento de registros. */
    public mostrarDialogoGenerico = false;
    /**Objeto que contine respuesta core resultado de un mantenimeinto o conuslta. */
    public respuestacore: any = {};
    /**Objeto usado mayormente en los lovs, indica si se deshabilita o no los filtros */
    public mdesabilitaFiltros = {};
    /**Formato de fecha para el componente calendar de primeng */
    public formatofecha = 'yy-mm-dd';
    /**Metadata de objetos Consulta de catalogos, a enviar al core para ejecutar consultas. */
    protected metadataCatalogos = {};
    /** Variable usada para almacenar los archivos a guardar  */
    protected marchivosng = {};
    /** Variable usada para almacenar los archivos de imagenes que se retornan en base64  */
    public marchivosngstr = {};
    /**Metadata de objetos Consulta de imagenes, a enviar al core para ejecutar consultas. */
    protected metadataImagenes = {};
    /**Variable usado en los formularios para indicar si se ha ejecutado el boton de validar. */
    public formvalidado = false;
    /**Variable que indica si se limpia los mensajes con cada peticion. */
    public limpiamsgpeticion = true;
    /** Hora máxima del dia**/
    public horaMaxDia = '23:59';
    /**Lista de operadores*/
    public loperadores: any = [{ label: '', value: '' }, { label: 'Suma', value: '+' }, { label: 'Resta', value: '-' }, { label: 'Porcentaje', value: '%' }];
    /**Lista de meses*/
    public lmeses: any = [{ label: 'ENERO', value: '1' }, { label: 'FEBRERO', value: '2' }, { label: 'MARZO', value: '3' }, { label: 'ABRIL', value: '4' },
    { label: 'MAYO', value: '5' }, { label: 'JUNIO', value: '6' }, { label: 'JULIO', value: '7' }, { label: 'AGOSTO', value: '8' },
    { label: 'SEPTIEMBRE', value: '9' }, { label: 'OCTUBRE', value: '10' }, { label: 'NOVIEMBRE', value: '11' }, { label: 'DICIEMBRE', value: '12' }];
    /**Items de menu de etapas. */
    public itemsEtapa: MenuItem[] = [{ label: 'Aprobar etapa', icon: 'ui-icon-circle-arrow-e', command: () => { this.componentehijo.aprobarEtapa(); } },
    { label: 'Rechazar etapa', icon: 'ui-icon-circle-arrow-w', command: () => { this.componentehijo.rechazarEtapa(); } }];
    public itemsSolicitud: MenuItem[] = [{ label: 'Aprobar ', icon: 'ui-icon-circle-arrow-e', command: () => { this.componentehijo.aprobar(); } },
    { label: 'Rechazar', icon: 'ui-icon-circle-arrow-w', command: () => { this.componentehijo.rechazar(); } }];

    // Referencia a objeto de tipo ActivatedRoute, para poder recibir parametros
    protected route: any;

    public anioactual = null;

    public mesactual = null;

    public fechaactual = null;

    /** Usado en el 'postQueryEntityBean' se llama al metodo crearNuevo() automaticamente cuando no trae registros, hay casos que no se requiere llamar autom.*/
    public llamarnuevo = true;

    /* Usado en el manejo de 'camposfecha' para control cuando los campos son dinamicos manejan varios tipos de datos en el mismo atributo */
    public camposdinamicos = false;

    protected backendbean = false;
    /** Variable calendario es español*/
    public es: any;

    // RRO 20221216 ----------------------------------------------------------
    public totalCredito: Number = 0;
    public totalDebito: Number = 0;
    // RRO 20221216 ----------------------------------------------------------

    constructor(public router: Router, public dtoServicios: DtoServicios, public entityBean: string, public alias: string, public esform: boolean, private espkcompuesto = true) {
        this.entityBean = this.obtenerBean(this.entityBean);

        this.fechaactual = new Date();
        this.anioactual = this.fechaactual.getFullYear();
        this.mesactual = this.fechaactual.getMonth() + 1;
    }

    init(formFiltrosPagina = null, route = null) {
        this.route = route;
        this.formFiltrosBase = formFiltrosPagina;

        this.titulo = sessionStorage.getItem('titulo');

        this.editarorg = (sessionStorage.getItem('upd') !== null && sessionStorage.getItem('upd').toLocaleLowerCase() === 'true');
        this.editable = this.editarorg;
        this.del = (sessionStorage.getItem('del') !== null && sessionStorage.getItem('del').toLocaleLowerCase() === 'true');
        this.ins = (sessionStorage.getItem('ins') !== null && sessionStorage.getItem('ins').toLocaleLowerCase() === 'true');
        this.mod = sessionStorage.getItem('m');
        this.tran = sessionStorage.getItem('t');

        this.crearnuevoRegistro();
        this.inicializaFormulario();

        this.autoconsulta = (sessionStorage.getItem('ac') !== null && sessionStorage.getItem('ac').toLocaleLowerCase() === 'true');
        if (this.componentehijo.consultarCatalogos === undefined && this.autoconsulta) {
            this.componentehijo.consultar();
        }
        /** Carga el calendar en español*/
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mie", "jue", "vie", "sab"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        }
    }

    obtenerBean(entityBean: string): string {
        return entityBean.toLocaleLowerCase();
    }

    /* Unicamente debe ser llamado desde el init, */
    inicializaFormulario() {
        if (this.esform && this.editable) {  // esform: true es un formulario, false es una grilla.
            this.editable = false; // para habilitar el boon de edicion cuando es un formulario.
            this.formeditable = true;
            this.componentehijo.crearNuevo();
        } else {
            this.formeditable = false;
        }
    }

    /**Habilita el formulario para edicion. */
    public deshabilitarEdicion(): void {
        this.editable = false;
    }

    /**Deshabilita el formulario para edicion, y muestra botones de aceptar y cancelar.
     * Permite ingresar información en los campos tipo input.
    */
    public habilitarEdicion(): void {
        this.editable = true;
    }

    clone(obj: any) {
        return JSON.parse(JSON.stringify(obj), this.dtoServicios.dateParser);
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
    /**Ejecuta el metodo actualizar definido en el componentehijo. */
    actualizar() {
        const lregistrosaux = [...this.lregistros];
        if (this.registro.esnuevo && !this.existe(this.registro)) {
            lregistrosaux.push(this.registro);
        } else {
            const index = this.lregistros.findIndex(n => n.idreg === this.registroSeleccionado.idreg);
            if (index >= 0) {
                lregistrosaux[index] = this.registro;
                this.registroSeleccionado = this.registro;
            } else {
                this.mostrarMensajeWarn('REGISTRO NO ACTUALIZADO');
            }
        }
        this.lregistros = lregistrosaux;
        this.mostrarDialogoGenerico = false;
    }

    /**Ejecuta el metodo cancelar definido en el componentehijo. */
    cancelar() {
        this.mostrarDialogoGenerico = false;
        this.registro = this.registroSeleccionado;
    }

    // ELIMINADOS *******************************************************************************************

    /**Ejecuta el metodo cancelar definido en el componentehijo. */
    /*eliminar() {
      const lregistrosaux = [...this.lregistros];
  
      if (!this.registro.esnuevo) {
        lregistrosaux.splice(this.lregistros.indexOf(this.registroSeleccionado), 1);
        this.lregistroseliminar.push(this.registroSeleccionado);
      }
      this.lregistros = lregistrosaux;
      this.mostrarDialogoGenerico = false;
    }*/

    eliminar() {
        const lregistrosaux = [...this.lregistros];

        for (const i in lregistrosaux) {
            if (lregistrosaux.hasOwnProperty(i)) {
                const item = lregistrosaux[i];
                if (JSON.stringify(item) === JSON.stringify(this.registroSeleccionado)) {
                    lregistrosaux.splice(Number(i), 1);
                    break;
                }
            }
        }
        //    if (lregistrosaux.indexOf(this.registroSeleccionado) >= 0) {
        //      lregistrosaux.splice(this.lregistros.indexOf(this.registroSeleccionado), 1);
        //    }

        if (!this.registro.esnuevo && this.lregistroseliminar.filter(n => n.idreg === this.registroSeleccionado.idreg).length <= 0) {
            this.lregistroseliminar.push(this.registroSeleccionado);
        }
        this.lregistros = lregistrosaux;
        this.mostrarDialogoGenerico = false;
    }

    /* TRAE ETIQUETA DEL dropdown**/

    registrarEtiqueta(reg: any, lista: any, campo: string, alias: string) {
        let cmapo1 = null;
        let cmapo2 = null;
        if (campo.indexOf('.') > 0) {
            const arrpks = campo.split('.');
            cmapo1 = arrpks[0];
            cmapo2 = arrpks[1];
        }
        for (const i in lista) {
            if (lista.hasOwnProperty(i)) {
                const item = lista[i];
                let valorcampo = null;
                if (campo.indexOf('pk') < 0) {
                    valorcampo = reg[campo];
                } else if (cmapo1 === null) {
                    valorcampo = reg[cmapo1];
                } else {
                    valorcampo = reg[cmapo1][cmapo2];
                }

                if (valorcampo != null && valorcampo === item.value) {
                    reg.mdatos[alias] = item.label;
                    break;
                }
            }
        }
    }

    /* CAMBIA ETIQUETA DEL MDATOS DEL DROPDOWN**/
    cambiarEtiquetaDropdown(evento: any, lista: any, campo: any) {
        if (evento.originalEvent.target.innerText === "...") {
            this.registro.mdatos[campo] = null;
            return;
        }
        if (evento.originalEvent.target.innerText === "") {
            // evento.originalEvent.preventDefault();
            // evento.originalEvent.stopPropagation();
            var detalle = lista.find(x => x.value === evento.value);
            this.registro.mdatos[campo] = detalle.label;
        } else {
            this.registro.mdatos[campo] = evento.originalEvent.target.innerText;
        }
    }

    /* CAMBIA ETIQUETA DROPDOWN SIN MEDATOS**/
    cambiarEtiquetaDropdownSinMdatos(evento: any, lista: any, campo: any) {
        if (evento.originalEvent.target.innerText === "...") {
            this.registro.mdatos[campo] = null;
            return;
        }
        if (evento.originalEvent.target.innerText === "") {
            // evento.originalEvent.preventDefault();
            // evento.originalEvent.stopPropagation();
            var detalle = lista.find(x => x.value === evento.value);
            this.registro[campo] = detalle.label;
        } else {
            this.registro[campo] = evento.originalEvent.target.innerText;
        }
    }

    // CONSULTA ***********************************

    /**Consulta la primera pagina */
    consultar() {
        if (!this.validaFiltrosConsulta()) {
            return;
        }
        this.ejecutarConsulta('C');
    }
    /**Consulta la pagina anterior de bloque de registros */
    consultarAnterior() {
        this.ejecutarConsulta('A');
    }
    /**Consulta la siguiente pagina de bloque de registros */
    consultarSiguiente() {
        this.ejecutarConsulta('S');
    }

    /**Encerar lista de consulta. */
    encerarConsulta(): void {
        this.lconsulta = [];
    }

    /**Valida el formulario de filtros de consulta. */
    validaFiltrosConsulta(mensaje = 'FILTROS DE CONSULTA REQUERIDOS'): boolean {
        if (this.formFiltrosBase !== undefined && this.formFiltrosBase !== null) {
            if (!this.formFiltrosBase.valid) {
                this.mostrarMensajeError(mensaje);
            }
            return this.formFiltrosBase.valid;
        }
        return true;
    }

    /**Valida el formulario de filtros de consulta. */
    validaFiltrosRequeridos(mensaje = 'FILTROS DE CONSULTA REQUERIDOS'): boolean {
        if (this.estaVacio(this.mfiltros) && this.estaVacio(this.mfiltrosigual)) {
            this.mostrarMensajeError(mensaje);
            return false;
        }
        return true;
    }

    /**Adiciona un objeto Consulta, asociado a un entity bean a consultar
     * Se puede consultar varias tablas en un solo request.
    */
    addConsulta(consulta: Consulta) {
        this.addConsultaPorAlias(this.alias, consulta);
    }

    /**Adiciona un objeto Consulta dado un alias, asociado a un entity bean a consultar
     * Se puede consultar varias tablas en un solo request.
    */
    addConsultaPorAlias(alias: string, consulta: Consulta) {
        this.lconsulta.push(new DtoConsulta(alias, consulta));
    }

    /**Entrega un objeto consulta dado el alias. */
    getConsulta(alias: string): Consulta {
        let consulta: Consulta;
        for (const i in this.lconsulta) {
            if (this.lconsulta.hasOwnProperty(i)) {
                const dto: DtoConsulta = this.lconsulta[i];
                if (dto.alias === alias) {
                    consulta = dto.consulta;
                    break;
                }
            }
        }
        return consulta;
    }

    private ejecutarConsulta(tipo: string, appName = null, metodo = null) {
        //this.encerarMensajes();
        if (this.enproceso) {
            return; // Si esta en ejecucion al core no volver a consultar.
        }
        this.enproceso = true;
        // Objeto con que contiene 1..n beans a consultar
        const rq = this.getRequestConsulta(tipo);
        this.dtoServicios.ejecutarConsultaRest(rq, appName, metodo).subscribe(
            resp => {
                //this.encerarMensajes();
                this.dtoServicios.llenarMensaje(resp, false, this.limpiamsgpeticion); // solo presenta errores.
                this.componentehijo.postQuery(resp);
                this.respuestacore = resp;
                this.enproceso = false;
            },
            error => {
                this.dtoServicios.manejoError(error);
                this.enproceso = false;
            }
            // finalizacion
        );
    }

    /**Entrega la metadata a enviar al core para realizar consultas. */
    public getRequestConsulta(tipo: string) {
        const metadata = new Object();
        // Adiciona campos de control de consutas.
        for (const i in this.rqConsulta) {
            if (this.rqConsulta.hasOwnProperty(i)) {
                metadata[i] = this.rqConsulta[i];
            }
        }
        // adiciona metadata de los entitybean a consultar
        for (const i in this.lconsulta) {
            if (this.lconsulta.hasOwnProperty(i)) {
                const dto: DtoConsulta = this.lconsulta[i];
                if (!(tipo === 'S' && (this.lregistros == null || this.lregistros.length <= 0))) {
                    dto.consulta.setPagina(tipo);
                }
                dto.consulta.bean = this.obtenerBean(dto.consulta.bean);
                metadata[dto.alias] = dto.consulta;
            }
        }
        return metadata;
    };


    /**Entrega la metadata a enviar al core para realizar consultas de archivos. */
    public getRequestConsultaImagen() {
        const cmoduloorg = sessionStorage.getItem('m');
        const ctransaccionorg = sessionStorage.getItem('t');

        this.rqConsultaArchivo.mdatos.CODIGOCONSULTA = 'ARCHIVO';
        this.rqConsultaArchivo.mdatos.inbytes = false;
        this.rqConsultaArchivo.mdatos['carchivos'] = {};
        for (const alias in this.metadataImagenes) {
            if (this.metadataImagenes.hasOwnProperty(alias)) {
                this.rqConsultaArchivo.mdatos['carchivos'][alias] = this.metadataImagenes[alias]['carchivo'];
            }
        }

        const metadata = new Object();
        // Adiciona campos de control de consutas.
        for (const i in this.rqConsultaArchivo) {
            if (this.rqConsultaArchivo.hasOwnProperty(i)) {
                metadata[i] = this.rqConsultaArchivo[i];
            }
        }
        return metadata;
    };

    protected ejecutarConsultaImagenes(appName = null, metodo = null) {
        //this.encerarMensajes();
        if (this.enproceso) {
            //return; // Si esta en ejecucion al core no volver a consultar.
        }
        this.enproceso = true;
        // Objeto con que contiene 1..n beans a consultar
        const rq = this.getRequestConsultaImagen();
        this.dtoServicios.ejecutarConsultaRest(rq, appName, metodo).subscribe(
            resp => {
                //this.encerarMensajes();
                this.dtoServicios.llenarMensaje(resp, false, this.limpiamsgpeticion); // solo presenta errores.
                if (!this.estaVacio(resp['imagenes'])) {
                    for (const key in this.metadataImagenes) {
                        if (this.metadataImagenes.hasOwnProperty(key)) {
                            this.marchivosngstr[key] = 'data:image/jpg;base64,' + resp['imagenes'][key];
                        }
                    }
                }
                this.enproceso = false;
            },
            error => {
                this.dtoServicios.manejoError(error);
                this.enproceso = false;
            }
            // finalizacion
        );
    }

    protected actualizaArchivoNg(key, strimagen) {
        if (this.estaVacio(key)) {
            return;
        }
        this.marchivosngstr[key] = 'data:image/jpg;base64,' + strimagen;
    }

    protected encerarConsultaImagenes() {
        this.metadataImagenes = {};
    }

    /**Adiciona un objeto Consulta dado un alias, asociado a un entity bean a consultar
     * Se puede consultar varias tablas en un solo request.
    */
    addConsultaImagen(alias: string, carchivo: number) {
        if (this.estaVacio(alias)) {
            return;
        }
        this.metadataImagenes[alias] = {};
        this.metadataImagenes[alias]['carchivo'] = carchivo;
        //this.metadataCatalogos[carchivo]['strimagen'] = strimagen;
    }

    addCatalogoPostQuery(postquerycallback) {
        this.metadataCatalogos['postquery'] = postquerycallback;
    }

    public encerarConsultaCatalogos() {
        this.metadataCatalogos = {};
    }
    public ejecutarConsultaCatalogos(appName = null, metodo = null) {
        //this.encerarMensajes();

        // Si es autoconsulta, agregar consulta postquery
        if (this.autoconsulta) {
            this.addCatalogoPostQuery('consultar');
        }

        // Objeto con que contiene 1..n beans a consultar
        const rq = this.getRequestConsultaCatalogos();
        rq['grabarlog'] = '0';
        this.dtoServicios.ejecutarConsultaRest(rq, appName, metodo).subscribe(
            resp => {
                //this.encerarMensajes();
                this.dtoServicios.llenarMensaje(resp, false, this.limpiamsgpeticion); // solo presenta errores.
                for (const key in this.metadataCatalogos) {
                    if (this.metadataCatalogos.hasOwnProperty(key) && key !== 'postquery' && !this.estaVacio(this.metadataCatalogos[key]['callback'])) {
                        this.metadataCatalogos[key]['callback'](this.metadataCatalogos[key]['lista'], resp[key], this.metadataCatalogos[key]['campopk'],
                            this.metadataCatalogos[key]['agregaregistrovacio'], this.metadataCatalogos[key]['componentehijo']);
                    }
                }
                if (this.metadataCatalogos['postquery'] !== undefined) {
                    this.componentehijo[this.metadataCatalogos['postquery']]();
                }
            },
            error => {
                this.dtoServicios.manejoError(error);
            }
            // finalizacion
        );
    }

    /**Entrega la metadata a enviar al core para realizar consultas. */
    public getRequestConsultaCatalogos() {
        const tipo = 'C';
        const metadata = new Object();
        // adiciona metadata de los entitybean a consultar
        for (const i in this.metadataCatalogos) {
            if (this.metadataCatalogos.hasOwnProperty(i) && i !== 'postquery') {
                const dto: DtoConsulta = this.metadataCatalogos[i]['dto'];
                dto.consulta.setPagina(tipo);
                metadata[dto.alias] = dto.consulta;
            }
        }
        return metadata;
    };

    /**Adiciona un objeto Consulta dado un alias, asociado a un entity bean a consultar
     * Se puede consultar varias tablas en un solo request.
    */
    addConsultaCatalogos(alias: string, consulta: Consulta, lista, callback, campopk = 'pk', componentehijo = null, agregaRegistroVacio = true) {
        this.metadataCatalogos[alias] = {};
        this.metadataCatalogos[alias]['dto'] = new DtoConsulta(alias, consulta);
        this.metadataCatalogos[alias]['lista'] = lista;
        this.metadataCatalogos[alias]['callback'] = callback;
        this.metadataCatalogos[alias]['campopk'] = campopk;
        this.metadataCatalogos[alias]['componentehijo'] = componentehijo;
        this.metadataCatalogos[alias]['agregaregistrovacio'] = agregaRegistroVacio;
    }

    public llenaListaCatalogo(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
        while (pLista.length > 0) {
            pLista.pop();
        }
        if (agregaRegistroVacio) {
            pLista.push({ label: '...', value: null });
        }
        let cmapo1 = null;
        let cmapo2 = null;
        if (campopk.indexOf('.') > 0) {
            const arrpks = campopk.split('.');
            cmapo1 = arrpks[0];
            cmapo2 = arrpks[1];
        }
        for (const i in pListaResp) {
            if (pListaResp.hasOwnProperty(i)) {
                const reg = pListaResp[i];
                if (campopk.indexOf('pk') < 0) {
                    pLista.push({ label: reg.nombre, value: reg[campopk] });
                } else if (cmapo1 === null) {
                    pLista.push({ label: reg.nombre, value: reg.pk });
                } else {
                    pLista.push({ label: reg.nombre, value: reg[cmapo1][cmapo2] });
                }
            }
        }
    }

    /**Metodo que se ejecuta luego de realiar consultas fija id por cada registro. */
    public postQueryEntityBean(resp: any) {
        if (resp.cod !== 'OK' || resp[this.alias] === undefined) {
            return;
        }
        this.lregistros = [];
        const objresp = resp[this.alias];


        // Verifica si es objeto y lo agrega a la lista
        if (objresp !== null && !(objresp instanceof Array)) {
            this.lregistros.push(objresp);
        } else {
            this.lregistros = objresp;
        }

        // actualiza idreg de cada registro.
        if (this.lregistros !== null && this.lregistros instanceof Array) {
            for (const k in this.lregistros) {
                if (this.lregistros.hasOwnProperty(k)) {
                    if (this.lregistros[k] !== undefined && this.lregistros[k].hasOwnProperty('idreg')) {
                        this.lregistros[k].idreg = Math.floor((Math.random() * 100000) + 1);
                    }
                    if (this.lregistros[k] !== undefined && this.lregistros[k].hasOwnProperty('idreg')) {
                        delete this.lregistros[k].id;
                    }
                    // Inicializa las fecha que son representadas como numero en la variable mcampos.camposfecha
                    const reg = this.lregistros[k];
                    this.generaCamposFechaRegistro(reg);
                }
            }
        }

        // clona los datos de la consulta original.
        if (this.lregistros !== null && this.lregistros !== undefined) {
            if (this.lregistros.length > 0) {
                this.registro = this.lregistros[0];
                if (this.esform) { this.formvalidado = true; this.editable = false; }
            } else {
                // if (this.esform) { this.componentehijo.crearNuevo(); } else { this.crearnuevoRegistro(); }
                if (this.llamarnuevo) {
                    try {
                        this.componentehijo.crearNuevo();
                    } catch (e) { console.log(e) }
                }
                this.mostrarDialogoGenerico = false;
            }
            this.lregistrosOriginales = JSON.parse(JSON.stringify(this.lregistros));
        } else {
            this.lregistros = [];
            this.lregistrosOriginales = [];
            // if (this.esform) { this.inicializaFormulario(); } else { this.componentehijo.crearNuevo() } // Encerar para que no de undefined en la edicion de un registro.
            if (this.llamarnuevo) {
                try {
                    this.componentehijo.crearNuevo();
                } catch (e) { console.log(e) }
            }
            this.mostrarDialogoGenerico = false;
        }
        // Encera registros a eliminar.
        this.lregistroseliminar = [];
    }

    public generaCamposFechaRegistro(reg: any) {
        for (const key in this.mcampos.camposfecha) {
            if (reg === undefined || reg == null) {
                continue;
            }
            if (this.mcampos.camposfecha.hasOwnProperty(key) && reg[key] !== undefined && reg[key] !== null) {
                // Si es objeto y tiene varios keys, entonces es pk
                if (typeof this.mcampos.camposfecha[key] === 'object' && this.mcampos.camposfecha[key] != null) {
                    if (Object.keys(this.mcampos.camposfecha[key]).length > 0) {
                        const objetopk = this.mcampos.camposfecha[key];
                        for (const j in objetopk) {
                            if (objetopk.hasOwnProperty(j)) {
                                const datestr = reg['pk'][j].toString();
                                // Si la long es diferente de 8 no es fecha
                                if (datestr.length !== 8 || isNaN(datestr)) {
                                    continue;
                                }
                                const anio = datestr.substr(0, 4);
                                const mes = datestr.substr(4, 2);
                                const dia = datestr.substr(6, 2);
                                if (this.estaVacio(reg.mdatos['pk'])) {
                                    reg.mdatos['pk'] = {};
                                }
                                reg.mdatos['pk'][j] = new Date(anio + '-' + mes + '-' + dia + ' 00:00:00');
                            }
                        }
                    }
                } else {         // De lo contrario es un campo normal
                    const datestr = reg[key].toString();
                    // Si la long es diferente de 8 no es fecha
                    if (datestr.length !== 8 || isNaN(datestr)) {
                        continue;
                    }
                    const anio = datestr.substr(0, 4);
                    const mes = datestr.substr(4, 2);
                    const dia = datestr.substr(6, 2);
                    reg.mdatos[key] = new Date(anio + '-' + mes + '-' + dia + ' 00:00:00');
                }
            }
        }
    }

    public actualizaRegistrosOriginales() {
        this.lregistrosOriginales = JSON.parse(JSON.stringify(this.lregistros));
    }

    // NUEVOS ***********************************************************************************************

    /**Metodo que adiciona a lista de entity beans sin datoa a utilizar en la creacion de nuevos registros. */
    crearNuevo(): any {
        this.crearnuevoRegistro();
        this.mostrarDialogoGenerico = true;
    }

    crearnuevoRegistro() {
        //this.encerarMensajes();
        this.registroNuevo = { 'mdatos': {}, 'actualizar': false, 'idreg': 0, 'esnuevo': true };
        /*
        if (this.espkcompuesto) {
          this.registroNuevo = {'mdatos': {'pk': {}}, 'actualizar': false, 'idreg': 0, 'esnuevo': true, 'pk': {}};
        } else {
          this.registroNuevo = {'mdatos': {}, 'actualizar': false, 'idreg': 0, 'esnuevo': true, 'pk': null};
        }
         */
        if (this.esform) {
            this.formvalidado = false;
        }
        this.registro = this.clone(this.registroNuevo);
        this.registroSeleccionado = this.clone(this.registroNuevo);
        this.registro.esnuevo = true;
        if (this.registro.hasOwnProperty('idreg')) {
            this.registro.idreg = Math.floor((Math.random() * 100000) + 1);
        }
    }

    crearNuevoArchivo() {
        return new Archivo();
    }

    // MANTENIMINTO *****************************************************************************************
    /**Adiciona un objeto Mantenimiento, asociado a un entity bean a grabar
     * Se puede consultar varias tablas en un solo request.
    */
    getMantenimiento(posicion: number, esmonetario = false): Mantenimiento {
        const mantenimiento = new Mantenimiento(this.entityBean, posicion);
        mantenimiento.esMonetario = esmonetario;
        // Actualiza campos fecha
        this.actualizaCamposFecha(this.lregistros);
        mantenimiento.completarInsUpdDel(this.lregistros, this.lregistrosOriginales, this.lregistroseliminar);
        return mantenimiento;
    }

    /** Actualiza los campos fecha desde la variable mcampos de la entidad, en los
     * registros en el campo de cada registro con formato numero
    */
    actualizaCamposFecha(listaregistros: any) {
        for (const k in listaregistros) {
            if (this.lregistros.hasOwnProperty(k)) {
                // Inicializa las fecha que son representadas como numero en la variable mcampos.camposfecha
                const reg = this.lregistros[k];
                for (const key in this.mcampos.camposfecha) {
                    if (this.mcampos.camposfecha.hasOwnProperty(key)) {
                        // Si es objeto y tiene varios keys, entonces es pk
                        if (typeof this.mcampos.camposfecha[key] === 'object' && this.mcampos.camposfecha[key] != null) {
                            if (Object.keys(this.mcampos.camposfecha[key]).length > 0) {
                                const objetopk = this.mcampos.camposfecha[key];
                                for (const j in objetopk) {
                                    if (objetopk.hasOwnProperty(j)) {
                                        reg['pk'][key] = this.fechaToInteger(reg.mdatos['pk'][key]);
                                    }
                                }
                            }
                        } else if (reg.mdatos[key] !== undefined) {
                            // De lo contrario es un campo normal
                            if (this.estaVacio(reg.mdatos[key])) {
                                if (!this.camposdinamicos) {
                                    reg[key] = null;
                                }
                            } else {
                                reg[key] = this.fechaToInteger(reg.mdatos[key]);
                            }
                        }
                    }
                }
            }
        }
    }


    /**Adiciona un objeto Mantenimiento dado un alias, asociado a un entity bean a grabar
     * Se puede consultar varias tablas en un solo request.
    */
    recargar() {
        this.router.navigate([''], { skipLocationChange: true });
    }

    addMantenimientoPorAlias(alias: string, mantenimiento: Mantenimiento) {
        const dto = new DtoMantenimiento(alias, mantenimiento);
        this.lmantenimiento.push(dto);
    }

    /**Graba informacion de la transaccion */
    grabar(multiplecommit = true, appName: any = null, metodo: any = null) {
        if (!this.validaGrabar()) {
            return;
        }

        if (this.controlGrabar(multiplecommit)) {
            return;
        }
        this.rqMantenimiento.mdatos.MARCHIVOSNG = this.marchivosng;
        this.rqMantenimiento.mdatos.mbce = this.lregistrosbce;
        //this.encerarMensajes();
        const rqMan = this.getRequestMantenimiento();
        this.dtoServicios.ejecutarRestMantenimiento(rqMan, appName, metodo).subscribe(
            resp => {
                if (resp.cod === 'OK') {
                    this.grabo = true;
                }
                //this.encerarMensajes();
                this.respuestacore = resp;
                this.componentehijo.postCommit(resp);
                this.dtoServicios.llenarMensaje(resp, true, this.limpiamsgpeticion); // solo presenta errores.
                this.enproceso = false;
            },
            error => {
                this.dtoServicios.manejoError(error);
                this.enproceso = false;
                this.grabo = false;
            }
            // finalizacion
        );
    }

    /**
     * Metodo que realiza controles para permitir o no grabar
     */
    controlGrabar(multiplecommit: boolean): boolean {
        if (this.enproceso) {
            return true; // Si esta en ejecucion al core no volver a enviar el mantenimiento.
        }
        if (!multiplecommit && this.grabo) {
            this.mostrarMensajeError('TRANSACCIÓN YA APLICADA');
            return true; // Control de un solo commit
        }
        this.enproceso = true;
        //this.encerarMensajes();
        return false;
    }

    /**Metodo que realiza validaciones antes de grabar*/
    validaGrabar(msg = 'NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO') {
        if (this.esform && (!this.formvalidado || this.editable)) {
            this.mostrarMensajeError(msg);
            return false;
        }
        return true;
    }

    /**Entrega la metadata a enviar al core para realizar mantenimientos. */
    getRequestMantenimiento() {
        const metadataMantenimiento = new Object();
        // Adiciona campos de control de mantenimiento.
        for (const i in this.rqMantenimiento) {
            if (this.rqMantenimiento.hasOwnProperty(i)) {
                metadataMantenimiento[i] = this.rqMantenimiento[i];
            }
        }

        // Adiciona metadata de entity beans que tiene dml.
        for (const i in this.lmantenimiento) {
            if (this.lmantenimiento.hasOwnProperty(i)) {
                const dto: DtoMantenimiento = this.lmantenimiento[i];
                if (dto.mantenimiento.tieneCambios()) {
                    metadataMantenimiento[dto.alias] = dto.mantenimiento;
                }
            }

        }
        return metadataMantenimiento;
    }

    /**Metodo que se ejecuta luego de realiar mantenimiento del entity bean. */
    public postCommitEntityBean(resp: any, dtoext: DtoMantenimiento = null) {
        if (resp.cod !== 'OK') {
            return;
        }
        let dto: DtoMantenimiento = null;
        if (dtoext !== null) {
            dto = dtoext;
        } else {
            dto = this.getDtoMantenimiento();
        }
        if (dto === undefined) {
            return;
        }
        const registrosRespuesta = resp[dto.alias];
        dto.mantenimiento.postCommit(this.lregistros, registrosRespuesta);
        // actualiza datos originales con los valores cambiados.
        this.lregistrosOriginales = JSON.parse(JSON.stringify(this.lregistros), this.dtoServicios.dateParser);
        this.lregistroseliminar = [];
    }

    /**Metodo que se ejecuta luego de realiar mantenimiento del entity bean. */
    public postCommitNodosArbol(resp: any, nodo: any) {
        if (resp.cod !== 'OK') {
            return;
        }
        for (const i in this.lregistros) {
            if (this.lregistros.hasOwnProperty(i)) {
                const nodearray = this.buscarNodo(nodo, this.lregistros[i].idreg);
                if (nodearray != null) {
                    this.actualizaNodoSeleccionado(nodearray[0], this.lregistros[i]);
                }
            }
        }
    }

    /**Entrega un objeto DtoMantenimiento, para el aliad de la transaccion. */
    protected getDtoMantenimiento(aliasext = null): DtoMantenimiento {
        let dto: DtoMantenimiento;
        let aliasoficial = null;
        if (aliasext !== null) {
            aliasoficial = aliasext;
        } else {
            aliasoficial = this.alias;
        }
        for (const i in this.lmantenimiento) {
            if (this.lmantenimiento.hasOwnProperty(i)) {
                dto = this.lmantenimiento[i];
                if (dto.alias === aliasoficial) {
                    break;
                }
            }

        }
        return dto;
    }

    /**Realiza copia del registro seleccionado para poder editar y reversar los cambios. */
    public selectRegistro(registro: any) {
        this.registroSeleccionado = registro;
        this.registro = this.clone(this.registroSeleccionado);
        this.mostrarDialogoGenerico = true;
    }


    /**Encera mensajes. */
    public encerarMensajes(): void {
        this.msgs = [];
        this.dtoServicios.mostrarMensaje(this.msgs);
    }

    /**Fija un mensaje de error. */
    protected mostrarMensajeError(texto: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: texto, detail: '' });
        this.dtoServicios.mostrarMensaje(this.msgs);
    }

    /**Fija un mensaje tipo warning. */
    protected mostrarMensajeWarn(texto: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: texto, detail: '' });
        this.dtoServicios.mostrarMensaje(this.msgs);
    }

    /**Adiciona un mensaje informativo. */
    protected mostrarMensajeInfo(texto: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: texto, detail: '' });
        this.dtoServicios.mostrarMensaje(this.msgs);
    }

    /**Adiciona un mensaje de exisot. */
    protected mostrarMensajeSuccess(texto: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: texto, detail: '' });
        this.dtoServicios.mostrarMensaje(this.msgs);
    }

    /**Valida que el resgistro qye llega como parametros, esta en la lista de registros. */
    protected existe(registro: any): boolean {
        let existe = false;
        if (this.lregistros === undefined) {
            return false;
        }
        for (const i in this.lregistros) {
            if (this.lregistros.hasOwnProperty(i)) {
                const reg = this.lregistros[i];
                if (reg.hasOwnProperty('idreg') && reg.idreg === registro.idreg) {
                    existe = true;
                    break;
                }
            }
        }
        return existe;
    }

    /**Si es true retorna 1 caso contrario retorna 0 */
    public booleanToString(valor: boolean): string {
        let opcion = '1';
        if (!valor) {
            opcion = '0';
        }
        return opcion;
    }

    /**Si el valor es 1 retorna true, caso contrario retorna false. */
    public stringToBoolean(valor: any): boolean {
        let opcion = true;
        if (valor === undefined || valor !== '1') {
            opcion = false;
        }
        return opcion;
    }

    /**Transforma una fecha entero en formato yyyyyMMdd a una fecha en formato yyyy-MM-dd */
    public integerToFormatoFecha(valor: number): string {
        if (this.estaVacio(valor)) {
            return null;
        }
        // ejemplo yyyyMMdd 20170131    31 de enero del 2017
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        const dia = valor.toString().substring(6, 8);
        const fecha = anio + '-' + mes + '-' + dia;
        return fecha;
    }

    /**Transforma una fecha entero en formato yyyyyMMdd a una fecha en formato dd-MM-yyyy */
    public integerToDate(valor: number): Date {
        if (this.estaVacio(valor)) {
            return null;
        }
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        let dia = valor.toString().substring(6, 8);
        if (this.estaVacio(dia)) {
            dia = '01';
        }
        return new Date(Number(anio), (Number(mes) - 1), Number(dia));
    }

	/** Metodo que convierte un texto HHmm a fecha  */
    public ConvertirTextoHora(texto: string): Date {
      if (this.estaVacio(texto)) {
        return undefined;
      }

      const fecha = new Date();
      const hora = texto.substring(0, 2);
      const minutos = texto.substring(3, 5);

      return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), Number(hora), Number(minutos));
    }
	
	/**Entregar de una fecha entero el año */
    public integerToYear(valor: number): number {
        if (this.estaVacio(valor)) {
            return null;
        }
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        let dia = valor.toString().substring(6, 8);
        if (this.estaVacio(dia)) {
            dia = '01';
        }
        return Number(anio);
    }

    /**Entregar de una fecha entero el mes */
    public integerToMounth(valor: number): number {
        if (this.estaVacio(valor)) {
            return null;
        }
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        let dia = valor.toString().substring(6, 8);
        if (this.estaVacio(dia)) {
            dia = '01';
        }
        return Number(mes);
    }

    /**Entregar de una fecha entero el mes */
    public StringToMounth(valor: number): string {
        if (this.estaVacio(valor)) {
            return null;
        }
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        let dia = valor.toString().substring(6, 8);
        if (this.estaVacio(dia)) {
            dia = '01';
        }
        return (mes);
    }

    /**Transforma una fecha en formato dd-MM-yyyy a una fecha en entero formato yyyyMMdd */
    public formatoFechaToInteger(valor: string): number {
        if (this.estaVacio(valor)) {
            return null;
        }
        // ejemplo dd-MM-yyyy 31-01-1971    31 de enero del 2017
        const anio = valor.substring(6, 10);
        const mes = valor.substring(3, 5);
        const dia = valor.substring(0, 2);
        const fecha: string = anio + mes + dia;
        return Number(fecha);
    }

    public stringToFecha(valor: string): Date {
        // ejemplo dd-MM-yyyy 31-01-1971    31 de enero del 2017
        const anio = +valor.substring(0, 4);
        const mes = +valor.substring(5, 7) - 1;
        const dia = +valor.substring(8, 10);
        const fecha: Date = new Date(anio, mes, dia);
        return fecha;
    }

    /**Verifica que una variable con tipo de dato basico este vacio, si es un objeto verifica
     * que los atributos esten vacios
     */
    public estaVacio(obj: any): boolean {
        if (obj === undefined || obj === null || obj === '' || (typeof obj === 'object' && !(obj instanceof Date) && Object.keys(obj).length === 0) || obj.length <= 0) {
            return true;
        }
        return false;
    }

    fechaToInteger(fecha: Date): number {
        if (this.estaVacio(fecha)) {
            return null;
        }
        const f = fecha;
        const curr_date = f.getDate();
        const curr_month = f.getMonth() + 1;
        const curr_year = f.getFullYear();
        let monthstr = '' + curr_month;
        let daystr = '' + curr_date;
        if (curr_month < 10) { monthstr = '0' + curr_month; }
        if (curr_date < 10) { daystr = '0' + curr_date; }
        return Number(curr_year + '' + monthstr + '' + daystr);
    }

	 /** Metodo que convierte una fecha con hora a texto (HHMM)  */
    public ConvertirHoraTexto(fecha: Date): string {
      if (this.estaVacio(fecha)) {
        return null;
      }
      const horafecha = fecha.getHours();
      const minutosfecha = fecha.getMinutes();
      let hora = '' + horafecha;
      let minutos = '' + minutosfecha;
      if (horafecha < 10) { hora = '0' + horafecha; }
      if (minutosfecha < 10) { minutos = '0' + minutosfecha; }
      return hora + ':' + minutos;
    }
    horaToInteger(fecha: Date): number {
        if (this.estaVacio(fecha)) {
            return null;
        }
        const f = fecha;
        const curr_hours = f.getHours();
        const curr_minutes = f.getMinutes();
        const curr_seconds = f.getSeconds();
        let hourstr = '' + curr_hours;
        let minutestr = '' + curr_minutes;
        let secondstr = '' + curr_seconds;
        if (curr_hours < 10) { hourstr = '0' + curr_hours; }
        if (curr_minutes < 10) { minutestr = '0' + curr_minutes; }
        if (curr_seconds < 10) { secondstr = '0' + curr_seconds; }
        return Number(hourstr + '' + minutestr + '' + secondstr);
    }

    fechaToIntegerMes(fecha: Date): number {
        if (this.estaVacio(fecha)) {
            return null;
        }
        const f = fecha;
        const curr_date = f.getDate();
        const curr_month = f.getMonth() + 1;
        const curr_year = f.getFullYear();
        let monthstr = '' + curr_month;
        //let daystr = '' + curr_date;
        if (curr_month < 10) { monthstr = '0' + curr_month; }
        //if (curr_date < 10) { daystr = '0' + curr_date; }
        return Number(curr_year + '' + monthstr);
    }

    public calendarToFechaString(fecha: Date): string {
        if (this.estaVacio(fecha)) {
            return null;
        }
        const f = fecha;
        const curr_date = f.getDate();
        const curr_month = f.getMonth() + 1;
        const curr_year = f.getFullYear();
        let monthstr = '' + curr_month;
        let daystr = '' + curr_date;
        if (curr_month < 10) { monthstr = '0' + curr_month; }
        if (curr_date < 10) { daystr = '0' + curr_date; }
        return (curr_year + '-' + monthstr + '-' + daystr);
    }

    fechaToParticion(fecha: Date): number {
        if (this.estaVacio(fecha)) {
            return null;
        }
        const f = fecha;
        const curr_date = f.getDate();
        const curr_month = f.getMonth() + 1;
        const curr_year = f.getFullYear();
        let monthstr = '' + curr_month;
        let daystr = '' + curr_date;
        if (curr_month < 10) { monthstr = '0' + curr_month; }
        if (curr_date < 10) { daystr = '0' + curr_date; }
        return Number(curr_year + '' + monthstr);
    }
    public calcularAnios(fechainicio, fechafinal): string {
        if (this.estaVacio(fechainicio) || this.estaVacio(fechafinal)) {
            return null;
        }

        const fechaI = new Date(fechainicio);
        const fechaF = new Date(fechafinal);

        const diff = Math.abs(fechaI.getTime() - fechaF.getTime());
        const dia = 1000 * 60 * 60 * 24; //86400000
        const dias = Math.floor(diff / dia);

        const anos = Math.floor(dias / 365);
        const anosr = dias % 365;
        const meses = Math.floor(anosr / 30);
        const diasf = anosr % 30;

        return anos + ' años ' + meses + ' meses y ' + diasf + ' días';

    }

    fechaFinalDateYear(fecha: Date): Date {
        if (fecha == null) {
            return null;
        }
        const curr_year = fecha.getFullYear();
        return this.anioFinalDateYear(curr_year);
    }

    anioFinalDateYear(anio: any): Date {
        if (anio == null) {
            return null;
        }
        return new Date(anio + '-12-31 00:00:00');
    }

    descargarBytes(bytes: any, formatoexportar: string, nombreArchivo: string): void {
        const linkElement = document.createElement('a');
        try {
            let contenttype = '';
            if (formatoexportar === 'pdf') {
                contenttype = 'application/pdf';
            } else if (formatoexportar === 'xls') {
                contenttype = 'application/vnd.ms-excel';
            } else {
                contenttype = 'application/octet-stream';
            }
            const archivo = 'data:' + formatoexportar + ';base64,' + bytes;

            linkElement.setAttribute('href', archivo);
            linkElement.setAttribute('download', nombreArchivo + '.' + formatoexportar);

            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            linkElement.dispatchEvent(clickEvent);
        } catch (ex) {
        }
    }

    buscarNodo(nodo: any, idreg: number) {
        let nodoencontrado = null;
        if (!this.estaVacio(nodo.children)) {
            nodoencontrado = nodo.children.filter(n => n.data.reg.idreg === idreg);
            if (!this.estaVacio(nodoencontrado)) {
                return nodoencontrado;
            } else {
                for (const i in nodo.children) {
                    if (nodo.children.hasOwnProperty(i)) {
                        nodoencontrado = this.buscarNodo(nodo.children[i], idreg);
                        if (!this.estaVacio(nodoencontrado)) {
                            return nodoencontrado;
                        }
                    }
                }
            }
        } else {
            return null;
        }
    }

    actualizaNodoSeleccionado(nodoSeleccionado, registro) {
        nodoSeleccionado.data.reg = registro;
        if (!registro.mdatos.eshoja) {
            nodoSeleccionado.data.nombre = registro.nombre;
        } else {
            nodoSeleccionado.data.nombre = registro.mdatos.ntransaccion;
        }
    }

    obtenerListaFromObjeto(obj, sort = false, asObject = false, sortName = 'nombre') {
        let lista = Object.keys(obj).map(key => {
            let val = obj[key];
            if (asObject) {
                val = { k: key, v: obj[key] };
            }
            return val;
        });

        if (sort) {
            lista = Object.keys(obj).sort().map(key => {
                let val = obj[key];
                if (asObject) {
                    val = { k: key, v: obj[key] };
                }
                return val;
            });
            if (!asObject) {
                lista = lista.sort((a, b) => (a[sortName] > b[sortName]) ? 1 : -1);
            }
        }
        return lista;
    }

    public sumarDias(fecha, dias) {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

    /**Redondea el valor con la precision enviada*/
    public redondear(value, precision): number {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    /**Rellena de caracteres el tamanio indicado*/
    public rellenaCaracteres(value: string, caracter: string, size: number): string {
        return (String(caracter).repeat(size) + value).substr((size * -1), size);
    }

    public rellenaCaracteresIzquierda(input, length, padding) {
        while ((input = input.toString()).length + (padding = padding.toString()).length < length) {
            padding += padding;
        }
        return padding.substr(0, length - input.length) + input;
    }

    /**Vacia la lista enviada*/
    public limpiaLista(pLista: any): any {
        while (pLista.length > 0) {
            pLista.pop();
        }
    }

    /**Genera registro para procesar BCE. */
    public crearBce(registro, identificacionbeneficiario: string, nombrebeneficiario: string, numerocuentabeneficiario: string,
        codigobeneficiario: number, tipocuentacdetalle: string, tipocuentaccatalogo: number, institucioncdetalle: string,
        institucionccatalogo: number, valorpago: number, referenciainterna: string, secuenciainterna: number = null,
        email: string = null, telefono: string = null, numerosuministro: string = null, tipotransaccion: string) {
        this.registrosbce = {};
        this.registrosbce.esnuevo = true;
        this.registrosbce.idreg = registro.idreg;
        this.registrosbce.identificacionbeneficiario = identificacionbeneficiario;
        this.registrosbce.nombrebeneficiario = nombrebeneficiario;
        this.registrosbce.numerocuentabeneficiario = numerocuentabeneficiario;
        this.registrosbce.codigobeneficiario = codigobeneficiario;
        this.registrosbce.tipocuentacdetalle = tipocuentacdetalle;
        this.registrosbce.tipocuentaccatalogo = tipocuentaccatalogo;
        this.registrosbce.institucioncdetalle = institucioncdetalle;
        this.registrosbce.institucionccatalogo = institucionccatalogo;
        this.registrosbce.valorpago = valorpago;
        this.registrosbce.referenciainterna = referenciainterna;
        this.registrosbce.secuenciainterna = secuenciainterna;
        this.registrosbce.email = email;
        this.registrosbce.telefono = telefono;
        this.registrosbce.numerosuministro = numerosuministro;
        this.registrosbce.tipotransaccion = tipotransaccion;
        this.lregistrosbce.push(this.registrosbce);
    }

    public eliminarBce(referenciainterna: string, secuenciainterna: number, tipotransaccion: string) {
        this.registrosbce = {};
        this.registrosbce.esnuevo = false;
        this.registrosbce.referenciainterna = referenciainterna;
        this.registrosbce.secuenciainterna = secuenciainterna;
        this.registrosbce.tipotransaccion = tipotransaccion;
        this.lregistrosbce.push(this.registrosbce);
    }
}

export class Archivo {
    codigo: number = null;
    nombre: string = '';
    archivobytes: any = null;
    extension: string = null;
    tamanio: number = null;
}


