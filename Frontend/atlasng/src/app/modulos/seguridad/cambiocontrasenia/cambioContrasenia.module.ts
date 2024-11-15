import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CambioContraseniaRoutingModule } from './cambioContrasenia.routing';
import { CambioContraseniaComponent } from './componentes/cambioContrasenia.component';


@NgModule({
  imports: [SharedModule, CambioContraseniaRoutingModule ],
  declarations: [CambioContraseniaComponent]
})
export class CambioContraseniaModule { }
