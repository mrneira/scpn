import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConciliacionBancariaPichinchaRoutingModule } from './conciliacionbancariapichincha.routing';
import { ConciliacionBancariaPichinchaComponent } from './componentes/conciliacionbancariapichincha.component';
import { LovBancosModule } from '../../../contabilidad/lov/bancos/lov.bancos.module';
import { TooltipModule} from 'primeng/primeng'

@NgModule({
  imports: [
    SharedModule, 
    ConciliacionBancariaPichinchaRoutingModule, 
    LovBancosModule,TooltipModule ],
  declarations: [ConciliacionBancariaPichinchaComponent],
  exports: [ConciliacionBancariaPichinchaComponent]
})
export class ConciliacionBancariaPichinchaModule { }
