import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionOtrosIngresosRoutingModule } from './aprobacionotrosingresos.routing';
import { AprobacionOtrosIngresosComponent } from './componentes/aprobacionotrosingresos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
    imports: [SharedModule, AprobacionOtrosIngresosRoutingModule, LovFuncionariosModule],
    declarations: [AprobacionOtrosIngresosComponent]
})
export class AprobacionOtrosIngresosModule { }
