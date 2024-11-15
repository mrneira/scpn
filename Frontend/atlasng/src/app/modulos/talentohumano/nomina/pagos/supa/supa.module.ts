import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PagoSupaRoutingModule } from './supa.routing'

import {PagoSupaComponent } from './componentes/supa.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import{ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, PagoSupaRoutingModule,LovFuncionariosModule,SplitButtonModule,ParametroAnualModule ],
  declarations: [PagoSupaComponent]
})
export class PagoSupaModule { }
