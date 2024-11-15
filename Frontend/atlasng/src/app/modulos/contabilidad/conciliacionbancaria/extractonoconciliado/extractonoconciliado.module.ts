import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ExtractonoconciliadoRoutingModule } from './extractonoconciliado.routing';
import { ExtractonoconciliadoComponent } from './componentes/extractonoconciliado.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    ExtractonoconciliadoRoutingModule, 
    LovPersonasModule, 
    LovCuentasContablesModule,TooltipModule,JasperModule ],
  declarations: [ExtractonoconciliadoComponent],
  exports: [ExtractonoconciliadoComponent]
})
export class ExtractonoconciliadoModule { }
