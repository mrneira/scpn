import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ReversoRoutingModule } from './reverso.routing';
import { ReversoComponent } from './componentes/reverso.component';

@NgModule({
  imports: [
    SharedModule, 
    ReversoRoutingModule

  ],
  declarations: [ReversoComponent],
  exports: [ReversoComponent]
})
export class ReversoModule { }
