import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConciliacionbancariaRoutingModule } from './conciliacionbancaria.routing';
import { ConciliacionbancariaComponent } from './componentes/conciliacionbancaria.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { TooltipModule} from 'primeng/primeng'

@NgModule({
  imports: [
    SharedModule, 
    ConciliacionbancariaRoutingModule,  
    LovCuentasContablesModule,TooltipModule ],
  declarations: [ConciliacionbancariaComponent],
  exports: [ConciliacionbancariaComponent]
})
export class ConciliacionbancariaModule { }
