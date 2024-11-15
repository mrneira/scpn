import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenPortafolioComponent } from './componentes/resumenportafolio.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { ResumenPortafolioRoutingModule } from './resumenportafolio.routing';

@NgModule({
  imports: [SharedModule, ResumenPortafolioRoutingModule, JasperModule, SpinnerModule ],
  declarations: [ResumenPortafolioComponent]
})
export class ResumenPortafolioModule { }
