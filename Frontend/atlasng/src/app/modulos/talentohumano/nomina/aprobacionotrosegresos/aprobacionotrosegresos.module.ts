import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionOtrosEgresosRoutingModule } from './aprobacionotrosegresos.routing';
import { AprobacionOtrosEgresosComponent } from './componentes/aprobacionotrosegresos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
    imports: [SharedModule, AprobacionOtrosEgresosRoutingModule, LovFuncionariosModule],
    declarations: [AprobacionOtrosEgresosComponent]
})
export class AprobacionOtrosEgresosModule { }
