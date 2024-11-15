import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FondoliquidezComponent } from './componentes/fondoliquidez.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { FondoLiquidezRoutingModule } from './fondoliquidez.routing';

@NgModule({
  imports: [SharedModule, FondoLiquidezRoutingModule, JasperModule, SpinnerModule ],
  declarations: [FondoliquidezComponent]
})
export class FondoLiquidezModule { }
