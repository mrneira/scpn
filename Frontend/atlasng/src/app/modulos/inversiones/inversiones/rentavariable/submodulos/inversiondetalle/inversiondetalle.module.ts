import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InversiondetalleRoutingModule } from './inversiondetalle.routing';
import { InversiondetalleComponent } from './componentes/inversiondetalle.component';

@NgModule({
  imports: [
    SharedModule, 
    InversiondetalleRoutingModule ],
  declarations: [InversiondetalleComponent],
  exports: [InversiondetalleComponent]
})
export class InversiondetalleModule { }
