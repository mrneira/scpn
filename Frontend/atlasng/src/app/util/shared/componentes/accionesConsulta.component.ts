import { Component, Input } from '@angular/core';
import { BaseComponent } from './base.component';

@Component({
    selector: 'acciones-consulta',
    templateUrl: 'accionesConsulta.html'
})

export class AccionesConsultaComponent {

    @Input()
    componente: BaseComponent;

    @Input()
    consulta: boolean = true;

    @Input()
    anterior: boolean = true;

    @Input()
    siguiente: boolean = true;

}