import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActivosfijosRoutingModule } from './activosfijos.routing';
import { ActivosfijosComponent } from './componentes/activosfijos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ActivosfijosRoutingModule, JasperModule, SpinnerModule ],
  declarations: [ActivosfijosComponent]
})
export class ActivosfijosModule { }
