import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CierrePeriodoContableRoutingModule } from './cierreperiodocontable.routing';
import { CierrePeriodoContableComponent } from './componentes/cierreperiodocontable.component';

@NgModule({
  imports: [SharedModule, CierrePeriodoContableRoutingModule ],
  declarations: [CierrePeriodoContableComponent]
})
export class CierrePeriodoContableModule { }
