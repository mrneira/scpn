import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MayornoconciliadoRoutingModule } from './mayornoconciliado.routing';
import { MayornoconciliadoComponent } from './componentes/mayornoconciliado.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    MayornoconciliadoRoutingModule, 
    LovPersonasModule, 
    LovCuentasContablesModule,TooltipModule,JasperModule ],
  declarations: [MayornoconciliadoComponent],
  exports: [MayornoconciliadoComponent]
})

export class MayornoconciliadoModule { }
