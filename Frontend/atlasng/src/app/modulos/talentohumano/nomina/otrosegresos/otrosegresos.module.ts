import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OtrosEgresosRoutingModule } from './otrosegresos.routing';
import { OtrosEgresosComponent } from './componentes/otrosegresos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
    imports: [SharedModule, OtrosEgresosRoutingModule, LovFuncionariosModule, GestorDocumentalModule],
    declarations: [OtrosEgresosComponent]
})
export class OtrosEgresosModule { }
