import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DividendosComponent } from './componentes/dividendos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { DividendosRoutingModule } from './dividendos.routing';

@NgModule({
  imports: [SharedModule, DividendosRoutingModule, JasperModule, SpinnerModule ],
  declarations: [DividendosComponent]
})
export class DividendosModule { }
