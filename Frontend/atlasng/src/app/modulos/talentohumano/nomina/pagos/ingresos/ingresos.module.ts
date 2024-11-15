import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PagosIngresosRoutingModule } from './ingresos.routing';

import { PagoIngresosComponent } from './componentes/ingresos.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, PagosIngresosRoutingModule,LovFuncionariosModule,SplitButtonModule ],
  declarations: [PagoIngresosComponent]
})
export class PagoIngresosModule { }
