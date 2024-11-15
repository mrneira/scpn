import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldosliquidarComponent } from './componentes/saldosliquidar.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { SaldosliquidarRoutingModule } from './saldosliquidar.routing';

@NgModule({
  imports: [SharedModule, SaldosliquidarRoutingModule, JasperModule, SpinnerModule ],
  declarations: [SaldosliquidarComponent]
})
export class SaldosliquidarModule { }
