import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PlananualComponent } from './componentes/plananual.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { PlananualRoutingModule } from './plananual.routing';

@NgModule({
  imports: [SharedModule, PlananualRoutingModule, JasperModule, SpinnerModule ],
  declarations: [PlananualComponent]
})
export class PlananualModule { }
