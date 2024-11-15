import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ImpuestorentaRoutingModule } from './impuestorenta.routing';

import { ImpuestorentaComponent } from './componentes/impuestorenta.component';

import{ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, ImpuestorentaRoutingModule,LovFuncionariosModule,ParametroAnualModule],
  declarations: [ImpuestorentaComponent],
  exports: [ImpuestorentaComponent]
})
export class ImpuestoRentaModule { }
