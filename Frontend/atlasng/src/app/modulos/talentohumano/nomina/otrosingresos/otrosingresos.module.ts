import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OtrosIngresosRoutingModule } from './otrosingresos.routing';
import { OtrosIngresosComponent } from './componentes/otrosingresos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
    imports: [SharedModule, OtrosIngresosRoutingModule, LovFuncionariosModule, GestorDocumentalModule],
    declarations: [OtrosIngresosComponent]
})
export class OtrosIngresosModule { }
