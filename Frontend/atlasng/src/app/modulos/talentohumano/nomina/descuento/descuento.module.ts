import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DescuentoRoutingModule } from './descuento.routing';

import { DescuentoComponent } from './componentes/descuento.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {LovDescuentoModule} from '../../lov/descuento/lov.descuento.module';

import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, DescuentoRoutingModule,LovFuncionariosModule,LovDescuentoModule,ParametroAnualModule ],
  declarations: [DescuentoComponent]
})
export class DescuentoModule { }
