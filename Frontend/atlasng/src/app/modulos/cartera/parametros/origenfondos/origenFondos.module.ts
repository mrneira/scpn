import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OrigenFondosRoutingModule } from './origenFondos.routing';
import { OrigenFondosComponent } from './componentes/origenFondos.component';


@NgModule({
  imports: [SharedModule, OrigenFondosRoutingModule ],
  declarations: [OrigenFondosComponent],
  exports: [OrigenFondosComponent]
})
export class OrigenFondosModule { }
