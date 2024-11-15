import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LiquidacionesRoutingModule } from './liquidaciones.routing';
import { LiquidacionesComponent } from './componentes/liquidaciones.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
    imports: [SharedModule, LiquidacionesRoutingModule, LovFuncionariosModule],
    declarations: [LiquidacionesComponent]
})
export class LiquidacionesModule { }
