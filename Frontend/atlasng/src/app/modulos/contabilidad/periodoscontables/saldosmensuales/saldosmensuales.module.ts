import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldosMensualesRoutingModule } from './saldosmensuales.routing';
import { SaldosMensualesComponent } from './componentes/saldosmensuales.component';

@NgModule({
  imports: [SharedModule, SaldosMensualesRoutingModule ],
  declarations: [SaldosMensualesComponent]
})
export class SaldosMensualesModule { }
