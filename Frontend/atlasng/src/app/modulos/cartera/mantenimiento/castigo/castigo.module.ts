import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { CastigoRoutingModule } from './castigo.routing';
import { CastigoComponent } from './componentes/castigo.component';

@NgModule({
  imports: [SharedModule, CastigoRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [CastigoComponent]
})
export class CastigoModule { }
