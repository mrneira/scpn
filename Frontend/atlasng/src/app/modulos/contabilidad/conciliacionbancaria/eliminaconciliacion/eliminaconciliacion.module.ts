import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EliminaconciliacionRoutingModule } from './eliminaconciliacion.routing';
import { EliminaconciliacionComponent } from './componentes/eliminaconciliacion.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { TooltipModule} from 'primeng/primeng'

@NgModule({
  imports: [
    SharedModule, 
    EliminaconciliacionRoutingModule, 
    LovPersonasModule, 
    LovCuentasContablesModule,TooltipModule ],
  declarations: [EliminaconciliacionComponent],
  exports: [EliminaconciliacionComponent]
})
export class EliminaconciliacionModule { }
