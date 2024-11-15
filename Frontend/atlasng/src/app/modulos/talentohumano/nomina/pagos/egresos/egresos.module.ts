import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PagosEgresosRoutingModule } from './egresos.routing';

import { PagoEgresosComponent } from './componentes/egresos.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, PagosEgresosRoutingModule,LovFuncionariosModule,SplitButtonModule ],
  declarations: [PagoEgresosComponent]
})
export class PagoEgresosModule { }
