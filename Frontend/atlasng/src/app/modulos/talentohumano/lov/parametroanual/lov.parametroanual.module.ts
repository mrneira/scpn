import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametroanualRoutingModule } from './lov.parametroanual.routing';
import { ParametroanualComponent } from './componentes/lov.parametroanual.component';

@NgModule({
  imports: [SharedModule, ParametroanualRoutingModule],
  declarations: [ParametroanualComponent],
  exports: [ParametroanualComponent]
})
export class ParametroAnualModule { }

